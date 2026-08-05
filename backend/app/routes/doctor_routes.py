from fastapi import APIRouter, Depends,UploadFile, File

from app.services.ocr_service import extract_text_from_image
from app.middleware.auth_middleware import require_roles
from app.models.doctor_model import DoctorProfile
from app.models.pregnancy_model import Appointment
from app.models.user_model import User

from app.schemas.doctor_schema import DoctorProfileUpdate
from app.schemas.user_schema import UserOut
import os
import shutil


router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)



@router.get("", response_model=list[UserOut])
async def list_doctors():

    doctors = await User.find(
        User.role == "doctor",
        User.is_active == True
    ).to_list()

    return doctors



@router.put("/me/profile")
async def update_profile(
    payload: DoctorProfileUpdate,
    user: User = Depends(require_roles("doctor"))
):

    profile = await DoctorProfile.find_one(
        DoctorProfile.user_id == str(user.id)
    )


    if not profile:
        profile = DoctorProfile(
            user_id=str(user.id)
        )


    for name, value in payload.model_dump(exclude_none=True).items():
        setattr(profile, name, value)


    await profile.save()

    return profile



@router.get("/me/dashboard")
async def dashboard(
    user: User = Depends(require_roles("doctor"))
):

    total = await Appointment.find(
        Appointment.doctor_id == str(user.id)
    ).count()


    pending = await Appointment.find(
        Appointment.doctor_id == str(user.id),
        Appointment.status == "pending"
    ).count()


    return {
        "appointments": total,
        "pendingAppointments": pending
    }
@router.post("/me/verification")
async def upload_documents(
    license_image: UploadFile = File(...),
    hospital_id_image: UploadFile = File(...),
    user: User = Depends(require_roles("doctor"))
):

    upload_path = "uploads/doctors"

    os.makedirs(
        f"{upload_path}/licenses",
        exist_ok=True
    )

    os.makedirs(
        f"{upload_path}/hospital_ids",
        exist_ok=True
    )


    license_file = (
        f"{upload_path}/licenses/{license_image.filename}"
    )

    hospital_file = (
        f"{upload_path}/hospital_ids/{hospital_id_image.filename}"
    )


    with open(license_file, "wb") as buffer:
        shutil.copyfileobj(
            license_image.file,
            buffer
        )


    with open(hospital_file, "wb") as buffer:
        shutil.copyfileobj(
            hospital_id_image.file,
            buffer
        )


    # OCR
    license_text = extract_text_from_image(
        license_file
    )

    hospital_text = extract_text_from_image(
        hospital_file
    )


    profile = await DoctorProfile.find_one(
        DoctorProfile.user_id == str(user.id)
    )


    if not profile:
        profile = DoctorProfile(
            user_id=str(user.id)
        )


    profile.license_image = license_file
    profile.hospital_id_image = hospital_file

    profile.extracted_license_number = license_text
    profile.extracted_hospital_name = hospital_text

    profile.verification_status = "pending"
    profile.is_verified = False


    await profile.save()


    return {
        "message": "Documents uploaded. Waiting for admin approval.",
        "license_text": license_text,
        "hospital_text": hospital_text
    }
@router.get("/verified")
async def get_verified_doctors():

    profiles = await DoctorProfile.find(
        DoctorProfile.is_verified == True
    ).to_list()

    doctors = []

    for profile in profiles:

        user = await User.get(
            profile.user_id
        )

        if user:
            doctors.append(
                {
                    "id": str(profile.id),
                    "user_id": str(user.id),
                    "name": user.name,
                    "email": user.email,
                    "specialization": profile.specialization,
                    "hospital": profile.hospital,
                    "license_number": profile.license_number
                }
            )

    return doctors