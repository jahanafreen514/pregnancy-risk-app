from datetime import datetime
from typing import Literal
from pydantic import BaseModel


class AppointmentCreate(BaseModel):

    doctor_id: str

    scheduled_for: datetime

    reason: str | None = None

    appointment_type: Literal["in_person", "online"] = "in_person"



class AppointmentUpdate(BaseModel):

    status: str



class AppointmentOut(BaseModel):

    id: str
    doctor_id: str
    patient_id: str

    patient_name: str | None = None
    patient_email: str | None = None
    doctor_name: str | None = None
    doctor_email: str | None = None

    scheduled_for: datetime
    status: str
    reason: str | None = None
    appointment_type: str = "in_person"

    class Config:
        from_attributes = True
