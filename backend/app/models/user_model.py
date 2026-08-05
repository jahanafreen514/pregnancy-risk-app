from datetime import datetime
from beanie import Document
from typing import Optional


class User(Document):

    name: str
    email: str
    password_hash: str

    role: str = "user"

    country_code: Optional[str] = None
    phone: Optional[str] = None

    selected_doctor: Optional[str] = None

    is_active: bool = True

    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"