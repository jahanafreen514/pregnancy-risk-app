from datetime import datetime
from pydantic import BaseModel, Field


class ReportCreate(BaseModel):

    patient_id: str

    title: str = Field(
        min_length=2,
        max_length=200
    )

    summary: str = Field(
        min_length=2
    )



class ReportOut(BaseModel):

    id: str

    patient_id: str

    doctor_id: str | None

    title: str

    summary: str

    created_at: datetime