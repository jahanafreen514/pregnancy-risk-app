from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ReminderCreate(BaseModel):
    kind: Literal["medication", "water"]
    title: str = Field(min_length=1, max_length=120)
    message: str = Field(min_length=1, max_length=500)
    time_of_day: str = Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$")


class ReminderOut(ReminderCreate):
    id: str
    enabled: bool
    created_at: datetime
