import hashlib
import re
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional, List
from PIL import Image, ImageChops, ImageStat

logger = logging.getLogger(__name__)

try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False
    import difflib


@dataclass
class FraudDetectionResult:
    name_match_score: float  # 0.0 to 100.0
    name_matched: bool
    license_format_valid: bool
    authority_valid: bool
    qualifications_valid: bool
    is_duplicate: bool = False
    tamper_risk_score: float = 0.0  # 0.0 (low risk) to 100.0 (high risk)
    warnings: List[str] = field(default_factory=list)
    file_hash: str = ""


def compute_file_sha256(file_path: str) -> str:
    """Generate SHA-256 checksum for duplicate document detection."""
    sha = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            sha.update(chunk)
    return sha.hexdigest()


def calculate_name_similarity(registered_name: str, extracted_name: Optional[str]) -> float:
    """
    Fuzzy name matching using Levenshtein distance / token set similarity.
    Handles 'Dr.' prefixes, middle names, and minor typos.
    """
    if not registered_name or not extracted_name:
        return 0.0

    # Normalize names
    def clean(n: str) -> str:
        n = re.sub(r"^(?:dr\.?|doctor)\s+", "", n, flags=re.IGNORECASE)
        n = re.sub(r"[^a-zA-Z\s]", "", n).lower()
        return " ".join(n.split())

    reg_clean = clean(registered_name)
    ext_clean = clean(extracted_name)

    if not reg_clean or not ext_clean:
        return 0.0

    # Exact normalized match
    if reg_clean == ext_clean:
        return 100.0

    if HAS_RAPIDFUZZ:
        # Token set ratio handles name permutations like "Afreen Jahan" vs "Jahan Afreen"
        ratio = fuzz.token_set_ratio(reg_clean, ext_clean)
        return round(float(ratio), 2)
    else:
        # difflib fallback
        matcher = difflib.SequenceMatcher(None, reg_clean, ext_clean)
        return round(matcher.ratio() * 100.0, 2)


def validate_license_format(license_number: Optional[str]) -> bool:
    """
    Validate that registration number follows legitimate medical council syntax.
    Example valid formats: APMC/2018/12345, TSMC-8492, MCI-12-3456, 489201.
    """
    if not license_number:
        return False

    clean_no = license_number.strip()
    if len(clean_no) < 4 or len(clean_no) > 25:
        return False

    # Must contain at least some digits
    if not re.search(r"\d", clean_no):
        return False

    # Check for valid characters only
    if not re.match(r"^[A-Za-z0-9\/\-_\.]+$", clean_no):
        return False

    return True


def detect_digital_tampering(image_path: str) -> float:
    """
    Basic digital tampering indicator using Error Level Analysis (ELA).
    Saves a temporary copy at 90% quality and computes pixel difference variance.
    High local difference variance often indicates spliced or digitally pasted text.
    Returns tamper risk score (0.0 to 100.0).
    """
    try:
        tmp_ela = Path(image_path).parent / f"tmp_ela_{Path(image_path).name}.jpg"
        with Image.open(image_path) as original:
            orig_rgb = original.convert("RGB")
            orig_rgb.save(tmp_ela, "JPEG", quality=90)

            with Image.open(tmp_ela) as recompressed:
                diff = ImageChops.difference(orig_rgb, recompressed)
                stat = ImageStat.Stat(diff)
                # Maximum variance across channels
                max_var = max(stat.var)
                # Normal variance is typically between 5 and 35. High variance > 80 indicates potential tampering
                risk = min(100.0, max(0.0, (max_var - 40.0) * 1.5))

            if tmp_ela.exists():
                tmp_ela.unlink()

            return round(risk, 2)
    except Exception as e:
        logger.warning(f"Error Level Analysis check failed: {e}")
        return 10.0


def run_fraud_and_verification_checks(
    registered_name: str,
    registered_license: Optional[str],
    extracted_name: Optional[str],
    extracted_license: Optional[str],
    extracted_authority: Optional[str],
    extracted_qualifications: List[str],
    image_path: str,
    known_existing_hashes: Optional[set] = None
) -> FraudDetectionResult:
    """
    Stage 4: ML-Based Verification and Fraud Detection.
    """
    warnings: List[str] = []

    # 1. Name Match Score
    name_score = calculate_name_similarity(registered_name, extracted_name)
    name_matched = name_score >= 70.0
    if not name_matched:
        warnings.append(f"Doctor name mismatch: Registered as '{registered_name}', but certificate reads '{extracted_name or 'Unrecognized'}'.")

    # 2. License Format & Match Check
    license_format_valid = validate_license_format(extracted_license)
    if not license_format_valid:
        warnings.append("Registration number could not be validated against official state medical council patterns.")
    elif registered_license and extracted_license:
        # Cross check registered vs extracted license
        reg_lic_clean = re.sub(r"[^A-Za-z0-9]", "", registered_license.upper())
        ext_lic_clean = re.sub(r"[^A-Za-z0-9]", "", extracted_license.upper())
        if reg_lic_clean != ext_lic_clean and ext_lic_clean not in reg_lic_clean and reg_lic_clean not in ext_lic_clean:
            warnings.append(f"Registration number discrepancy: Registered '{registered_license}' vs Extracted '{extracted_license}'.")

    # 3. Authority Validation
    authority_valid = bool(extracted_authority)
    if not authority_valid:
        warnings.append("Issuing Medical Council or Commission seal was not clearly identified.")

    # 4. Qualifications Check
    qualifications_valid = len(extracted_qualifications) > 0
    if not qualifications_valid:
        warnings.append("No standard clinical qualifications (e.g. MBBS, MD, MS, DGO) detected on certificate.")

    # 5. File Hash & Duplicate Detection
    file_hash = compute_file_sha256(image_path)
    is_duplicate = False
    if known_existing_hashes and file_hash in known_existing_hashes:
        is_duplicate = True
        warnings.append("Duplicate certificate warning: This exact certificate file is already registered under another account.")

    # 6. Tampering & Forgery Indicator
    tamper_risk = detect_digital_tampering(image_path)
    if tamper_risk > 65.0:
        warnings.append("Potential digital editing or compression artifact inconsistency detected in certificate image.")

    return FraudDetectionResult(
        name_match_score=name_score,
        name_matched=name_matched,
        license_format_valid=license_format_valid,
        authority_valid=authority_valid,
        qualifications_valid=qualifications_valid,
        is_duplicate=is_duplicate,
        tamper_risk_score=tamper_risk,
        warnings=warnings,
        file_hash=file_hash
    )
