from datetime import datetime, timedelta, timezone

from beanie import Document
from pydantic import Field


class PasswordResetToken(Document):
    user_id: str
    otp_hash: str
    purpose: str = "password_reset"
    expires_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(minutes=15))
    used: bool = False

    class Settings:
        name = "password_reset_tokens"
