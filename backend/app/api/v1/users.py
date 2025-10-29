from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserUpdate, UserProfile
from app.schemas.location import LocationUpdate, CityGeocodeRequest, CityGeocodeResponse
from app.models.user import User
from app.api.deps import get_current_user
import httpx

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


@router.delete("/photos")
def delete_photo(
    photo_url: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a profile photo by URL"""
    if not current_user.photos or photo_url not in current_user.photos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )

    # Remove photo
    current_user.photos.remove(photo_url)
    db.commit()

    return {"message": "Photo deleted"}


@router.put("/photos/reorder")
def reorder_photos(
    photo_urls: list[str],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reorder user's photos"""
    # Validate all URLs belong to user
    if not current_user.photos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No photos to reorder"
        )

    # Check all provided URLs are valid
    for url in photo_urls:
        if url not in current_user.photos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Photo URL not found: {url}"
            )

    # Update photos order
    current_user.photos = photo_urls
    db.commit()

    return {"message": "Photos reordered successfully", "photos": current_user.photos}


@router.put("/location")
def update_location(
    location: LocationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user location (city and/or coordinates)"""
    if location.city is not None:
        current_user.city = location.city

    if location.latitude is not None and location.longitude is not None:
        current_user.latitude = location.latitude
        current_user.longitude = location.longitude

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Location updated successfully",
        "city": current_user.city,
        "latitude": current_user.latitude,
        "longitude": current_user.longitude
    }


@router.post("/location/geocode", response_model=CityGeocodeResponse)
async def geocode_city(request: CityGeocodeRequest):
    """
    Geocode city name to coordinates using Nominatim (OpenStreetMap)
    Free, no API key required
    """
    try:
        async with httpx.AsyncClient() as client:
            # Nominatim API (OpenStreetMap)
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                "q": f"{request.city}, {request.country}" if request.country else request.city,
                "format": "json",
                "limit": 1,
                "addressdetails": 1
            }
            headers = {
                "User-Agent": "HobbyMatch/1.0 (dating app)"
            }

            response = await client.get(url, params=params, headers=headers, timeout=10.0)
            response.raise_for_status()

            results = response.json()

            if not results:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="City not found"
                )

            result = results[0]
            address = result.get("address", {})

            return CityGeocodeResponse(
                city=address.get("city") or address.get("town") or address.get("village") or request.city,
                country=address.get("country", request.country or ""),
                latitude=float(result["lat"]),
                longitude=float(result["lon"]),
                display_name=result["display_name"]
            )

    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Geocoding service error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Geocoding failed: {str(e)}"
        )
