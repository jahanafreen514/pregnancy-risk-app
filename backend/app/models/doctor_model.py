from beanie import Document
from typing import Optional, List
from datetime import datetime


class DoctorProfile(Document):
    # Existing fields (preserve completely)
    user_id: str
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    hospital: Optional[str] = None

    # Address entered by the doctor
    address: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    # Uploaded documents paths
    license_image: Optional[str] = None
    hospital_id_image: Optional[str] = None

    # OCR extracted information (preserved)
    extracted_license_number: Optional[str] = None
    extracted_hospital_name: Optional[str] = None

    # Intelligent AI + ML + OCR Verification Fields
    extracted_doctor_name: Optional[str] = None
    extracted_issuing_authority: Optional[str] = None
    extracted_qualifications: List[str] = []
    extracted_registration_date: Optional[str] = None
    certificate_type: Optional[str] = None
    ocr_extracted_text: Optional[str] = None
    certificate_file_hash: Optional[str] = None

    # Confidence and Quality Scores (0.0 to 100.0)
    ocr_confidence: float = 0.0
    name_match_score: float = 0.0
    document_quality_score: float = 0.0
    tamper_risk_score: float = 0.0
    verification_confidence_score: float = 0.0

    # Decision Engine Explainability
    verification_reasons: List[str] = []
    verification_warnings: List[str] = []
    admin_review_notes: Optional[str] = None
    verified_at: Optional[datetime] = None

    # Verification control
    # Values: "pending", "ai_reviewed", "manual_verification_required", "approved", "rejected"
    verification_status: str = "pending"
    is_verified: bool = False

    # Timestamps
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Settings:
        name = "doctor_profiles"
