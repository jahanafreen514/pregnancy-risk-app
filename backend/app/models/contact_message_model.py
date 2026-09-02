from datetime import datetime, timezone

from beanie import Document
from pydantic import Field


class ContactMessage(Document):
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "contact_messages"
