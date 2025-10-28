from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import TelegramLogin, Token
from app.schemas.user import UserResponse
from app.models.user import User
from app.utils.telegram import validate_telegram_init_data
from app.utils.security import create_access_token
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/telegram-login", response_model=Token)
def telegram_login(data: TelegramLogin, db: Session = Depends(get_db)):
    """
    Authenticate user via Telegram WebApp initData
    Creates new user if doesn't exist
    """
    # Validate Telegram data
    user_data = validate_telegram_init_data(data.init_data)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Telegram authentication data"
        )

    telegram_id = user_data.get("id")
    if not telegram_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing telegram_id"
        )

    # Find or create user
    user = db.query(User).filter(User.telegram_id == telegram_id).first()

    if not user:
        # Create new user
        user = User(
            telegram_id=telegram_id,
            username=user_data.get("username"),
            first_name=user_data.get("first_name", "User"),
            last_name=user_data.get("last_name"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create access token
    access_token = create_access_token(
        data={"user_id": user.id, "telegram_id": user.telegram_id}
    )

    return Token(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user
    """
    return UserResponse.from_orm(current_user)
