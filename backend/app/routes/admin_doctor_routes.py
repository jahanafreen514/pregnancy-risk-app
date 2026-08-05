from fastapi import APIRouter, Depends, HTTPException

from app.models.doctor_model import DoctorProfile
from app.models.user_model import User
from app.middleware.auth_middleware import require_roles


router = APIRouter(
    prefix="/admin/doctors",
    tags=["Admin Doctor Verification"]
)



# View all pending doctors

@router.get("/pending")
async def pending_doctors(
    admin: User = Depends(require_roles("admin"))
):

    doctors = await DoctorProfile.find(
        DoctorProfile.verification_status == "pending"
    ).to_list()


    return doctors



# Approve doctor

@router.put("/{doctor_id}/approve")
async def approve_doctor(
    doctor_id: str,
    admin: User = Depends(require_roles("admin"))
):

    doctor = await DoctorProfile.get(
        doctor_id
    )


    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )


    doctor.is_verified = True

    doctor.verification_status = "approved"


    await doctor.save()


    return {
        "message": "Doctor approved successfully"
    }



# Reject doctor

@router.put("/{doctor_id}/reject")
async def reject_doctor(
    doctor_id: str,
    admin: User = Depends(require_roles("admin"))
):

    doctor = await DoctorProfile.get(
        doctor_id
    )


    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )


    doctor.is_verified = False

    doctor.verification_status = "rejected"


    await doctor.save()


    return {
        "message": "Doctor rejected"
    }