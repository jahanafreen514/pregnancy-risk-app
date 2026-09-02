from datetime import datetime, timezone

from beanie import Document
from pydantic import Field
from typing import Any


class Notification(Document):
    user_id: str
    title: str
    message: str
    category: str = "general"
    metadata: dict[str, Any] = Field(default_factory=dict)
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "notifications"
