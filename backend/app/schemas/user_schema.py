from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8)
    countryCode: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = Field(default=None, max_length=500)
    selectedDoctor: Optional[str] = None
    role: str = "user"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    countryCode: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = Field(default=None, max_length=500)
    selectedDoctor: Optional[str] = None
    bloodGroup: Optional[str] = Field(default=None, pattern="^(A|B|AB|O)[+-]$")
    lmpDate: Optional[date] = None
    trimesterOverride: Optional[int] = Field(default=None, ge=1, le=3)
    language: Optional[str] = Field(default=None, min_length=2, max_length=10)
    notificationsEnabled: Optional[bool] = None
    emailNotificationsEnabled: Optional[bool] = None


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    country_code: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    selected_doctor: Optional[str] = None
    blood_group: Optional[str] = None
    lmp_date: Optional[date] = None
    trimester_override: Optional[int] = None
    language: str = "en"
    notifications_enabled: bool = True
    email_notifications_enabled: bool = True
    is_active: bool
    is_email_verified: bool = False
    created_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

    @field_validator("id", mode="before")
    @classmethod
    def serialize_object_id(cls, value):
        return str(value)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    role: Optional[str] = None
    user: Optional[UserOut] = None
