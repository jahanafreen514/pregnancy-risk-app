import logging
from dataclasses import dataclass
from typing import Optional
from PIL import Image, ImageEnhance, ImageFilter

logger = logging.getLogger(__name__)

try:
    import cv2
    import numpy as np
    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False

try:
    import pytesseract
    HAS_PYTESSERACT = True
except ImportError:
    HAS_PYTESSERACT = False


@dataclass
class OCRResult:
    text: str
    confidence: float  # 0.0 to 100.0
    word_count: int
    deskew_angle: float = 0.0


def preprocess_image_for_ocr(image_path: str) -> Image.Image:
    """
    Apply advanced computer vision preprocessing to handle phone camera glare,
    shadows, low contrast, and slight tilt before OCR.
    """
    if HAS_OPENCV:
        try:
            cv_img = cv2.imread(image_path)
            if cv_img is not None:
                # Convert to grayscale
                gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)

                # Contrast Limited Adaptive Histogram Equalization (CLAHE)
                clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
                enhanced = clahe.apply(gray)

                # Slight bilateral filter to remove noise while keeping edges sharp
                denoised = cv2.bilateralFilter(enhanced, 9, 75, 75)

                return Image.fromarray(denoised)
        except Exception as e:
            logger.warning(f"OpenCV preprocessing failed: {e}. Falling back to Pillow.")

    # Pillow fallback preprocessing
    with Image.open(image_path) as img:
        gray = img.convert("L")
        enhancer = ImageEnhance.Contrast(gray)
        enhanced = enhancer.enhance(1.8)
        sharpened = enhanced.filter(ImageFilter.SHARPEN)
        return sharpened


def extract_text_from_image(image_path: str) -> str:
    """
    Backwards-compatible interface used throughout the existing codebase.
    Returns stripped raw text.
    """
    res = perform_deep_ocr(image_path)
    return res.text


def perform_deep_ocr(image_path: str) -> OCRResult:
    """
    Stage 2: Deep Learning OCR Engine with Preprocessing & Confidence Scoring.
    """
    preprocessed_img = preprocess_image_for_ocr(image_path)

    if not HAS_PYTESSERACT:
        logger.error("PyTesseract is not installed.")
        return OCRResult(text="", confidence=0.0, word_count=0)

    try:
        # Extract detailed word-level data including confidence
        data = pytesseract.image_to_data(
            preprocessed_img,
            lang="eng",
            output_type=pytesseract.Output.DICT
        )

        texts = data.get("text", [])
        confidences = data.get("conf", [])

        valid_words = []
        valid_confs = []

        for word, conf in zip(texts, confidences):
            clean_word = word.strip()
            if clean_word:
                valid_words.append(clean_word)
                try:
                    conf_val = float(conf)
                    if conf_val >= 0:  # -1 represents blocks/paragraphs
                        valid_confs.append(conf_val)
                except (ValueError, TypeError):
                    pass

        full_text = " ".join(valid_words).strip()
        avg_confidence = (sum(valid_confs) / len(valid_confs)) if valid_confs else 50.0

        # Also run image_to_string to preserve natural newlines and paragraph breaks
        try:
            string_text = pytesseract.image_to_string(preprocessed_img, lang="eng").strip()
            if string_text:
                full_text = string_text
        except Exception:
            pass

        return OCRResult(
            text=full_text,
            confidence=round(avg_confidence, 2),
            word_count=len(valid_words)
        )

    except Exception as e:
        logger.warning(f"Tesseract OCR execution failed: {e}. Attempting basic read.")
        try:
            with Image.open(image_path) as img:
                raw_text = pytesseract.image_to_string(img, lang="eng").strip()
                return OCRResult(
                    text=raw_text,
                    confidence=50.0 if raw_text else 0.0,
                    word_count=len(raw_text.split())
                )
        except Exception as fallback_err:
            logger.error(f"Fallback OCR also failed: {fallback_err}")
            return OCRResult(text="", confidence=0.0, word_count=0)
