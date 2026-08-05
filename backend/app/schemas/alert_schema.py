from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class AlertCreate(BaseModel):

    user_id: str

    title: str = Field(
        min_length=2,
        max_length=200
    )

    message: str = Field(
        min_length=2
    )

    severity: str = Field(
        default="info",
        pattern="^(info|warning|high|emergency)$"
    )



class AlertOut(BaseModel):

    id: str

    user_id: str

    title: str

    message: str

    severity: str

    is_read: bool

    created_at: datetime