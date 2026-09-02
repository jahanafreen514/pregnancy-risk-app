from datetime import datetime, timezone

from beanie import Document
from pydantic import Field


class Feedback(Document):
    user_id: str
    user_name: str
    # Older feedback documents predate role tracking and lack this field.
    sender_type: str = "user"
    rating: int
    comment: str
    category: str | None = None
    consultation_id: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "feedback"
