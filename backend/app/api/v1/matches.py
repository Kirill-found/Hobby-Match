from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database import get_db
from app.models.user import User
from app.models.match import Match
from app.api.deps import get_current_user
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class MatchUser(BaseModel):
    user_id: int
    name: str
    age: int | None
    photos: List[str]
    bio: str | None
    common_interests: List[dict]
    distance_km: float | None
    reliability_score: float
    is_verified: bool
    matched_at: datetime

    class Config:
        from_attributes = True


@router.get("/", response_model=List[MatchUser])
def get_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all matches for current user
    """

    # Get all matches where current user is either user1 or user2
    matches = db.query(Match).filter(
        and_(
            Match.is_active == True,
            or_(
                Match.user1_id == current_user.id,
                Match.user2_id == current_user.id
            )
        )
    ).all()

    match_users = []
    for match in matches:
        # Get the other user (not current user)
        other_user_id = match.user2_id if match.user1_id == current_user.id else match.user1_id
        other_user = db.query(User).filter(User.id == other_user_id).first()

        if not other_user:
            continue

        # Calculate distance (placeholder)
        distance_km = None
        if current_user.latitude and current_user.longitude and other_user.latitude and other_user.longitude:
            distance_km = 5.0  # TODO: Implement Haversine formula

        # Get common interests (placeholder)
        common_interests = []  # TODO: Query user_interests table

        match_user = MatchUser(
            user_id=other_user.id,
            name=other_user.first_name,
            age=other_user.age,
            photos=other_user.photos if other_user.photos else [],
            bio=other_user.bio,
            common_interests=common_interests,
            distance_km=distance_km,
            reliability_score=other_user.reliability_score,
            is_verified=other_user.is_premium,
            matched_at=match.matched_at
        )
        match_users.append(match_user)

    # Sort by matched_at (most recent first)
    match_users.sort(key=lambda x: x.matched_at, reverse=True)

    return match_users


@router.delete("/{match_id}")
def unmatch_user(
    match_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Unmatch with a user (remove match)
    """

    # Find match
    match = db.query(Match).filter(
        Match.id == match_id,
        or_(
            Match.user1_id == current_user.id,
            Match.user2_id == current_user.id
        )
    ).first()

    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )

    # Soft delete (set is_active = False)
    match.is_active = False
    db.commit()

    return {
        "success": True,
        "message": "Unmatch successful"
    }
