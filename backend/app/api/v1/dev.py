from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from datetime import datetime
import random

router = APIRouter()


@router.post("/seed-users")
def seed_test_users(db: Session = Depends(get_db)):
    """
    Create test users for development/testing
    WARNING: Only use in development!
    """

    test_users_data = [
        {
            "telegram_id": 111111111,
            "username": "anna_test",
            "first_name": "Анна",
            "last_name": "Иванова",
            "age": 24,
            "gender": "female",
            "partner_gender_preference": "any",
            "min_age": 18,
            "max_age": 50,
            "bio": "Люблю активный отдых, играю в волейбол по выходным. Ищу компанию для походов в горы!",
            "city": "Москва",
            "district": "Центральный",
            "photos": ["https://i.pravatar.cc/400?img=1"],
            "onboarding_completed": True,
            "is_active": True,
        },
        {
            "telegram_id": 222222222,
            "username": "dmitriy_test",
            "first_name": "Дмитрий",
            "last_name": "Петров",
            "age": 28,
            "gender": "male",
            "bio": "Программист и любитель настолок. Играем каждую пятницу, всегда рады новым людям!",
            "city": "Москва",
            "district": "Северный",
            "photos": ["https://i.pravatar.cc/400?img=12"],
            "onboarding_completed": True,
            "is_active": True,
        },
        {
            "telegram_id": 333333333,
            "username": "elena_test",
            "first_name": "Елена",
            "last_name": "Сидорова",
            "age": 26,
            "gender": "female",
            "bio": "Йога по утрам, танцы по вечерам. Хочу найти компанию для занятий йогой в парке.",
            "city": "Москва",
            "district": "Южный",
            "photos": ["https://i.pravatar.cc/400?img=5"],
            "onboarding_completed": True,
            "is_active": True,
        },
        {
            "telegram_id": 444444444,
            "username": "maxim_test",
            "first_name": "Максим",
            "last_name": "Смирнов",
            "age": 30,
            "gender": "male",
            "bio": "Футбол - моя страсть! Играем каждую субботу на поле возле метро. Присоединяйся!",
            "city": "Москва",
            "district": "Западный",
            "photos": ["https://i.pravatar.cc/400?img=15"],
            "onboarding_completed": True,
            "is_active": True,
        },
        {
            "telegram_id": 555555555,
            "username": "maria_test",
            "first_name": "Мария",
            "last_name": "Козлова",
            "age": 23,
            "gender": "female",
            "bio": "Изучаю японский язык и люблю аниме. Ищу единомышленников для просмотра и обсуждения.",
            "city": "Москва",
            "district": "Восточный",
            "photos": ["https://i.pravatar.cc/400?img=9"],
            "onboarding_completed": True,
            "is_active": True,
        },
        {
            "telegram_id": 666666666,
            "username": "alex_test",
            "first_name": "Александр",
            "last_name": "Новиков",
            "age": 27,
            "gender": "male",
            "bio": "Фотограф-любитель. Часто хожу на фотопрогулки по городу. Давайте вместе!",
            "city": "Москва",
            "district": "Центральный",
            "photos": ["https://i.pravatar.cc/400?img=13"],
            "onboarding_completed": True,
            "is_active": True,
        },
        {
            "telegram_id": 777777777,
            "username": "olga_test",
            "first_name": "Ольга",
            "last_name": "Морозова",
            "age": 25,
            "gender": "female",
            "bio": "Книголюб и завсегдатай книжных клубов. Люблю обсуждать новинки литературы.",
            "city": "Москва",
            "district": "Северный",
            "photos": ["https://i.pravatar.cc/400?img=10"],
            "onboarding_completed": True,
            "is_active": True,
        },
        {
            "telegram_id": 888888888,
            "username": "sergey_test",
            "first_name": "Сергей",
            "last_name": "Волков",
            "age": 29,
            "gender": "male",
            "bio": "Гитарист в свободное время. Играем в гараже, ищем барабанщика и басиста!",
            "city": "Москва",
            "district": "Южный",
            "photos": ["https://i.pravatar.cc/400?img=14"],
            "onboarding_completed": True,
            "is_active": True,
        },
    ]

    created_users = []

    for user_data in test_users_data:
        # Check if user already exists
        existing_user = db.query(User).filter(
            User.telegram_id == user_data["telegram_id"]
        ).first()

        if existing_user:
            continue

        # Create new user
        user = User(**user_data)
        db.add(user)
        created_users.append(user_data["first_name"])

    db.commit()

    return {
        "success": True,
        "created_count": len(created_users),
        "created_users": created_users,
        "message": f"Created {len(created_users)} test users"
    }


