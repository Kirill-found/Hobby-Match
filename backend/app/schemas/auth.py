from pydantic import BaseModel
from typing import Optional
from app.schemas.user import UserResponse


class TelegramLogin(BaseModel):
    """Telegram WebApp initData for authentication"""
    init_data: str


class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """Data stored in JWT token"""
    user_id: Optional[int] = None
    telegram_id: Optional[int] = None
