from pydantic import BaseModel


class StatusUpdate(BaseModel):
    is_active: bool