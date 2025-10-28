from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.interest import InterestCategoryResponse, UserInterestCreate, UserInterestResponse
from app.models.interest import InterestCategory, UserInterest
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/tree", response_model=List[InterestCategoryResponse])
def get_interests_tree(db: Session = Depends(get_db)):
    """
    Get complete interests tree (Level 1 categories with children)
    """
    # Get level 1 categories
    level1_categories = db.query(InterestCategory).filter(
        InterestCategory.level == 1
    ).all()

    # Build tree (recursive function would go here)
    # For now, return flat list
    return level1_categories


@router.get("/categories", response_model=List[InterestCategoryResponse])
def get_categories(
    level: Optional[int] = Query(None, ge=1, le=4),
    parent_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get categories by level or parent
    """
    query = db.query(InterestCategory)

    if level:
        query = query.filter(InterestCategory.level == level)

    if parent_id:
        query = query.filter(InterestCategory.parent_id == parent_id)

    categories = query.all()
    return categories


@router.post("/user/interests", response_model=UserInterestResponse, status_code=status.HTTP_201_CREATED)
def add_user_interest(
    interest: UserInterestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add interest to user profile
    """
    # Check if category exists
    category = db.query(InterestCategory).filter(
        InterestCategory.id == interest.category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    # Check if already exists
    existing = db.query(UserInterest).filter(
        UserInterest.user_id == current_user.id,
        UserInterest.category_id == interest.category_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interest already added"
        )

    # Create user interest
    user_interest = UserInterest(
        user_id=current_user.id,
        category_id=interest.category_id,
        skill_level=interest.skill_level,
        want_to_try=interest.want_to_try
    )

    db.add(user_interest)
    db.commit()
    db.refresh(user_interest)

    # Return with category info
    return UserInterestResponse(
        id=user_interest.id,
        category_id=category.id,
        name=category.name,
        icon=category.icon,
        skill_level=user_interest.skill_level,
        want_to_try=user_interest.want_to_try
    )


@router.delete("/user/interests/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_user_interest(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove interest from user profile
    """
    user_interest = db.query(UserInterest).filter(
        UserInterest.user_id == current_user.id,
        UserInterest.category_id == category_id
    ).first()

    if not user_interest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interest not found"
        )

    db.delete(user_interest)
    db.commit()

    return None


@router.get("/user/interests", response_model=List[UserInterestResponse])
def get_user_interests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's interests
    """
    interests = db.query(UserInterest).filter(
        UserInterest.user_id == current_user.id
    ).all()

    result = []
    for interest in interests:
        result.append(UserInterestResponse(
            id=interest.id,
            category_id=interest.category.id,
            name=interest.category.name,
            icon=interest.category.icon,
            skill_level=interest.skill_level,
            want_to_try=interest.want_to_try
        ))

    return result
