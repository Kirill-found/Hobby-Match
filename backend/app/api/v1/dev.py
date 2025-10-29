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
