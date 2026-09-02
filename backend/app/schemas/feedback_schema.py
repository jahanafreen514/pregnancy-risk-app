from datetime import datetime
from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=2, max_length=2000)
    category: str | None = Field(default=None, max_length=100)
    consultation_id: str | None = None


class FeedbackOut(FeedbackCreate):
    id: str
    user_id: str
    user_name: str
    sender_type: str
    created_at: datetime
