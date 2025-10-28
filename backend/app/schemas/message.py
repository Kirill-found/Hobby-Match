from pydantic import BaseModel
from datetime import datetime


class MessageCreate(BaseModel):
    """Create a message"""
    text: str


class MessageResponse(BaseModel):
    """Message response"""
    id: int
    sender_id: int
    text: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
