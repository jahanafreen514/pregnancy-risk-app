import json
from pathlib import Path

from fastapi import APIRouter, status

from app.models.contact_message_model import ContactMessage
from app.schemas.contact_schema import ContactMessageCreate, ContactMessageOut


router = APIRouter(prefix="/contact", tags=["Contact"])


@router.get("/about")
async def public_about():
    """Public, non-sensitive application/model information for the About page."""
    metadata_path = Path(__file__).resolve().parents[1] / "ml" / "model_metadata.json"
    metadata = json.loads(metadata_path.read_text(encoding="utf-8")) if metadata_path.is_file() else {}
    return {
        "application": "GlowCare",
        "model_algorithm": metadata.get("algorithm", "XGBoostClassifier"),
        "risk_classes": metadata.get("classes", ["Low", "Medium", "High"]),
        "feature_count": metadata.get("feature_count", len(metadata.get("feature_order", []))),
        "disclaimer": "Demonstration split metric only; not clinical validation.",
    }


@router.post("", response_model=ContactMessageOut, status_code=status.HTTP_201_CREATED)
async def create_contact_message(payload: ContactMessageCreate):
    """Store a public website contact request; no account is required."""
    message = ContactMessage(**payload.model_dump())
    await message.insert()
    return {**message.model_dump(), "id": str(message.id)}
