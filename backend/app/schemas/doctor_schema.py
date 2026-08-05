from pydantic import BaseModel
from typing import Optional


# Existing profile update schema
class DoctorProfileUpdate(BaseModel):

    specialization: Optional[str] = None

    license_number: Optional[str] = None

    hospital: Optional[str] = None



# Doctor document upload response
class DoctorVerificationResponse(BaseModel):

    message: str

    license_image: Optional[str] = None

    hospital_id_image: Optional[str] = None

    verification_status: str



# Admin verification update
class DoctorVerificationUpdate(BaseModel):

    verification_status: str
    # approved / rejected / pending

    is_verified: bool
    