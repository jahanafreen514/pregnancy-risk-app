from beanie import Document
from typing import Optional
from datetime import datetime


class DoctorProfile(Document):

    # Existing field (keep)
    user_id: str

    specialization: Optional[str] = None

    license_number: Optional[str] = None

    hospital: Optional[str] = None


    # New doctor verification fields

    # Uploaded documents paths
    license_image: Optional[str] = None

    hospital_id_image: Optional[str] = None


    # OCR extracted information
    extracted_license_number: Optional[str] = None

    extracted_hospital_name: Optional[str] = None


    # Verification control
    verification_status: str = "pending"
    # pending / approved / rejected

    is_verified: bool = False


    # Timestamps
    created_at: datetime = datetime.utcnow()

    updated_at: datetime = datetime.utcnow()


    class Settings:
        name = "doctor_profiles"