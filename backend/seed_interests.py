"""
Seed script to populate interest categories
Run: python seed_interests.py
"""
from app.database import SessionLocal
from app.models.interest import InterestCategory


def seed_interests():
    db = SessionLocal()

    # Check if already seeded
    existing = db.query(InterestCategory).first()
    if existing:
        print("Interests already seeded. Skipping...")
        return

    interests_data = [
        # СПОРТ (Level 1)
        {"name": "Спорт", "icon": "⚽", "level": 1, "parent_id": None},
        # Спорт - Level 2
        {"name": "Футбол", "icon": "⚽", "level": 2, "parent_id": 1},
        {"name": "Баскетбол", "icon": "🏀", "level": 2, "parent_id": 1},
        {"name": "Волейбол", "icon": "🏐", "level": 2, "parent_id": 1},
        {"name": "Теннис", "icon": "🎾", "level": 2, "parent_id": 1},
        {"name": "Бег", "icon": "🏃", "level": 2, "parent_id": 1},
        {"name": "Велоспорт", "icon": "🚴", "level": 2, "parent_id": 1},
        {"name": "Плавание", "icon": "🏊", "level": 2, "parent_id": 1},
        {"name": "Йога", "icon": "🧘", "level": 2, "parent_id": 1},
        {"name": "Фитнес", "icon": "💪", "level": 2, "parent_id": 1},
        {"name": "Бокс", "icon": "🥊", "level": 2, "parent_id": 1},
        {"name": "Скейтбординг", "icon": "🛹", "level": 2, "parent_id": 1},

        # ТВОРЧЕСТВО (Level 1)
        {"name": "Творчество", "icon": "🎨", "level": 1, "parent_id": None},
        # Творчество - Level 2
        {"name": "Рисование", "icon": "🎨", "level": 2, "parent_id": 13},
        {"name": "Музыка", "icon": "🎵", "level": 2, "parent_id": 13},
        {"name": "Фотография", "icon": "📸", "level": 2, "parent_id": 13},
        {"name": "Танцы", "icon": "💃", "level": 2, "parent_id": 13},
        {"name": "Пение", "icon": "🎤", "level": 2, "parent_id": 13},
        {"name": "Театр", "icon": "🎭", "level": 2, "parent_id": 13},
        {"name": "Кино", "icon": "🎬", "level": 2, "parent_id": 13},
        {"name": "Литература", "icon": "📚", "level": 2, "parent_id": 13},

        # ИГРЫ (Level 1)
        {"name": "Игры", "icon": "🎮", "level": 1, "parent_id": None},
        # Игры - Level 2
        {"name": "Видеоигры", "icon": "🎮", "level": 2, "parent_id": 22},
        {"name": "Настольные игры", "icon": "🎲", "level": 2, "parent_id": 22},
        {"name": "Шахматы", "icon": "♟️", "level": 2, "parent_id": 22},
        {"name": "Покер", "icon": "🃏", "level": 2, "parent_id": 22},

        # АКТИВНЫЙ ОТДЫХ (Level 1)
        {"name": "Активный отдых", "icon": "🏕️", "level": 1, "parent_id": None},
        # Активный отдых - Level 2
        {"name": "Походы", "icon": "🥾", "level": 2, "parent_id": 27},
        {"name": "Кемпинг", "icon": "⛺", "level": 2, "parent_id": 27},
        {"name": "Рыбалка", "icon": "🎣", "level": 2, "parent_id": 27},
        {"name": "Скалолазание", "icon": "🧗", "level": 2, "parent_id": 27},

        # ОБРАЗОВАНИЕ (Level 1)
        {"name": "Образование", "icon": "📖", "level": 1, "parent_id": None},
        # Образование - Level 2
        {"name": "Языки", "icon": "🗣️", "level": 2, "parent_id": 32},
        {"name": "Программирование", "icon": "💻", "level": 2, "parent_id": 32},
        {"name": "Наука", "icon": "🔬", "level": 2, "parent_id": 32},
        {"name": "История", "icon": "📜", "level": 2, "parent_id": 32},

        # КУЛИНАРИЯ (Level 1)
        {"name": "Кулинария", "icon": "🍳", "level": 1, "parent_id": None},
        # Кулинария - Level 2
        {"name": "Готовка", "icon": "👨‍🍳", "level": 2, "parent_id": 37},
        {"name": "Выпечка", "icon": "🧁", "level": 2, "parent_id": 37},
        {"name": "Гриль", "icon": "🔥", "level": 2, "parent_id": 37},

        # ПУТЕШЕСТВИЯ (Level 1)
        {"name": "Путешествия", "icon": "✈️", "level": 1, "parent_id": None},
        # Путешествия - Level 2
        {"name": "Бэкпэкинг", "icon": "🎒", "level": 2, "parent_id": 41},
        {"name": "Экскурсии", "icon": "🗺️", "level": 2, "parent_id": 41},

        # ЖИВОТНЫЕ (Level 1)
        {"name": "Животные", "icon": "🐾", "level": 1, "parent_id": None},
        # Животные - Level 2
        {"name": "Собаки", "icon": "🐕", "level": 2, "parent_id": 44},
        {"name": "Кошки", "icon": "🐈", "level": 2, "parent_id": 44},

        # ДРУГОЕ (Level 1)
        {"name": "Другое", "icon": "✨", "level": 1, "parent_id": None},
        # Другое - Level 2
        {"name": "Волонтерство", "icon": "🤝", "level": 2, "parent_id": 47},
        {"name": "Медитация", "icon": "🧘‍♀️", "level": 2, "parent_id": 47},
        {"name": "Астрология", "icon": "⭐", "level": 2, "parent_id": 47},
    ]

    try:
        for interest_data in interests_data:
            interest = InterestCategory(**interest_data)
            db.add(interest)

        db.commit()
        print(f"✅ Successfully seeded {len(interests_data)} interests!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding interests: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_interests()
