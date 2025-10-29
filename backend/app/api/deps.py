from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.security import verify_token
from app.models.user import User

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    """
    token = credentials.credentials
    print(f"[Auth] Received token: {token[:20]}..." if len(token) > 20 else f"[Auth] Received token: {token}")

    # Verify token
    payload = verify_token(token)
    print(f"[Auth] Token verification result: {payload}")

    if not payload:
        print("[Auth] Token verification failed - invalid token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("user_id")
    print(f"[Auth] Extracted user_id from token: {user_id}")

    if not user_id:
        print("[Auth] No user_id in token payload")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    print(f"[Auth] User found in database: {user is not None}")

    if not user:
        print(f"[Auth] User with id={user_id} not found in database")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not user.is_active:
        print(f"[Auth] User {user_id} is not active")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    print(f"[Auth] Authentication successful for user {user_id}")
    return user
