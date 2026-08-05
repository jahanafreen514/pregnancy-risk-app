from datetime import datetime
from beanie import Document
from typing import Optional


class Report(Document):

    patient_id: str

    doctor_id: Optional[str] = None

    title: str

    summary: str

    created_at: datetime = datetime.utcnow()


    class Settings:
        name = "reports"