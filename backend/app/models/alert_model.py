from datetime import datetime
from beanie import Document
from typing import Optional


class Alert(Document):

    user_id: str

    title: str

    message: str

    severity: str = "info"

    is_read: bool = False

    created_at: datetime = datetime.utcnow()


    class Settings:
        name = "alerts"