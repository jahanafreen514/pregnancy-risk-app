from datetime import datetime
from pydantic import BaseModel


class AppointmentCreate(BaseModel):

    doctor_id: str

    scheduled_for: datetime

    reason: str | None = None



class AppointmentUpdate(BaseModel):

    status: str



class AppointmentOut(BaseModel):

    id: str
    doctor_id: str
    patient_id: str

    patient_name: str | None = None
    patient_email: str | None = None

    scheduled_for: datetime
    status: str
    reason: str | None = None

    class Config:
        from_attributes = True