from pydantic import BaseModel
from datetime import datetime


class SwipeCreate(BaseModel):
    """Create a swipe"""
    target_user_id: int
    direction: str  # right, left


class SwipeResponse(BaseModel):
    """Swipe result"""
    match: bool
    match_id: int | None = None
    partner: dict | None = None  # Partner info if matched

    class Config:
        from_attributes = True
