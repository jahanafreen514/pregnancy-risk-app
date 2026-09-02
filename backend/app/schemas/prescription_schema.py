from pydantic import BaseModel
from typing import Optional

# Prescription create cheyyadaniki request body

class PrescriptionCreate(BaseModel):
    doctor_id: str | None = None
    doctor_name: str | None = None
    patient_id: str | None = None
    patient_name: str
    patient_email: str
    medicine: str
    dosage: str
    frequency: str
    timing: str
    instructions: Optional[str] = ""
    status: Optional[str] = "active"


# Prescription response kosam

class PrescriptionResponse(BaseModel):
    id: str
    doctor_id: str
    doctor_name: str
    patient_id: str
    patient_name: str
    patient_email: str
    medicine: str
    dosage: str
    frequency: str
    timing: str
    instructions: Optional[str] = ""
    status: Optional[str] = "active"


class PrescriptionUpdate(BaseModel):
    medicine: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    timing: Optional[str] = None
    instructions: Optional[str] = None
    status: Optional[str] = None


class PrescriptionReview(BaseModel):
    """Patient acknowledgement; it is not a medication-change request."""
    reviewed: bool
