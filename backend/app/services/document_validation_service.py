import os
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Dict, Any
from PIL import Image, ImageStat

logger = logging.getLogger(__name__)

# Try importing cv2, provide pure Pillow fallback if needed
try:
    import cv2
    import numpy as np
    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False
    logger.warning("OpenCV not found. Using Pillow fallback for document quality checks.")


@dataclass
class DocumentQualityResult:
    is_valid: bool
    quality_score: float  # 0.0 to 100.0
    is_blurry: bool = False
    is_blank: bool = False
    is_document_like: bool = True
    blur_score: float = 0.0  # Higher = sharper
    width: int = 0
    height: int = 0
    issues: List[str] = field(default_factory=list)
    details: Dict[str, Any] = field(default_factory=dict)


def _compute_laplacian_variance(image_path: str) -> float:
    """Compute the Laplacian variance to measure edge sharpness/blur."""
    if HAS_OPENCV:
        try:
            image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if image is None:
                return 0.0
            variance = cv2.Laplacian(image, cv2.CV_64F).var()
            return float(variance)
        except Exception as e:
            logger.warning(f"OpenCV Laplacian variance failed: {e}")

    # Fallback using Pillow: edge difference
    try:
        with Image.open(image_path) as img:
            gray = img.convert("L")
            # Downsample for quick edge variance
            gray.thumbnail((800, 800))
            stat = ImageStat.Stat(gray)
            # High variance in pixel intensity indicates sharper transitions
            return float(stat.var[0])
    except Exception as e:
        logger.warning(f"Pillow blur fallback failed: {e}")
        return 0.0


def _check_blank_or_solid(image_path: str) -> tuple[bool, float]:
    """Detect if an image is completely white, dark, or a single solid color."""
    try:
        with Image.open(image_path) as img:
            gray = img.convert("L")
            stat = ImageStat.Stat(gray)
            std_dev = stat.stddev[0]
            # If standard deviation is extremely low (< 10), image is flat/solid
            is_blank = std_dev < 12.0
            return is_blank, float(std_dev)
    except Exception as e:
        logger.warning(f"Blank image check failed: {e}")
        return False, 50.0


def _check_document_structure(image_path: str) -> tuple[bool, float]:
    """
    Check if the image visually resembles a document/certificate
    rather than a random selfie, landscape photo, or dark background.
    Documents typically have bright/white background with structured dark text.
    """
    try:
        with Image.open(image_path) as img:
            gray = img.convert("L")
            gray.thumbnail((600, 600))
            stat = ImageStat.Stat(gray)
            mean_brightness = stat.mean[0]

            # Documents/certificates almost always have bright backgrounds (mean > 110)
            if mean_brightness < 40:
                return False, 20.0  # Extremely dark image

            if HAS_OPENCV:
                # Count horizontal and vertical edge density (text layout)
                cv_img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
                if cv_img is not None:
                    edges = cv2.Canny(cv_img, 50, 150)
                    edge_density = float(np.sum(edges > 0) / edges.size)
                    # Natural text documents typically have edge density between 1% and 18%
                    is_doc = 0.005 <= edge_density <= 0.25
                    score = min(100.0, max(10.0, edge_density * 500))
                    return is_doc, score

            return True, 80.0
    except Exception as e:
        logger.warning(f"Document structure check error: {e}")
        return True, 75.0


def validate_document_quality(image_path: str, min_width: int = 300, min_height: int = 300) -> DocumentQualityResult:
    """
    Stage 1: Complete Document Quality and Validity Detection.
    Evaluates blur, blankness, dimensions, file integrity, and certificate layout.
    """
    path_obj = Path(image_path)
    if not path_obj.exists():
        return DocumentQualityResult(
            is_valid=False,
            quality_score=0.0,
            issues=["File does not exist."]
        )

    file_size_bytes = os.path.getsize(image_path)
    if file_size_bytes == 0:
        return DocumentQualityResult(
            is_valid=False,
            quality_score=0.0,
            is_blank=True,
            issues=["Uploaded file is empty (0 bytes)."]
        )

    # Validate image dimensions and format
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            img_format = (img.format or "").upper()
    except Exception as e:
        return DocumentQualityResult(
            is_valid=False,
            quality_score=0.0,
            issues=[f"Corrupted or unsupported image file format: {e}"]
        )

    issues: List[str] = []
    quality_score = 100.0

    # 1. Dimension Check
    if width < min_width or height < min_height:
        quality_score -= 30.0
        issues.append(f"Image resolution is too low ({width}x{height}px). Minimum is {min_width}x{min_height}px.")

    # 2. Blank / Solid Color Check
    is_blank, std_dev = _check_blank_or_solid(image_path)
    if is_blank:
        quality_score = 10.0
        issues.append("The image appears to be completely blank or unreadable.")

    # 3. Blur Detection (Laplacian Variance)
    blur_score = _compute_laplacian_variance(image_path)
    # Threshold: < 50 indicates noticeable blur; < 20 indicates severe blur
    is_blurry = blur_score < 45.0
    if is_blurry:
        penalty = max(20.0, 50.0 - blur_score)
        quality_score -= penalty
        issues.append("Document image is blurry or out of focus. Please ensure text is sharp and legible.")

    # 4. Document vs Non-Document Structure Check
    is_doc_like, doc_struct_score = _check_document_structure(image_path)
    if not is_doc_like:
        quality_score -= 25.0
        issues.append("Image does not resemble a valid medical certificate or official document.")

    final_score = max(0.0, min(100.0, round(quality_score, 2)))
    # A document is considered valid for further processing if it's not completely blank or severely broken
    is_valid = not is_blank and final_score >= 40.0

    return DocumentQualityResult(
        is_valid=is_valid,
        quality_score=final_score,
        is_blurry=is_blurry,
        is_blank=is_blank,
        is_document_like=is_doc_like,
        blur_score=round(blur_score, 2),
        width=width,
        height=height,
        issues=issues,
        details={
            "format": img_format,
            "file_size_kb": round(file_size_bytes / 1024, 2),
            "std_dev": round(std_dev, 2),
            "doc_structure_score": round(doc_struct_score, 2),
        }
    )
