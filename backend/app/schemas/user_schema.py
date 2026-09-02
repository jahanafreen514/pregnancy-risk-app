from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from bson import ObjectId

class UserRegister(BaseModel):
    name: str = Field(
    min_length=2,
    max_length=120
)

email: EmailStr

password: str = Field(
    min_length=8
)

countryCode: str | None = None

phone: str | None = None

address: str | None = Field(default=None, max_length=500)

selectedDoctor: str | None = None

role: str = "user"


class LoginRequest(BaseModel):
    email: EmailStr

    password: str

class UserUpdate(BaseModel):
    name: str | None = None

    countryCode: str | None = None

    phone: str | None = None
    address: str | None = Field(default=None, max_length=500)

    selectedDoctor: str | None = None
    bloodGroup: str | None = Field(default=None, pattern="^(A|B|AB|O)[+-]$")
    lmpDate: date | None = None
    trimesterOverride: int | None = Field(default=None, ge=1, le=3)
    language: str | None = Field(default=None, min_length=2, max_length=10)
    notificationsEnabled: bool | None = None
    emailNotificationsEnabled: bool | None = None


class UserOut(BaseModel):
    id: str

    name: str

    email: EmailStr

    role: str

    country_code: str | None = None

    phone: str | None = None
    address: str | None = None

    selected_doctor: str | None = None
    blood_group: str | None = None
    lmp_date: date | None = None
    trimester_override: int | None = None
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

    refresh_token: str | None = None

    token_type: str = "bearer"

    user: UserOut
