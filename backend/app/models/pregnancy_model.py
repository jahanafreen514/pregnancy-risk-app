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
    probability: Optional[float] = None
    model_version: Optional[str] = None

    created_at: datetime = datetime.utcnow()


    class Settings:
        name = "pregnancy_records"
class Appointment(Document):

    patient_id: str

    doctor_id: str

    scheduled_for: datetime

    reason: str | None = None

    status: str = "pending"

    appointment_type: str = "in_person"
    reminder_sent: bool = False
    call_status: str = "idle"  # idle, ringing, active, rejected, ended, missed
    call_initiator_id: Optional[str] = None
    call_ringing_at: Optional[datetime] = None
    call_started_at: Optional[datetime] = None
    call_ended_at: Optional[datetime] = None
    call_duration_seconds: int = 0
    # WhatsApp/WebRTC may not report call completion to GlowCare. Both users
    # explicitly confirm before the appointment status becomes completed.
    call_joined_by: list[str] = Field(default_factory=list)
    call_completed_by: list[str] = Field(default_factory=list)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "appointments"
