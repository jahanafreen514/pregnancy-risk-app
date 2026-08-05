from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field
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

selectedDoctor: str | None = None

role: str = "user"


class LoginRequest(BaseModel):
    email: EmailStr

    password: str

class UserUpdate(BaseModel):
    name: str | None = None

    countryCode: str | None = None

    phone: str | None = None

    selectedDoctor: str | None = None


class UserOut(BaseModel):
    id: str = Field(alias="_id")

    name: str

    email: EmailStr

    role: str

    country_code: str | None = None

    phone: str | None = None

    selected_doctor: str | None = None

    is_active: bool

    created_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
)

class TokenResponse(BaseModel):

    access_token: str

    refresh_token: str | None = None

    token_type: str = "bearer"

    user: UserOut
