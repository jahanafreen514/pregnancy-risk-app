from pathlib import Path
from uuid import uuid4
import os
import shutil

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from app.services.ocr_service import extract_text_from_image
from app.services.doctor_verification_service import verify_doctor_certificate
from app.middleware.auth_middleware import require_roles
from app.models.doctor_model import DoctorProfile
from app.models.pregnancy_model import Appointment
from app.models.user_model import User

from app.schemas.doctor_schema import DoctorProfileUpdate
from app.schemas.user_schema import UserOut


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
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "specialization": profile.specialization if profile else None,
        "hospital": profile.hospital if profile else None,
        "address": profile.address if profile else None,
        "area": profile.area if profile else None,
        "city": profile.city if profile else None,
        "state": profile.state if profile else None,
        "pincode": profile.pincode if profile else None,
        "country": profile.country if profile else None,
        "license_number": profile.license_number if profile else None,
        "verification_status": profile.verification_status if profile else "not_uploaded",
        "is_verified": profile.is_verified if profile else False,
        # AI + ML + OCR verification fields
        "extracted_doctor_name": profile.extracted_doctor_name if profile else None,
        "extracted_license_number": profile.extracted_license_number if profile else None,
        "extracted_issuing_authority": profile.extracted_issuing_authority if profile else None,
        "extracted_qualifications": profile.extracted_qualifications if profile else [],
        "extracted_hospital_name": profile.extracted_hospital_name if profile else None,
        "ocr_confidence": getattr(profile, "ocr_confidence", 0.0) if profile else 0.0,
        "name_match_score": getattr(profile, "name_match_score", 0.0) if profile else 0.0,
        "document_quality_score": getattr(profile, "document_quality_score", 0.0) if profile else 0.0,
        "verification_confidence_score": getattr(profile, "verification_confidence_score", 0.0) if profile else 0.0,
        "verification_reasons": getattr(profile, "verification_reasons", []) if profile else [],
        "verification_warnings": getattr(profile, "verification_warnings", []) if profile else [],
        "admin_review_notes": getattr(profile, "admin_review_notes", None) if profile else None,
        "license_image": profile.license_image if profile else None,
        "hospital_id_image": profile.hospital_id_image if profile else None,
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
    profile = await DoctorProfile.find_one(DoctorProfile.user_id == str(user.id))
    if not profile:
        profile = DoctorProfile(user_id=str(user.id))

    changes = payload.model_dump(exclude_none=True)
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
@router.post("/me/verification/reupload")
async def upload_documents(
    license_image: UploadFile = File(...),
    hospital_id_image: UploadFile = File(...),
    user: User = Depends(require_roles("doctor"))
):
    """
    Intelligent AI + ML + OCR Doctor Certificate Verification endpoint.
    Processes uploaded license and hospital ID through all 5 verification stages.
    """
    allowed_content_types = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
    for document in (license_image, hospital_id_image):
        if document.content_type not in allowed_content_types:
            raise HTTPException(status_code=415, detail="Upload a JPG, PNG, WEBP, or PDF document.")

    upload_path = Path("uploads/doctors")
    os.makedirs(upload_path / "licenses", exist_ok=True)
    os.makedirs(upload_path / "hospital_ids", exist_ok=True)

    license_file = upload_path / "licenses" / f"{uuid4().hex}{Path(license_image.filename or '').suffix.lower() or '.bin'}"
    hospital_file = upload_path / "hospital_ids" / f"{uuid4().hex}{Path(hospital_id_image.filename or '').suffix.lower() or '.bin'}"

    with open(license_file, "wb") as buffer:
        shutil.copyfileobj(license_image.file, buffer)

    with open(hospital_file, "wb") as buffer:
        shutil.copyfileobj(hospital_id_image.file, buffer)

    # 1. OCR text from hospital ID (supplemental)
    try:
        hospital_text = extract_text_from_image(str(hospital_file))
    except Exception:
        hospital_text = ""

    # 2. Collect existing certificate hashes from other doctors to catch duplicate uploads
    other_profiles = await DoctorProfile.find(DoctorProfile.user_id != str(user.id)).to_list()
    existing_hashes = {getattr(p, "certificate_file_hash", "") for p in other_profiles if getattr(p, "certificate_file_hash", None)}

    profile = await DoctorProfile.find_one(DoctorProfile.user_id == str(user.id))
    if not profile:
        profile = DoctorProfile(user_id=str(user.id))

    # 3. Execute Complete 5-Stage Verification Pipeline
    ai_result = await verify_doctor_certificate(
        image_path=str(license_file),
        registered_doctor_name=user.name,
        registered_license_number=profile.license_number,
        existing_hashes=existing_hashes
    )

    # Update profile fields
    profile.license_image = f"/uploads/doctors/licenses/{license_file.name}"
    profile.hospital_id_image = f"/uploads/doctors/hospital_ids/{hospital_file.name}"

    # Extracted data
    profile.extracted_license_number = ai_result.extracted_license_number or profile.license_number
    profile.extracted_hospital_name = hospital_text or profile.hospital
    profile.extracted_doctor_name = ai_result.extracted_doctor_name
    profile.extracted_issuing_authority = ai_result.extracted_issuing_authority
    profile.extracted_qualifications = ai_result.extracted_qualifications
    profile.extracted_registration_date = ai_result.extracted_registration_date
    profile.certificate_type = ai_result.certificate_type
    profile.ocr_extracted_text = ai_result.ocr_extracted_text
    profile.certificate_file_hash = ai_result.certificate_file_hash

    # Scores
    profile.ocr_confidence = ai_result.ocr_confidence
    profile.name_match_score = ai_result.name_match_score
    profile.document_quality_score = ai_result.quality_score
    profile.tamper_risk_score = ai_result.tamper_risk_score
    profile.verification_confidence_score = ai_result.composite_confidence_score

    # Audit & Status
    profile.verification_reasons = ai_result.verification_reasons
    profile.verification_warnings = ai_result.verification_warnings
    profile.admin_review_notes = ai_result.admin_review_notes
    profile.verification_status = ai_result.verification_status
    profile.is_verified = ai_result.is_verified

    await profile.save()

    return {
        "message": "Documents uploaded and analyzed by AI verification system.",
        "license_image": profile.license_image,
        "hospital_id_image": profile.hospital_id_image,
        "verification_status": profile.verification_status,
        "is_verified": profile.is_verified,
        "verification_confidence_score": profile.verification_confidence_score,
        "extracted_doctor_name": profile.extracted_doctor_name,
        "extracted_license_number": profile.extracted_license_number,
        "extracted_issuing_authority": profile.extracted_issuing_authority,
        "extracted_qualifications": profile.extracted_qualifications,
        "name_match_score": profile.name_match_score,
        "document_quality_score": profile.document_quality_score,
        "verification_reasons": profile.verification_reasons,
        "verification_warnings": profile.verification_warnings,
        "admin_review_notes": profile.admin_review_notes,
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
        profile = await DoctorProfile.get(doctor_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    field_name, directory = DOCUMENT_TYPES[document_type]
    stored_path = getattr(profile, field_name)
    if not stored_path:
        raise HTTPException(status_code=404, detail="Document has not been uploaded")

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
        user = await User.get(profile.user_id)
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
