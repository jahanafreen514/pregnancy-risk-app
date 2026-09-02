from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.middleware.auth_middleware import get_current_user, require_roles
from app.models.prescription_model import Prescription
from app.models.user_model import User
from app.schemas.prescription_schema import (
    PrescriptionCreate,
    PrescriptionReview,
    PrescriptionUpdate,
)
from app.services.notification_service import notify_user

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])
ALLOWED_STATUSES = {"active", "completed", "cancelled"}


def serialize(prescription: Prescription) -> dict:
    return {**prescription.model_dump(), "id": str(prescription.id)}


async def get_owned_prescription(prescription_id: str, user: User) -> Prescription:
    if not ObjectId.is_valid(prescription_id):
        raise HTTPException(status_code=404, detail="Prescription not found")
    prescription = await Prescription.get(prescription_id)
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    if user.role != "admin" and (
        (user.role == "doctor" and prescription.doctor_id != str(user.id))
        # Older prescriptions may have been stored before patient-id mapping
        # was fixed.  The authenticated patient's email is a safe fallback for
        # viewing/reviewing only their own legacy records.
        or (
            user.role in {"user", "patient"}
            and prescription.patient_id != str(user.id)
            and (prescription.patient_email or "").casefold() != user.email.casefold()
        )
        or user.role not in {"admin", "doctor", "user", "patient"}
    ):
        raise HTTPException(status_code=403, detail="Not allowed to access this prescription")
    return prescription


@router.get("")
@router.get("/")
async def get_prescriptions(current_user: User = Depends(get_current_user)):
    if current_user.role == "admin":
        items = await Prescription.find_all().sort(-Prescription.created_at).to_list()
    elif current_user.role == "doctor":
        items = await Prescription.find(Prescription.doctor_id == str(current_user.id)).sort(-Prescription.created_at).to_list()
    else:
        by_id = await Prescription.find(Prescription.patient_id == str(current_user.id)).to_list()
        by_email = await Prescription.find(Prescription.patient_email == current_user.email).to_list()
        items = sorted({str(item.id): item for item in [*by_id, *by_email]}.values(), key=lambda item: item.created_at, reverse=True)
    return {"message": "Prescriptions fetched successfully", "data": [serialize(item) for item in items]}


@router.get("/my-prescriptions")
async def my_prescriptions(current_user: User = Depends(require_roles("user", "patient"))):
    by_id = await Prescription.find(Prescription.patient_id == str(current_user.id)).to_list()
    by_email = await Prescription.find(Prescription.patient_email == current_user.email).to_list()
    items = sorted({str(item.id): item for item in [*by_id, *by_email]}.values(), key=lambda item: item.created_at, reverse=True)
    return [serialize(item) for item in items]


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_prescription(payload: PrescriptionCreate, current_user: User = Depends(require_roles("doctor"))):
    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid prescription status")
    patient = await User.get(payload.patient_id) if payload.patient_id else await User.find_one(User.email == payload.patient_email)
    if not patient or patient.role not in {"user", "patient"}:
        raise HTTPException(status_code=404, detail="Patient not found")
    prescription = Prescription(
        **payload.model_dump(exclude={"doctor_id", "doctor_name", "patient_name", "patient_email"}),
        doctor_id=str(current_user.id), doctor_name=current_user.name,
        patient_name=patient.name, patient_email=patient.email,
    )
    await prescription.insert()
    await notify_user(str(patient.id), "New prescription", f"Dr. {current_user.name} added a prescription for {prescription.medicine}.", "prescription")
    return {"message": "Prescription created successfully", "data": serialize(prescription)}


@router.get("/{prescription_id}")
async def get_single_prescription(prescription_id: str, current_user: User = Depends(get_current_user)):
    return serialize(await get_owned_prescription(prescription_id, current_user))


@router.put("/{prescription_id}")
async def update_prescription(prescription_id: str, payload: PrescriptionUpdate, current_user: User = Depends(require_roles("doctor"))):
    prescription = await get_owned_prescription(prescription_id, current_user)
    changes = payload.model_dump(exclude_unset=True)
    if "status" in changes and changes["status"] not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid prescription status")
    for field, value in changes.items():
        setattr(prescription, field, value)
    prescription.updated_at = datetime.now(timezone.utc)
    await prescription.save()
    await notify_user(prescription.patient_id, "Prescription updated", f"Your prescription for {prescription.medicine} was updated.", "prescription")
    return {"message": "Prescription updated successfully", "data": serialize(prescription)}


@router.patch("/{prescription_id}/reviewed")
async def mark_reviewed(
    prescription_id: str,
    payload: PrescriptionReview,
    current_user: User = Depends(require_roles("user", "patient")),
):
    """Let only the assigned patient acknowledge completion of a prescription."""
    prescription = await get_owned_prescription(prescription_id, current_user)
    if prescription.status == "cancelled":
        raise HTTPException(status_code=400, detail="Cancelled prescriptions cannot be completed")

    prescription.reviewed_by_patient = payload.reviewed
    prescription.reviewed_at = datetime.now(timezone.utc) if payload.reviewed else None
    prescription.status = "completed" if payload.reviewed else "active"
    prescription.updated_at = datetime.now(timezone.utc)
    await prescription.save()

    await notify_user(
        prescription.doctor_id,
        "Prescription completion updated",
        f"{current_user.name} marked {prescription.medicine} as {'completed' if payload.reviewed else 'active'}.",
        "prescription",
    )
    return {"message": "Prescription status updated", "data": serialize(prescription)}


@router.delete("/{prescription_id}")
async def delete_prescription(prescription_id: str, current_user: User = Depends(require_roles("doctor"))):
    prescription = await get_owned_prescription(prescription_id, current_user)
    await prescription.delete()
    await notify_user(prescription.patient_id, "Prescription cancelled", f"Your prescription for {prescription.medicine} was cancelled.", "prescription")
    return {"message": "Prescription deleted successfully"}
