from fastapi import APIRouter, Depends

from app.schemas.prediction_schema import (
    PredictionRequest,
    PredictionResponse
)

from app.services.prediction_service import calculate_prediction

from app.models.pregnancy_model import PregnancyRecord
from app.models.user_model import User

from app.middleware.auth_middleware import get_current_user



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



    risk_level = result.get(
        "risk_level",
        "Low"
    )


    risk_score = result.get(
        "risk_score",
        0
    )



    # =========================
    # SAVE PATIENT REPORT
    # =========================

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


        symptoms=data.symptoms,


        risk_score=int(
            risk_score
        ),


        risk_level=risk_level

    )


    await pregnancy_record.insert()



    return {


        "risk_level":
            risk_level,


        "risk_score":
            risk_score,


        "low_risk":
            result.get(
                "low_risk",
                0
            ),


        "medium_risk":
            result.get(
                "medium_risk",
                0
            ),


        "high_risk":
            result.get(
                "high_risk",
                0
            ),


        "recommendation":
            result.get(
                "recommendation",
                ""
            ),


        "reasons":
            result.get(
                "reasons",
                []
            )

    }