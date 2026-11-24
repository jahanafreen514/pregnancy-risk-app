import logging
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any

from app.services.document_validation_service import validate_document_quality, DocumentQualityResult
from app.services.ocr_service import perform_deep_ocr, OCRResult
from app.services.information_extraction_service import extract_doctor_information, ExtractedDoctorDetails
from app.services.fraud_detection_service import run_fraud_and_verification_checks, FraudDetectionResult

logger = logging.getLogger(__name__)


@dataclass
class CompleteVerificationResult:
    verification_status: str  # "pending", "ai_reviewed", "manual_verification_required", "approved", "rejected"
    is_verified: bool
    composite_confidence_score: float  # 0.0 to 100.0
    quality_score: float
    ocr_confidence: float
    name_match_score: float
    tamper_risk_score: float
    extracted_doctor_name: Optional[str]
    extracted_license_number: Optional[str]
    extracted_issuing_authority: Optional[str]
    extracted_qualifications: List[str]
    extracted_registration_date: Optional[str]
    certificate_type: Optional[str]
    ocr_extracted_text: str
    certificate_file_hash: str
    verification_reasons: List[str] = field(default_factory=list)
    verification_warnings: List[str] = field(default_factory=list)
    admin_review_notes: Optional[str] = None


async def verify_doctor_certificate(
    image_path: str,
    registered_doctor_name: str,
    registered_license_number: Optional[str] = None,
    existing_hashes: Optional[set] = None
) -> CompleteVerificationResult:
    """
    Stage 1 to 5 Combined Intelligent Verification Pipeline.
    """
    reasons: List[str] = []
    warnings: List[str] = []

    # -------------------------------------------------------------
    # STAGE 1: Document Quality & Validity Detection
    # -------------------------------------------------------------
    quality_res: DocumentQualityResult = validate_document_quality(image_path)

    if not quality_res.is_valid:
        # Severe document failure (blank, corrupt, tiny)
        warnings.extend(quality_res.issues)
        return CompleteVerificationResult(
            verification_status="rejected",
            is_verified=False,
            composite_confidence_score=0.0,
            quality_score=quality_res.quality_score,
            ocr_confidence=0.0,
            name_match_score=0.0,
            tamper_risk_score=0.0,
            extracted_doctor_name=None,
            extracted_license_number=None,
            extracted_issuing_authority=None,
            extracted_qualifications=[],
            extracted_registration_date=None,
            certificate_type="Invalid Document",
            ocr_extracted_text="",
            certificate_file_hash="",
            verification_reasons=[],
            verification_warnings=warnings,
            admin_review_notes="Auto-rejected: Uploaded file is unreadable, blank, or corrupted."
        )

    if quality_res.is_blurry:
        warnings.append("Document image is blurry or out of focus, which may reduce OCR reading accuracy.")
    else:
        reasons.append("Document image resolution and edge sharpness are verified.")

    # -------------------------------------------------------------
    # STAGE 2: Deep Learning OCR Engine
    # -------------------------------------------------------------
    ocr_res: OCRResult = perform_deep_ocr(image_path)
    ocr_conf = ocr_res.confidence

    if ocr_conf >= 60.0:
        reasons.append(f"OCR successfully extracted text with {ocr_conf:.1f}% reading confidence.")
    elif ocr_conf > 0:
        warnings.append(f"Low OCR confidence ({ocr_conf:.1f}%). Certificate may have faded print or glare.")

    # -------------------------------------------------------------
    # STAGE 3: AI Information Extraction (NLP + Regex)
    # -------------------------------------------------------------
    ext_details: ExtractedDoctorDetails = extract_doctor_information(ocr_res.text)

    if ext_details.doctor_name:
        reasons.append(f"Detected Doctor Name: '{ext_details.doctor_name}'.")
    if ext_details.license_number:
        reasons.append(f"Extracted Registration Number: '{ext_details.license_number}'.")
    if ext_details.issuing_authority:
        reasons.append(f"Identified Medical Authority: '{ext_details.issuing_authority}'.")
    if ext_details.qualifications:
        reasons.append(f"Recognized Medical Qualifications: {', '.join(ext_details.qualifications)}.")

    # -------------------------------------------------------------
    # STAGE 4: ML-Based Verification and Fraud Detection
    # -------------------------------------------------------------
    fraud_res: FraudDetectionResult = run_fraud_and_verification_checks(
        registered_name=registered_doctor_name,
        registered_license=registered_license_number,
        extracted_name=ext_details.doctor_name,
        extracted_license=ext_details.license_number,
        extracted_authority=ext_details.issuing_authority,
        extracted_qualifications=ext_details.qualifications,
        image_path=image_path,
        known_existing_hashes=existing_hashes
    )

    warnings.extend(fraud_res.warnings)

    if fraud_res.name_matched:
        reasons.append(f"Name match verified ({fraud_res.name_match_score:.1f}% similarity with registered profile).")

    if fraud_res.license_format_valid:
        reasons.append("Registration number syntax conforms to State Medical Council standards.")

    # -------------------------------------------------------------
    # STAGE 5: Explainable Composite Scoring & Status Assignment
    # -------------------------------------------------------------
    # Weights:
    # - Quality: 15%
    # - OCR Readability: 15%
    # - Name Match: 35%
    # - License Extraction & Format: 25%
    # - Qualifications/Council: 10%
    score = (
        (quality_res.quality_score * 0.15) +
        (ocr_conf * 0.15) +
        (fraud_res.name_match_score * 0.35) +
        ((85.0 if fraud_res.license_format_valid else 20.0) * 0.25) +
        ((90.0 if fraud_res.qualifications_valid and fraud_res.authority_valid else 40.0) * 0.10)
    )

    # Penalties
    if fraud_res.is_duplicate:
        score -= 50.0
    if fraud_res.tamper_risk_score > 60.0:
        score -= 25.0

    composite_score = max(0.0, min(100.0, round(score, 2)))

    # Determine Status
    if fraud_res.is_duplicate or composite_score < 40.0:
        status = "rejected"
        is_verified = False
        notes = "Certificate verification failed. Please upload a clear, authentic medical registration certificate."
    elif composite_score >= 88.0 and fraud_res.name_matched and fraud_res.license_format_valid:
        # High confidence AI review
        status = "ai_reviewed"
        is_verified = False  # Keep false until Admin approves, preserving medical compliance
        notes = "AI Review passed with high confidence. Awaiting final administrative approval."
    else:
        status = "manual_verification_required"
        is_verified = False
        notes = "Certificate requires manual admin review due to name variation or document quality."

    return CompleteVerificationResult(
        verification_status=status,
        is_verified=is_verified,
        composite_confidence_score=composite_score,
        quality_score=quality_res.quality_score,
        ocr_confidence=round(ocr_conf, 2),
        name_match_score=fraud_res.name_match_score,
        tamper_risk_score=fraud_res.tamper_risk_score,
        extracted_doctor_name=ext_details.doctor_name,
        extracted_license_number=ext_details.license_number,
        extracted_issuing_authority=ext_details.issuing_authority,
        extracted_qualifications=ext_details.qualifications,
        extracted_registration_date=ext_details.registration_date,
        certificate_type=ext_details.certificate_type,
        ocr_extracted_text=ocr_res.text,
        certificate_file_hash=fraud_res.file_hash,
        verification_reasons=reasons,
        verification_warnings=warnings,
        admin_review_notes=notes
    )
