from pydantic import BaseModel
from datetime import datetime, date, time
from typing import Optional


class MeetingProposalCreate(BaseModel):
    """Create meeting proposal"""
    match_id: int
    date: date
    time: time
    location: str
    activity: str


class MeetingProposalResponse(BaseModel):
    """Meeting proposal response"""
    id: int
    match_id: int
    proposer_id: int
    date: date
    time: time
    location: str
    activity: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class MeetingRatingCreate(BaseModel):
    """Rate a meeting"""
    showed_up: bool
    rating: Optional[int] = None  # 1-5
    comment: Optional[str] = None
