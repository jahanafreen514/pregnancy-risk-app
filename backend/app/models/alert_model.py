from datetime import datetime, timezone
from beanie import Document
from pydantic import Field
from typing import Optional


class Alert(Document):

    user_id: str

    title: str

    message: str

    severity: str = "info"

    is_read: bool = False

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


    class Settings:
        name = "alerts"
