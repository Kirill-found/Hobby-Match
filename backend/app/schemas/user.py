from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UserCreate(UserBase):
    telegram_id: int
    username: Optional[str] = None


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    availability: Optional[List[str]] = None
    partner_gender_preference: Optional[str] = None
    max_distance_km: Optional[int] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None


class UserResponse(BaseModel):
    id: int
    telegram_id: int
    username: Optional[str]
    first_name: str
    last_name: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    bio: Optional[str]
    city: Optional[str]
    district: Optional[str]
    photos: List[str]
    is_premium: bool
    reliability_score: float
    onboarding_completed: bool
    created_at: datetime
    last_active: datetime

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    """Full user profile with all details"""
    id: int
    telegram_id: int
    username: Optional[str]
    first_name: str
    last_name: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    bio: Optional[str]
    city: Optional[str]
    district: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    photos: List[str]
    availability: List[str]
    partner_gender_preference: Optional[str]
    max_distance_km: Optional[int]
    min_age: Optional[int]
    max_age: Optional[int]
    is_premium: bool
    reliability_score: float
    total_meetings: int
    successful_meetings: int
    onboarding_completed: bool
    created_at: datetime
    last_active: datetime

    class Config:
        from_attributes = True


class DiscoveryCard(BaseModel):
    """User card for discovery/swipe"""
    user_id: int
    name: str
    age: Optional[int]
    photos: List[str]
    bio: Optional[str]
    common_interests: List[dict]  # Interests with skill levels
    distance_km: Optional[float]
    reliability_score: float
    is_verified: bool