@router.delete("/clear-test-users")
def clear_test_users(db: Session = Depends(get_db)):
    """
    Delete all test users (telegram_id < 1000000000)
    WARNING: Only use in development!
    """

    deleted = db.query(User).filter(User.telegram_id < 1000000000).delete()
    db.commit()

    return {
        "success": True,
        "deleted_count": deleted,
        "message": f"Deleted {deleted} test users"
    }


@router.get("/all-users")
def get_all_users(db: Session = Depends(get_db)):
    """
    Get all users for debugging
    WARNING: Only use in development!
    """
    users = db.query(User).all()

    user_list = []
    for user in users:
        user_list.append({
            "id": user.id,
            "telegram_id": user.telegram_id,
            "first_name": user.first_name,
            "age": user.age,
            "gender": user.gender,
            "partner_gender_preference": user.partner_gender_preference,
            "min_age": user.min_age,
            "max_age": user.max_age,
            "onboarding_completed": user.onboarding_completed,
            "is_active": user.is_active,
        })

    return {
        "total_users": len(users),
        "users": user_list
    }


@router.post("/create-test-match")
def create_test_match(
    user1_id: int,
    user2_id: int,
    db: Session = Depends(get_db)
):
    """
    Create a mutual like between two users for testing matching
    WARNING: Only use in development!
    """
    from app.models.swipe import Swipe
    from app.models.match import Match
    from datetime import datetime

    # Check if users exist
    user1 = db.query(User).filter(User.id == user1_id).first()
    user2 = db.query(User).filter(User.id == user2_id).first()

    if not user1 or not user2:
        return {"error": "One or both users not found"}

    # Create swipe from user1 to user2 (if doesn't exist)
    swipe1 = db.query(Swipe).filter(
        Swipe.user_id == user1_id,
        Swipe.target_user_id == user2_id
    ).first()

    if not swipe1:
        swipe1 = Swipe(
            user_id=user1_id,
            target_user_id=user2_id,
            is_like=True,
            swiped_at=datetime.utcnow()
        )
        db.add(swipe1)

    # Create swipe from user2 to user1 (reverse)
    swipe2 = db.query(Swipe).filter(
        Swipe.user_id == user2_id,
        Swipe.target_user_id == user1_id
    ).first()

    if not swipe2:
        swipe2 = Swipe(
            user_id=user2_id,
            target_user_id=user1_id,
            is_like=True,
            swiped_at=datetime.utcnow()
        )
        db.add(swipe2)

    # Create match (if doesn't exist)
    from sqlalchemy import or_, and_
    existing_match = db.query(Match).filter(
        or_(
            and_(Match.user1_id == user1_id, Match.user2_id == user2_id),
            and_(Match.user1_id == user2_id, Match.user2_id == user1_id)
        )
    ).first()

    if not existing_match:
        match = Match(
            user1_id=user1_id,
            user2_id=user2_id,
            matched_at=datetime.utcnow()
        )
        db.add(match)

    db.commit()

    return {
        "success": True,
        "message": f"Created match between {user1.first_name} and {user2.first_name}",
        "match": {
            "user1": {"id": user1.id, "name": user1.first_name},
            "user2": {"id": user2.id, "name": user2.first_name}
        }
    }


@router.post("/update-user-preferences")
def update_user_preferences(
    telegram_id: int,
    min_age: int = 18,
    max_age: int = 50,
    partner_gender_preference: str = "any",
    db: Session = Depends(get_db)
):
    """
    Update user preferences for testing
    WARNING: Only use in development!
    """
    user = db.query(User).filter(User.telegram_id == telegram_id).first()

    if not user:
        return {"error": "User not found"}

    user.min_age = min_age
    user.max_age = max_age
    user.partner_gender_preference = partner_gender_preference

    db.commit()

    return {
        "success": True,
        "message": f"Updated preferences for {user.first_name}",
        "new_preferences": {
            "min_age": user.min_age,
            "max_age": user.max_age,
            "partner_gender_preference": user.partner_gender_preference
        }
    }
