from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserProfile
from app.schemas.interest import InterestCategoryResponse, UserInterestCreate, UserInterestResponse
from app.schemas.auth import TelegramLogin, Token, TokenData
from app.schemas.swipe import SwipeCreate, SwipeResponse
from app.schemas.match import MatchResponse
from app.schemas.message import MessageCreate, MessageResponse
from app.schemas.meeting import MeetingProposalCreate, MeetingProposalResponse, MeetingRatingCreate

__all__ = [
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserProfile",
    "InterestCategoryResponse",
    "UserInterestCreate",
    "UserInterestResponse",
    "TelegramLogin",
    "Token",
    "TokenData",
    "SwipeCreate",
    "SwipeResponse",
    "MatchResponse",
    "MessageCreate",
    "MessageResponse",
    "MeetingProposalCreate",
    "MeetingProposalResponse",
    "MeetingRatingCreate",
]
