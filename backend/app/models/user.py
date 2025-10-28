from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, Text, ARRAY
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(Integer, unique=True, index=True, nullable=False)
    username = Column(String(255), nullable=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=True)

    # Profile info
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)  # male, female, other
    bio = Column(Text, nullable=True)

    # Location
    city = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Photos - stored as array of URLs
    photos = Column(ARRAY(String), default=[], nullable=False)

    # Availability
    availability = Column(ARRAY(String), default=[], nullable=False)  # weekday_morning, weekend_evening, etc

    # Preferences
    partner_gender_preference = Column(String(20), default="any")  # male, female, any
    max_distance_km = Column(Integer, default=10)
    min_age = Column(Integer, default=18)
    max_age = Column(Integer, default=99)

    # Premium
    is_premium = Column(Boolean, default=False)
    premium_until = Column(DateTime, nullable=True)

    # Gamification
    reliability_score = Column(Float, default=100.0)
    total_meetings = Column(Integer, default=0)
    successful_meetings = Column(Integer, default=0)
    no_shows = Column(Integer, default=0)

    # Limits
    daily_swipes_used = Column(Integer, default=0)
    last_swipe_reset = Column(DateTime, server_default=func.now())

    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    onboarding_completed = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_active = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<User {self.id}: {self.first_name} (@{self.username})>"
