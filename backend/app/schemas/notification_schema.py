from datetime import datetime
from pydantic import BaseModel
from typing import Any


class NotificationOut(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    category: str
    metadata: dict[str, Any] = {}
    is_read: bool
    created_at: datetime
