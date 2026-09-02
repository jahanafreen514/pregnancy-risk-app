from datetime import date
from fastapi import APIRouter, Depends, HTTPException

from app.middleware.auth_middleware import get_current_user
from app.models.user_model import User
from app.models.pregnancy_model import Appointment, PregnancyRecord
from app.models.prescription_model import Prescription
from app.models.reminder_model import Reminder
from app.schemas.user_schema import UserOut, UserUpdate


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


def pregnancy_timing(lmp_date: date | None, override: int | None) -> dict:
    """Compute pregnancy timing at read time; no fixed trimester is stored."""
    if not lmp_date:
        return {"pregnancy_week": None, "pregnancy_day": None, "trimester": override, "source": "manual" if override else None}
    days = max(0, (date.today() - lmp_date).days)
    week = min(days // 7 + 1, 42)
    calculated_trimester = 1 if week <= 13 else 2 if week <= 27 else 3
    return {"pregnancy_week": week, "pregnancy_day": days, "trimester": override or calculated_trimester, "source": "manual" if override else "lmp"}


@router.get("/me", response_model=UserOut)
async def me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.get("/me/overview")
async def overview(current_user: User = Depends(get_current_user)):
    """Single authenticated source for user dashboard/profile/suggestions."""
    user_id = str(current_user.id)
    records = await PregnancyRecord.find(PregnancyRecord.user_id == user_id).sort(-PregnancyRecord.created_at).limit(6).to_list()
    appointments = await Appointment.find(Appointment.patient_id == user_id).sort(Appointment.scheduled_for).to_list()
    reminders = await Reminder.find(Reminder.user_id == user_id, Reminder.enabled == True).count()
    prescriptions = await Prescription.find(Prescription.patient_id == user_id).to_list()
    if not prescriptions:
        prescriptions = await Prescription.find(Prescription.patient_email == current_user.email).to_list()
    latest = records[0] if records else None
    return {
        "user": {"name": current_user.name, "email": current_user.email, "phone": current_user.phone, "address": current_user.address, "blood_group": current_user.blood_group, "lmp_date": current_user.lmp_date, "language": current_user.language},
        "pregnancy_timing": pregnancy_timing(current_user.lmp_date, current_user.trimester_override),
        "latest": ({
            "risk_level": latest.risk_level, "risk_score": latest.risk_score,
            "probability": latest.probability, "model_version": latest.model_version,
            "pregnancy_week": latest.pregnancy_week, "heart_rate": latest.heart_rate,
            "bp_systolic": latest.bp_systolic, "bp_diastolic": latest.bp_diastolic,
            "sugar": latest.sugar, "temperature": latest.temperature,
            "symptoms": latest.symptoms, "created_at": latest.created_at,
        } if latest else None),
        "history": [{"created_at": item.created_at, "heart_rate": item.heart_rate, "risk_score": item.risk_score, "risk_level": item.risk_level, "probability": item.probability, "model_version": item.model_version} for item in reversed(records)],
        "appointments": [{"id": str(item.id), "scheduled_for": item.scheduled_for, "status": item.status, "appointment_type": item.appointment_type} for item in appointments],
        "active_reminders": reminders,
        "prescriptions": {"total": len(prescriptions), "completed": sum(item.status == "completed" for item in prescriptions)},
    }



@router.patch("/me", response_model=UserOut)
async def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user)
):

    fields = {
        "countryCode": "country_code",
        "phone": "phone",
        "address": "address",
        "name": "name",
        "selectedDoctor": "selected_doctor",
        "bloodGroup": "blood_group",
        "lmpDate": "lmp_date",
        "trimesterOverride": "trimester_override",
        "language": "language",
        "notificationsEnabled": "notifications_enabled",
        "emailNotificationsEnabled": "email_notifications_enabled",
    }


    for source, target in fields.items():

        value = getattr(payload, source)

        if value is not None:
            setattr(current_user, target, value)


    await current_user.save()

    return current_user



@router.get("/{user_id}", response_model=UserOut)
async def get_user(
    user_id: str,
    _: User = Depends(get_current_user)
):

    user = await User.get(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user
