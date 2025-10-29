from pydantic import BaseModel, Field
from typing import Optional


class LocationUpdate(BaseModel):
    """Update user location"""
    city: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)


class CityGeocodeRequest(BaseModel):
    """Request to geocode a city name"""
    city: str = Field(..., min_length=2, max_length=255)
    country: Optional[str] = Field(None, max_length=100)


class CityGeocodeResponse(BaseModel):
    """Geocoded city result"""
    city: str
    country: str
    latitude: float
    longitude: float
    display_name: str
