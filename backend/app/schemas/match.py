from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MatchResponse(BaseModel):
    """Match with partner info"""
    match_id: int
    created_at: datetime
    partner: dict  # User info
    last_message: Optional[dict] = None
    unread_count: int = 0

    class Config:
        from_attributes = True
