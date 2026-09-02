from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class ReportCreate(BaseModel):

    patient_id: str
    patient_name: str = ""
    patient_email: str = ""

    title: str = Field(
        min_length=2,
        max_length=200
    )

    summary: str = Field(
        min_length=2
    )

    risk_level: str = "Low"
    risk_score: int = 0
    confidence: float = 0
    recommendation: str = ""
    symptoms: list[str] = Field(default_factory=list)
    risk_factors: list[str] = Field(default_factory=list)
    vitals: dict[str, Any] = Field(default_factory=dict)



class ReportOut(BaseModel):

    id: str

    patient_id: str
    patient_name: str = ""
    patient_email: str = ""

    doctor_id: str | None

    title: str

    summary: str

    risk_level: str = "Low"
    risk_score: int = 0
    confidence: float = 0
    recommendation: str = ""
    symptoms: list[str] = Field(default_factory=list)
    risk_factors: list[str] = Field(default_factory=list)
    vitals: dict[str, Any] = Field(default_factory=dict)
    doctor_notes: str = ""
    status: str = "New"

    created_at: datetime


class ReportUpdate(BaseModel):
    summary: str | None = Field(default=None, min_length=2)
    doctor_notes: str | None = None
    status: str | None = None
