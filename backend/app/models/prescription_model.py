from beanie import Document
from pydantic import Field
from datetime import datetime, timezone


class Prescription(Document):
    doctor_id: str
    doctor_name: str

    patient_id: str
    patient_name: str
    patient_email: str

    medicine: str
    dosage: str
    frequency: str
    timing: str

    instructions: str = ""
    status: str = "active"
    reviewed_by_patient: bool = False
    reviewed_at: datetime | None = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Settings:
        name = "prescriptions"
