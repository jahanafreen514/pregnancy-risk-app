from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query

from app.models.doctor_model import DoctorProfile
from app.models.user_model import User
from app.schemas.doctor_schema import AdminReviewRequest
from app.middleware.auth_middleware import require_roles


router = APIRouter(
    prefix="/admin/doctors",
    tags=["Admin Doctor Verification"]
)


@router.get("/pending")
async def pending_doctors(
    status: Optional[str] = Query(None, description="Optional status filter"),
    admin: User = Depends(require_roles("admin"))
):
    """
    View doctors for verification.
    If status is specified (e.g. 'ai_reviewed', 'manual_verification_required', 'rejected', 'approved'), filters by it.
    If no status or 'all' is passed, returns all doctors with uploaded documents so admin has full visibility.
    """
    if status and status != "all":
        query = {"verification_status": status}
    else:
        # Return all doctors with uploaded documents or awaiting verification
        query = {
            "$or": [
                {"license_image": {"$ne": None}},
                {"verification_status": {"$in": ["pending", "ai_reviewed", "manual_verification_required", "rejected", "approved"]}}
            ]
        }

    profiles = await DoctorProfile.find(query).to_list()

    enriched_doctors = []
    for profile in profiles:
        user = await User.get(profile.user_id)
        doctor_dict = profile.model_dump()
        doctor_dict["id"] = str(profile.id)
        doctor_dict["_id"] = str(profile.id)
        if user:
            doctor_dict["registered_name"] = user.name
            doctor_dict["email"] = user.email
            doctor_dict["phone"] = user.phone
        else:
            doctor_dict["registered_name"] = "Unknown Doctor"
            doctor_dict["email"] = ""
            doctor_dict["phone"] = ""
        enriched_doctors.append(doctor_dict)

    return enriched_doctors


@router.get("/{doctor_id}")
async def get_doctor_verification_detail(
    doctor_id: str,
    admin: User = Depends(require_roles("admin"))
):
    """Fetch complete AI + ML verification details for a single doctor."""
    doctor = await DoctorProfile.get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    user = await User.get(doctor.user_id)
    doc_dict = doctor.model_dump()
    doc_dict["id"] = str(doctor.id)
    doc_dict["_id"] = str(doctor.id)
    if user:
        doc_dict["registered_name"] = user.name
        doc_dict["email"] = user.email
        doc_dict["phone"] = user.phone

    return doc_dict


@router.put("/{doctor_id}/approve")
async def approve_doctor(
    doctor_id: str,
    payload: Optional[AdminReviewRequest] = None,
    admin: User = Depends(require_roles("admin"))
):
    """Approve a doctor's credentials and mark verified."""
    doctor = await DoctorProfile.get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor.is_verified = True
    doctor.verification_status = "approved"
    doctor.verified_at = datetime.utcnow()
    if payload and payload.admin_review_notes:
        doctor.admin_review_notes = payload.admin_review_notes
    else:
        doctor.admin_review_notes = f"Approved and verified by administrator ({admin.name})."

    doctor.updated_at = datetime.utcnow()
    await doctor.save()

    return {
        "message": "Doctor approved successfully",
        "doctor_id": str(doctor.id),
        "verification_status": doctor.verification_status,
        "is_verified": doctor.is_verified,
        "admin_review_notes": doctor.admin_review_notes
    }


@router.put("/{doctor_id}/reject")
async def reject_doctor(
    doctor_id: str,
    payload: Optional[AdminReviewRequest] = None,
    admin: User = Depends(require_roles("admin"))
):
    """Reject a doctor's credentials with explicit explanation notes."""
    doctor = await DoctorProfile.get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor.is_verified = False
    doctor.verification_status = "rejected"
    if payload and payload.admin_review_notes:
        doctor.admin_review_notes = payload.admin_review_notes
    else:
        doctor.admin_review_notes = f"Rejected by administrator ({admin.name}). Please re-upload authentic credentials."

    doctor.updated_at = datetime.utcnow()
    await doctor.save()

    return {
        "message": "Doctor verification rejected",
        "doctor_id": str(doctor.id),
        "verification_status": doctor.verification_status,
        "admin_review_notes": doctor.admin_review_notes
    }


@router.put("/{doctor_id}/request-reupload")
async def request_reupload(
    doctor_id: str,
    payload: Optional[AdminReviewRequest] = None,
    admin: User = Depends(require_roles("admin"))
):
    """Ask doctor to re-upload their credentials (e.g. blurry image or wrong document)."""
    doctor = await DoctorProfile.get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor.is_verified = False
    doctor.verification_status = "manual_verification_required"
    reason = payload.admin_review_notes if (payload and payload.admin_review_notes) else "Please re-upload a clear, sharp, uncropped photo of your state medical council certificate."
    doctor.admin_review_notes = f"Admin request: {reason}"

    doctor.updated_at = datetime.utcnow()
    await doctor.save()

    return {
        "message": "Re-upload requested from doctor",
        "doctor_id": str(doctor.id),
        "verification_status": doctor.verification_status,
        "admin_review_notes": doctor.admin_review_notes
    }
