from pydantic import BaseModel
from typing import Optional, List


# Existing profile update schema
class DoctorProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    hospital: Optional[str] = None
    address: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


# Doctor document upload response
class DoctorVerificationResponse(BaseModel):
    message: str
    license_image: Optional[str] = None
    hospital_id_image: Optional[str] = None
    verification_status: str
    is_verified: bool = False
    verification_confidence_score: float = 0.0
    extracted_doctor_name: Optional[str] = None
    extracted_license_number: Optional[str] = None
    extracted_issuing_authority: Optional[str] = None
    extracted_qualifications: List[str] = []
    name_match_score: float = 0.0
    document_quality_score: float = 0.0
    verification_reasons: List[str] = []
    verification_warnings: List[str] = []
    admin_review_notes: Optional[str] = None


# Admin review & action schema
class AdminReviewRequest(BaseModel):
    admin_review_notes: Optional[str] = None
    verification_status: Optional[str] = None


# Admin verification update
class DoctorVerificationUpdate(BaseModel):
    verification_status: str
    # approved / rejected / pending / manual_verification_required / ai_reviewed
    is_verified: bool
    admin_review_notes: Optional[str] = None
