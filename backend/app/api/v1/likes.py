from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database import get_db
from app.models.user import User
from app.models.swipe import Swipe
from app.models.interest import UserInterest, InterestCategory
from app.api.deps import get_current_user
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class LikedUser(BaseModel):
    """User that current user has liked"""
    user_id: int
    name: str
    age: int | None
    photos: List[str]
    bio: str | None
    interests: List[dict]
    distance_km: float | None
    reliability_score: float
    is_verified: bool
    liked_at: datetime

    class Config:
        from_attributes = True


@router.get("/", response_model=List[LikedUser])
def get_likes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all users that current user has liked (not necessarily mutual)
    """
    # Get all swipes where current user liked someone
    likes = db.query(Swipe).filter(
        and_(
            Swipe.user_id == current_user.id,
            Swipe.is_like == True
        )
    ).order_by(Swipe.swiped_at.desc()).all()

    liked_users = []

    for like in likes:
        # Get the user that was liked
        liked_user = db.query(User).filter(User.id == like.target_user_id).first()

        if not liked_user:
            continue

        # Get user's interests
        user_interests = db.query(UserInterest).filter(
            UserInterest.user_id == liked_user.id
        ).all()

        interests = []
        for ui in user_interests:
            category = db.query(InterestCategory).filter(
                InterestCategory.id == ui.interest_id
            ).first()
            if category:
                interests.append({
                    "id": category.id,
                    "name": category.name,
                    "icon": category.icon,
                    "level": ui.skill_level
                })

        # Calculate distance (placeholder - should use Haversine formula)
        # TODO: Implement real distance calculation using lat/lon
        distance_km = None
        if current_user.location_lat and current_user.location_lon and \
           liked_user.location_lat and liked_user.location_lon:
            # Simplified distance calculation (will be inaccurate)
            distance_km = 5.0  # Placeholder

        # Build response
        liked_user_data = LikedUser(
            user_id=liked_user.id,
            name=liked_user.name,
            age=liked_user.age,
            photos=liked_user.photos or [],
            bio=liked_user.bio,
            interests=interests,
            distance_km=distance_km,
            reliability_score=liked_user.reliability_score,
            is_verified=liked_user.is_verified,
            liked_at=like.swiped_at
        )

        liked_users.append(liked_user_data)

    return liked_users


@router.delete("/{user_id}")
def unlike_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove like (unlike a user)
    """
    # Find the swipe
    swipe = db.query(Swipe).filter(
        and_(
            Swipe.user_id == current_user.id,
            Swipe.target_user_id == user_id,
            Swipe.is_like == True
        )
    ).first()

    if not swipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Like not found"
        )

    # Delete the swipe
    db.delete(swipe)
    db.commit()

    return {"message": "User unliked successfully"}
