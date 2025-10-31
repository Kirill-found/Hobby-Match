from pydantic import BaseModel
from typing import Optional, List


class InterestCategoryResponse(BaseModel):
    """Interest category (from tree)"""
    id: int
    name: str
    icon: Optional[str]
    level: int
    parent_id: Optional[int]
    requires_skill_level: bool = True
    children: Optional[List["InterestCategoryResponse"]] = None

    class Config:
        from_attributes = True


class UserInterestCreate(BaseModel):
    """Add interest to user profile"""
    category_id: int
    skill_level: Optional[str] = None
    want_to_try: bool = False


class UserInterestResponse(BaseModel):
    """User's interest with details"""
    id: int
    category_id: int
    name: str
    icon: Optional[str]
    skill_level: Optional[str]
    want_to_try: bool

    class Config:
        from_attributes = True
