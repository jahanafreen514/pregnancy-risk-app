from datetime import datetime, timezone

from beanie import Document
from pydantic import Field


class Reminder(Document):
    user_id: str
    kind: str
    title: str
    message: str
    time_of_day: str
    enabled: bool = True
    last_sent_date: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "reminders"
