from datetime import date, datetime
from beanie import Document
from typing import Optional


class User(Document):

    name: str
    email: str
    password_hash: str

    role: str = "user"

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

    is_active: bool = True
    is_email_verified: bool = False

    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"
