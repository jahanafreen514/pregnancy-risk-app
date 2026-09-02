from datetime import datetime, timezone
from fastapi import APIRouter, Depends

from app.schemas.prediction_schema import (
    PredictionRequest,
    PredictionResponse
)

from app.services.prediction_service import calculate_prediction

from app.models.pregnancy_model import PregnancyRecord
from app.models.user_model import User
from app.models.alert_model import Alert
from app.models.report_model import Report

from app.middleware.auth_middleware import get_current_user
from app.services.notification_service import notify_user


router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)



@router.post(
    "/predict",
    response_model=PredictionResponse
)
async def predict(
    data: PredictionRequest,
    current_user: User = Depends(get_current_user)
):

    result = calculate_prediction(data)


    risk_level = result["risk_level"]


    risk_score = result.get(
        "risk_score",
        0
    )


    # ==========================
    # SAVE PREGNANCY RECORD
    # ==========================

    pregnancy_record = PregnancyRecord(

        user_id=str(
            current_user.id
        ),


        pregnancy_week=data.pregnancy_week,


        bp_systolic=data.systolic_bp,


        bp_diastolic=data.diastolic_bp,


        sugar=data.blood_sugar,


        temperature=data.body_temp,


        heart_rate=data.heart_rate,


        symptoms=data.symptoms
        if hasattr(data, "symptoms")
        else [],


        risk_score=int(
            risk_score
        ),


        risk_level=risk_level,
        probability=result.get("probability"),
        model_version=result.get("model_version"),

    )


    await pregnancy_record.insert()

    # Store every prediction as a downloadable report visible to the patient and
    # their selected doctor.  This is separate from the raw monitoring record.
    report = Report(
        patient_id=str(current_user.id),
        patient_name=current_user.name,
        patient_email=current_user.email,
        doctor_id=current_user.selected_doctor,
        title=f"Pregnancy risk assessment — {risk_level}",
        summary=(
            f"Risk level: {risk_level}. Score: {int(risk_score)}. "
            f"Recommendation: {result.get('recommendation', '')}"
        ),
        risk_level=risk_level,
        risk_score=int(risk_score),
        confidence=float(result.get("probability_percent", 0)),
        recommendation=result.get("recommendation", ""),
        symptoms=data.symptoms or [],
        risk_factors=result.get("reasons", []),
        vitals={
            "age": data.age,
            "week": data.pregnancy_week,
            "bmi": data.bmi,
            "bpSystolic": data.systolic_bp,
            "bpDiastolic": data.diastolic_bp,
            "sugar": data.blood_sugar,
            "temperature": data.body_temp,
            "heartRate": data.heart_rate,
            "babyCount": data.baby_count,
            "babyWeight": data.baby_weight,
            "babyHeartRate": data.baby_heart_rate,
            "cervicalLength": data.cervical_length,
        },
    )
    await report.insert()

    # Reports are the primary record.  Notifications are secondary and must
    # never prevent a completed assessment from being saved.
    try:
        await notify_user(
            str(current_user.id),
            f"Pregnancy risk result: {risk_level}",
            result.get("recommendation", "Your pregnancy assessment is ready."),
            "suggestion",
        )
        if current_user.selected_doctor:
            await notify_user(
                current_user.selected_doctor,
                "New patient pregnancy report",
                f"{current_user.name} completed a {risk_level} risk assessment. Open Reports to review it.",
                "report",
            )
    except Exception:
        # The report is already saved; do not fail the prediction because a
        # delivery channel (websocket/email) is temporarily unavailable.
        pass

    if risk_level in {"High", "Medium"}:
        alert = Alert(
            user_id=str(current_user.id),
            title=f"{risk_level} pregnancy risk detected",
            message=result.get("recommendation", "Please contact your healthcare provider."),
            severity="critical" if risk_level == "High" else "warning",
        )
        await alert.insert()
        await notify_user(str(current_user.id), alert.title, alert.message, "risk_alert")
        if current_user.selected_doctor:
            await notify_user(
                current_user.selected_doctor,
                "Patient high-risk alert",
                f"{current_user.name} has received a high-risk prediction. Please review their record.",
                "risk_alert",
            )



    return {

        "risk_level": risk_level,


        "risk_score": risk_score,

        "probability": result.get("probability", 0),
        "probability_percent": result.get("probability_percent", 0),
        "prediction_time": datetime.now(timezone.utc).isoformat(),
        "model_version": result.get("model_version", "glowcare-pregnancy-risk-v1.0"),


        "low_risk": result.get(
            "low_risk",
            0
        ),


        "medium_risk": result.get(
            "medium_risk",
            0
        ),


        "high_risk": result.get(
            "high_risk",
            0
        ),


        "recommendation": result.get(
            "recommendation",
            ""
        ),


        "reasons": result.get(
            "reasons",
            []
        )

    }
