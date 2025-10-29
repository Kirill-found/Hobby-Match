from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, not_
from app.database import get_db
from app.models.user import User
from app.models.swipe import Swipe
from app.models.match import Match
from app.models.interest import UserInterest, InterestCategory
from app.api.deps import get_current_user
from app.schemas.user import DiscoveryCard
from typing import List
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/users", response_model=List[DiscoveryCard])
def get_discovery_users(
    limit: int = 10,
    min_age: int = None,
    max_age: int = None,
    max_distance: int = None,
    interest_ids: str = None,  # Comma-separated IDs
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get users for discovery/swipe

    Filters:
    - Exclude current user
    - Exclude users already swiped (liked or disliked)
    - Match gender preferences
    - Match age preferences
    - Match distance (if available)
    - Users with completed onboarding only
    """

    # Get IDs of users already swiped by current user
    swiped_user_ids = db.query(Swipe.target_user_id).filter(
        Swipe.user_id == current_user.id
    ).all()
    swiped_ids = [user_id[0] for user_id in swiped_user_ids]

    # Base query
    query = db.query(User).filter(
        User.id != current_user.id,  # Exclude self
        User.onboarding_completed == True,  # Only completed profiles
        User.is_active == True,  # Only active users
    )

    # Exclude already swiped users
    if swiped_ids:
        query = query.filter(not_(User.id.in_(swiped_ids)))

    # Gender preference filter
    if current_user.partner_gender_preference and current_user.partner_gender_preference != 'any':
        query = query.filter(User.gender == current_user.partner_gender_preference)

    # Age preference filter - use provided filters or user preferences
    effective_min_age = min_age if min_age is not None else current_user.min_age
    effective_max_age = max_age if max_age is not None else current_user.max_age

    if effective_min_age:
        query = query.filter(User.age >= effective_min_age)
    if effective_max_age:
        query = query.filter(User.age <= effective_max_age)

    # Interest filter - if specific interests requested
    if interest_ids:
        interest_id_list = [int(id_str.strip()) for id_str in interest_ids.split(',') if id_str.strip()]
        if interest_id_list:
            # Get users who have at least one of the selected interests
            users_with_interests = db.query(UserInterest.user_id).filter(
                UserInterest.category_id.in_(interest_id_list)
            ).distinct().all()
            user_ids_with_interests = [uid[0] for uid in users_with_interests]

            if user_ids_with_interests:
                query = query.filter(User.id.in_(user_ids_with_interests))
            else:
                # No users with these interests - return empty list
                return []

    # Get users
    users = query.limit(limit).all()

    # Filter by distance if max_distance is provided (post-query filtering)
    if max_distance and current_user.latitude and current_user.longitude:
        filtered_users = []
        for user in users:
            if user.latitude and user.longitude:
                # Simple distance calculation (Haversine formula approximation)
                from math import radians, sin, cos, sqrt, atan2

                lat1 = radians(current_user.latitude)
                lon1 = radians(current_user.longitude)
                lat2 = radians(user.latitude)
                lon2 = radians(user.longitude)

                dlat = lat2 - lat1
                dlon = lon2 - lon1

                a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
                c = 2 * atan2(sqrt(a), sqrt(1 - a))
                distance = 6371 * c  # Earth radius in kilometers

                if distance <= max_distance:
                    filtered_users.append(user)
            else:
                # User has no coordinates - include them anyway
                filtered_users.append(user)

        users = filtered_users

    # Convert to DiscoveryCard format
    discovery_cards = []
    for user in users:
        # Calculate distance (placeholder - implement with real geolocation)
        distance_km = None
        if current_user.latitude and current_user.longitude and user.latitude and user.longitude:
            # TODO: Implement Haversine formula for distance calculation
            distance_km = 5.0  # Placeholder

        # Get user interests with icons
        user_interests_query = db.query(UserInterest, InterestCategory).join(
            InterestCategory, UserInterest.category_id == InterestCategory.id
        ).filter(UserInterest.user_id == user.id).all()

        interests = []
        for user_interest, category in user_interests_query:
            interests.append({
                "name": category.name,
                "icon": category.icon or "🎯",
                "skill_level": user_interest.skill_level,
                "want_to_try": user_interest.want_to_try
            })

        # Get common interests (placeholder)
        common_interests = []  # TODO: Query user_interests table

        card = DiscoveryCard(
            user_id=user.id,
            name=user.first_name,
            age=user.age,
            photos=user.photos if user.photos else [],
            bio=user.bio,
            city=user.city,
            interests=interests,
            common_interests=common_interests,
            distance_km=distance_km,
            reliability_score=user.reliability_score,
            is_verified=user.is_premium,  # Placeholder: premium users are "verified"
        )
        discovery_cards.append(card)

    return discovery_cards


@router.post("/swipe")
def swipe_user(
    target_user_id: int,
    action: str,  # "like" or "dislike"
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Swipe on a user (like or dislike)

    If both users liked each other, create a match
    """

    # Validate action
    if action not in ["like", "dislike"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action must be 'like' or 'dislike'"
        )

    # Check if target user exists
    target_user = db.query(User).filter(User.id == target_user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check if already swiped
    existing_swipe = db.query(Swipe).filter(
        and_(
            Swipe.user_id == current_user.id,
            Swipe.target_user_id == target_user_id
        )
    ).first()

    if existing_swipe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already swiped on this user"
        )

    # Create swipe record
    swipe = Swipe(
        user_id=current_user.id,
        target_user_id=target_user_id,
        is_like=(action == "like"),
        swiped_at=datetime.utcnow()
    )
    db.add(swipe)
    db.commit()

    # Check for match if it's a like
    matched = False
    if action == "like":
        # Check if target user also liked current user
        reverse_swipe = db.query(Swipe).filter(
            and_(
                Swipe.user_id == target_user_id,
                Swipe.target_user_id == current_user.id,
                Swipe.is_like == True
            )
        ).first()

        if reverse_swipe:
            # It's a match! Create match record
            matched = True  # Set matched to True since reverse swipe exists

            # Check if match already exists
            existing_match = db.query(Match).filter(
                or_(
                    and_(
                        Match.user1_id == current_user.id,
                        Match.user2_id == target_user_id
                    ),
                    and_(
                        Match.user1_id == target_user_id,
                        Match.user2_id == current_user.id
                    )
                )
            ).first()

            if not existing_match:
                match = Match(
                    user1_id=current_user.id,
                    user2_id=target_user_id,
                    matched_at=datetime.utcnow()
                )
                db.add(match)
                db.commit()

    return {
        "success": True,
        "action": action,
        "matched": matched,
        "message": "It's a match! 🎉" if matched else "Swipe recorded"
    }


@router.delete("/swipes/reset")
def reset_my_swipes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Reset all swipes for current user (for testing/development)
    This will allow the user to see all users in discovery again
    """

    # Count swipes before deletion
    swipe_count = db.query(Swipe).filter(Swipe.user_id == current_user.id).count()

    if swipe_count > 0:
        # Delete all swipes
        db.query(Swipe).filter(Swipe.user_id == current_user.id).delete()
        db.commit()

        return {
            "success": True,
            "message": f"Successfully reset {swipe_count} swipes. Discovery feed refreshed!",
            "swipes_deleted": swipe_count
        }
    else:
        return {
            "success": True,
            "message": "No swipes to reset",
            "swipes_deleted": 0
        }
