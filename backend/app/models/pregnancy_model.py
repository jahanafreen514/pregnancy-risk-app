from datetime import datetime, timezone
from typing import Optional

from beanie import Document
from pydantic import Field



class PregnancyRecord(Document):

    user_id: str

    pregnancy_week: Optional[int] = None

    bp_systolic: Optional[float] = None
    bp_diastolic: Optional[float] = None

    sugar: Optional[float] = None

    temperature: Optional[float] = None

    heart_rate: Optional[float] = None

    symptoms: list[str] = []

    risk_score: int = 0

    risk_level: str = "Low"

    created_at: datetime = datetime.utcnow()


    class Settings:
        name = "pregnancy_records"
class Appointment(Document):

    patient_id: str

    doctor_id: str

    scheduled_for: datetime

    reason: str | None = None

    status: str = "pending"

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "appointments"