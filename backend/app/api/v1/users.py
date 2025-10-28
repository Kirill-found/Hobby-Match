from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserUpdate, UserProfile
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/profile", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user's full profile"""
    return UserProfile.from_orm(current_user)


@router.put("/profile", response_model=UserProfile)
def update_profile(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    # Update fields
    update_data = updates.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return UserProfile.from_orm(current_user)


@router.post("/onboarding/complete")
def complete_onboarding(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark onboarding as completed"""
    current_user.onboarding_completed = True
    db.commit()

    return {"message": "Onboarding completed", "user": {"onboarding_completed": True}}


@router.post("/photos")
def upload_photo(
    photo: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload profile photo
    TODO: Implement S3/R2 upload
    """
    # Placeholder - implement S3 upload
    photo_url = f"https://cdn.hobbyma.app/photos/user{current_user.id}_photo.jpg"

    # Add to user's photos
    if current_user.photos is None:
        current_user.photos = []

    current_user.photos.append(photo_url)
    db.commit()

    return {
        "id": len(current_user.photos),
        "photo_url": photo_url,
        "is_primary": len(current_user.photos) == 1
    }


@router.delete("/photos/{photo_index}")
def delete_photo(
    photo_index: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a profile photo"""
    if not current_user.photos or photo_index >= len(current_user.photos):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )

    # Remove photo
    current_user.photos.pop(photo_index)
    db.commit()

    return {"message": "Photo deleted"}
