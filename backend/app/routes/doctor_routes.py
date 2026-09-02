from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

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

DOCUMENT_TYPES = {
    "license": ("license_image", Path("uploads/doctors/licenses")),
    "hospital-id": ("hospital_id_image", Path("uploads/doctors/hospital_ids")),
}


def serialize_my_profile(user: User, profile: DoctorProfile | None) -> dict:
    """Return the single source of truth used by all doctor-facing screens."""
    return {
        "id": str(user.id), "name": user.name, "email": user.email,
        "phone": user.phone, "role": user.role,
        "specialization": profile.specialization if profile else None,
        "hospital": profile.hospital if profile else None,
        "address": profile.address if profile else None,
        "area": profile.area if profile else None, "city": profile.city if profile else None,
        "state": profile.state if profile else None, "pincode": profile.pincode if profile else None,
        "country": profile.country if profile else None,
        "license_number": profile.license_number if profile else None,
        "verification_status": profile.verification_status if profile else "not_uploaded",
        "is_verified": profile.is_verified if profile else False,
    }


@router.get("/me/profile")
async def get_my_profile(user: User = Depends(require_roles("doctor"))):
    profile = await DoctorProfile.find_one(DoctorProfile.user_id == str(user.id))
    return serialize_my_profile(user, profile)



@router.get("", response_model=list[UserOut])
async def list_doctors():
    profiles = await DoctorProfile.find(
        DoctorProfile.is_verified == True,
        DoctorProfile.verification_status == "approved",
    ).to_list()
    doctors = []
    for profile in profiles:
        doctor = await User.get(profile.user_id)
        if doctor and doctor.role == "doctor" and doctor.is_active:
            doctors.append(doctor)
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


    changes = payload.model_dump(exclude_none=True)
    # User account fields live in the User collection; clinical/profile fields
    # live in DoctorProfile. Updating both makes every role see one result.
    for field in ("name", "phone"):
        if field in changes:
            setattr(user, field, changes.pop(field))
    await user.save()

    for name, value in changes.items():
        setattr(profile, name, value)


    await profile.save()

    return serialize_my_profile(user, profile)



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

    allowed_content_types = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
    for document in (license_image, hospital_id_image):
        if document.content_type not in allowed_content_types:
            raise HTTPException(status_code=415, detail="Upload a JPG, PNG, WEBP, or PDF document.")

    upload_path = Path("uploads/doctors")

    os.makedirs(
        upload_path / "licenses",
        exist_ok=True
    )

    os.makedirs(
        upload_path / "hospital_ids",
        exist_ok=True
    )


    license_file = upload_path / "licenses" / f"{uuid4().hex}{Path(license_image.filename or '').suffix.lower() or '.bin'}"
    hospital_file = upload_path / "hospital_ids" / f"{uuid4().hex}{Path(hospital_id_image.filename or '').suffix.lower() or '.bin'}"


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


    # OCR is supplemental evidence only. A PDF or a malformed image must not
    # prevent the doctor from submitting documents for an admin to review.
    try:
        license_text = extract_text_from_image(str(license_file))
    except Exception:
        license_text = ""
    try:
        hospital_text = extract_text_from_image(str(hospital_file))
    except Exception:
        hospital_text = ""


    profile = await DoctorProfile.find_one(
        DoctorProfile.user_id == str(user.id)
    )


    if not profile:
        profile = DoctorProfile(
            user_id=str(user.id)
        )


    profile.license_image = f"/uploads/doctors/licenses/{license_file.name}"
    profile.hospital_id_image = f"/uploads/doctors/hospital_ids/{hospital_file.name}"

    profile.extracted_license_number = license_text
    profile.extracted_hospital_name = hospital_text

    profile.verification_status = "pending"
    profile.is_verified = False


    await profile.save()


    return {
        "message": "Documents uploaded. Waiting for admin approval.",
        "license_text": license_text,
        "hospital_text": hospital_text,
        "license_image": profile.license_image,
        "hospital_id_image": profile.hospital_id_image,
        "verification_status": profile.verification_status,
    }


@router.get("/{doctor_id}/verification-document/{document_type}")
async def get_verification_document(
    doctor_id: str,
    document_type: str,
    _: User = Depends(require_roles("admin")),
):
    """Serve sensitive verification evidence only to an authenticated admin."""
    if document_type not in DOCUMENT_TYPES:
        raise HTTPException(status_code=404, detail="Document type not found")

    profile = await DoctorProfile.find_one(DoctorProfile.user_id == doctor_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    field_name, directory = DOCUMENT_TYPES[document_type]
    stored_path = getattr(profile, field_name)
    if not stored_path:
        raise HTTPException(status_code=404, detail="Document has not been uploaded")

    # Only use the stored filename, so a database value can never traverse out
    # of the intended upload directory.
    document_path = directory / Path(stored_path).name
    if not document_path.is_file():
        raise HTTPException(status_code=404, detail="Document file not found")
    return FileResponse(document_path, filename=document_path.name)
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
