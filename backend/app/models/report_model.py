from datetime import datetime
from beanie import Document
from typing import Any, Optional
from pydantic import Field


class Report(Document):

    patient_id: str
    patient_name: str = ""
    patient_email: str = ""

    doctor_id: Optional[str] = None

    title: str

    summary: str

    # Immutable assessment snapshot used by both patient and doctor screens.
    risk_level: str = "Low"
    risk_score: int = 0
    confidence: float = 0
    recommendation: str = ""
    symptoms: list[str] = Field(default_factory=list)
    risk_factors: list[str] = Field(default_factory=list)
    vitals: dict[str, Any] = Field(default_factory=dict)
    doctor_notes: str = ""
    status: str = "New"

    created_at: datetime = datetime.utcnow()


    class Settings:
        name = "reports"
