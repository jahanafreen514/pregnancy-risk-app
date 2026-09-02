from pydantic import BaseModel
from typing import Optional


# Existing profile update schema
class DoctorProfileUpdate(BaseModel):

    # Account fields and professional fields are saved together from the
    # doctor portal. Email deliberately remains immutable here.
    name: Optional[str] = None
    phone: Optional[str] = None

    specialization: Optional[str] = None

    license_number: Optional[str] = None

    hospital: Optional[str] = None
    address: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None



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
    
