import re
import logging
from dataclasses import dataclass, field
from typing import List, Optional

logger = logging.getLogger(__name__)

# Known Authoritative Medical Councils in India
KNOWN_MEDICAL_COUNCILS = [
    "National Medical Commission",
    "Medical Council of India",
    "Andhra Pradesh Medical Council",
    "Telangana State Medical Council",
    "Maharashtra Medical Council",
    "Karnataka Medical Council",
    "Tamil Nadu Medical Council",
    "Delhi Medical Council",
    "Uttar Pradesh Medical Council",
    "West Bengal Medical Council",
    "Kerala State Medical Council",
    "Gujarat Medical Council",
    "Punjab Medical Council",
    "Rajasthan Medical Council",
    "Madhya Pradesh Medical Council",
    "Bihar Medical Council",
    "Odisha Medical Council",
    "Assam Medical Council",
    "Haryana Medical Council",
]

# Standard Medical Qualifications
KNOWN_QUALIFICATIONS = [
    "MBBS", "M.B.B.S", "MD", "M.D", "MS", "M.S",
    "DGO", "D.G.O", "DNB", "D.N.B", "FRCS", "DM", "D.M",
    "MCH", "M.Ch", "BAMS", "BHMS", "MRCOG", "Diploma in Gynecology",
    "Fellowship", "FCPS"
]


@dataclass
class ExtractedDoctorDetails:
    doctor_name: Optional[str] = None
    license_number: Optional[str] = None
    issuing_authority: Optional[str] = None
    qualifications: List[str] = field(default_factory=list)
    registration_date: Optional[str] = None
    certificate_type: Optional[str] = None
    raw_text: str = ""
    extraction_confidence: float = 0.0


def _extract_doctor_name(text: str) -> Optional[str]:
    """Extract doctor's name using multi-pattern regex and NLP cues."""
    # Pattern 1: Explicit certification lines
    cert_patterns = [
        r"(?:certify that|certified that)\s+(?:Dr\.?|Doctor)\s+([A-Z][a-zA-Z\.\s]{2,40})",
        r"(?:certify that|certified that)\s+([A-Z][a-zA-Z\.\s]{2,40})(?:\s+has|\s+is|\s+holding|\s+passed)",
        r"(?:Name of (?:the )?(?:Medical )?Practitioner|Doctor Name|Name)\s*[:\-]?\s*(?:Dr\.?)?\s*([A-Z][a-zA-Z\.\s]{2,40})",
        r"\b(?:Dr\.?|Doctor)\s+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,3})",
    ]

    for pattern in cert_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            candidate = match.group(1).strip()
            # Clean up unwanted trailing tokens
            candidate = re.sub(r"\b(has|is|holding|passed|registered|son of|daughter of|wife of|mbbs|md|ms)\b.*$", "", candidate, flags=re.IGNORECASE).strip()
            # Must look like a real name (at least 2 letters, no weird symbols)
            if len(candidate) >= 3 and not re.search(r"[\d@#$%^*_=+]", candidate):
                # Clean prefix if captured
                candidate = re.sub(r"^(?:Dr\.?|Doctor)\s+", "", candidate, flags=re.IGNORECASE).strip()
                return candidate

    return None


def _extract_license_number(text: str) -> Optional[str]:
    """Extract Medical Registration / License number."""
    # Pattern 1: Council-specific format (e.g., APMC/2018/12345, TSMC-12345, MCI/15-4567)
    council_specific = re.search(
        r"\b([A-Z]{2,6}[\/\-_](?:\d{4}[\/\-_])?\d{3,8})\b",
        text
    )
    if council_specific:
        return council_specific.group(1).strip()

    # Pattern 2: Explicit "Registration No:" or "License No:" label
    label_patterns = [
        r"(?:Reg(?:istration)?\.?\s*(?:No|Number|Num)?|License\s*(?:No|Number)?|Cert(?:ificate)?\s*No\.?)\s*[:\-#]?\s*([A-Za-z0-9\/\-_]{3,20})",
        r"\b(?:Regn?\.?\s*No\.?)\s*[:\-#]?\s*([0-9]{4,10})",
    ]

    for pattern in label_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            number = match.group(1).strip()
            # Filter out generic words that might be caught
            if len(number) >= 3 and not re.match(r"^(date|name|the|and|for|medical|council)$", number, re.IGNORECASE):
                return number

    return None


def _extract_issuing_authority(text: str) -> Optional[str]:
    """Identify the Medical Council or Commission issuing the certificate."""
    # Check against known official councils first
    text_lower = text.lower()
    for council in KNOWN_MEDICAL_COUNCILS:
        if council.lower() in text_lower:
            return council

    # Regex for any "[State] Medical Council"
    match = re.search(r"([A-Za-z\s]{3,25}Medical\s+Council(?:\s+of\s+[A-Za-z\s]+)?)", text, re.IGNORECASE)
    if match:
        return match.group(1).strip().title()

    if "national medical commission" in text_lower or "nmc" in text_lower:
        return "National Medical Commission"

    if "medical council of india" in text_lower or "mci" in text_lower:
        return "Medical Council of India"

    return None


def _extract_qualifications(text: str) -> List[str]:
    """Identify recognized clinical qualifications (MBBS, MD, MS, DGO, etc.)."""
    found_qualifications = []
    for qual in KNOWN_QUALIFICATIONS:
        pattern = r"\b" + re.escape(qual) + r"\b"
        if re.search(pattern, text, re.IGNORECASE):
            clean_qual = qual.replace(".", "").upper()
            if clean_qual not in found_qualifications:
                found_qualifications.append(clean_qual)
    return found_qualifications


def _extract_registration_date(text: str) -> Optional[str]:
    """Extract the certificate issuance or registration date."""
    patterns = [
        r"(?:Dated?|Date of Registration|Registration Date|Date of Issue)\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})",
        r"(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})",
        r"\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.](?:19|20)\d{2})\b"
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None


def _determine_certificate_type(text: str) -> str:
    """Classify the certificate type based on terminology."""
    text_lower = text.lower()
    if "provisional" in text_lower:
        return "Provisional Registration Certificate"
    if "hospital" in text_lower and ("identity" in text_lower or "staff" in text_lower or "employee" in text_lower):
        return "Hospital Staff Identification"
    if "permanent" in text_lower or "medical council" in text_lower or "registration certificate" in text_lower:
        return "Permanent Medical Registration Certificate"
    return "Medical Credential Document"


def extract_doctor_information(ocr_text: str) -> ExtractedDoctorDetails:
    """
    Stage 3: AI-based Information Extraction.
    Extracts structured credentials from OCR text.
    """
    if not ocr_text or not ocr_text.strip():
        return ExtractedDoctorDetails(raw_text="")

    name = _extract_doctor_name(ocr_text)
    license_no = _extract_license_number(ocr_text)
    authority = _extract_issuing_authority(ocr_text)
    quals = _extract_qualifications(ocr_text)
    date_str = _extract_registration_date(ocr_text)
    cert_type = _determine_certificate_type(ocr_text)

    # Compute extraction confidence score (how many key fields were found)
    points = 0
    if name:
        points += 35
    if license_no:
        points += 35
    if authority:
        points += 15
    if quals:
        points += 15

    confidence = float(points)

    return ExtractedDoctorDetails(
        doctor_name=name,
        license_number=license_no,
        issuing_authority=authority,
        qualifications=quals,
        registration_date=date_str,
        certificate_type=cert_type,
        raw_text=ocr_text,
        extraction_confidence=confidence
    )
