from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base
from starlette.middleware.base import BaseHTTPMiddleware
from pathlib import Path

# Import all models to ensure they are registered with Base
from app.models import user, interest, swipe, match, message, meeting, payment, report

# Don't create tables on startup - they should be created via migrations or /create-tables endpoint
# This prevents crashes when using SQLite locally (ARRAY type not supported)
# Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="HobbyMatch API",
    description="API for HobbyMatch - Telegram Mini App for finding hobby partners",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# Custom CORS middleware that adds headers manually
class CustomCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Handle preflight OPTIONS requests
        if request.method == "OPTIONS":
            response = Response()
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "*"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Max-Age"] = "3600"
            return response

        # Process the request
        response = await call_next(request)

        # Add CORS headers to response
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"

        return response


# Add custom CORS middleware
app.add_middleware(CustomCORSMiddleware)

# Mount static files directory for uploaded photos
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "HobbyMatch API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/debug/uploads")
def debug_uploads():
    """Debug endpoint to check uploads directory"""
    import os
    uploads_exists = os.path.exists("uploads")
    uploads_photos_exists = os.path.exists("uploads/photos")

    files = []
    if uploads_photos_exists:
        files = os.listdir("uploads/photos")

    return {
        "uploads_exists": uploads_exists,
        "uploads_photos_exists": uploads_photos_exists,
        "files_count": len(files),
        "files": files[:10],  # First 10 files
        "staticfiles_mounted": True,
        "cwd": os.getcwd()
    }


@app.get("/debug/cors")
def debug_cors():
    """Debug endpoint to check CORS configuration"""
    return {
        "cors_enabled": True,
        "allow_origins": "*",
        "allow_credentials": False,
        "version": "v2_cors_wildcard",
        "message": "CORS should allow all origins with this version"
    }


@app.get("/create-tables")
def create_tables():
    """
    Manually create all database tables
    TODO: Remove this endpoint after initial setup
    """
    try:
        Base.metadata.create_all(bind=engine)
        return {"message": "Tables created successfully"}
    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}


@app.get("/migrate-swipes")
def migrate_swipes():
    """
    Migrate swipes table from direction to is_like + swiped_at
    """
    from sqlalchemy import text
    from app.database import SessionLocal
    import traceback

    db = SessionLocal()

    try:
        # Check if direction column exists
        result = db.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name='swipes' AND column_name='direction'
        """))

        has_direction = result.fetchone() is not None

        if has_direction:
            # Add new columns
            db.execute(text("ALTER TABLE swipes ADD COLUMN IF NOT EXISTS is_like BOOLEAN"))
            db.execute(text("ALTER TABLE swipes ADD COLUMN IF NOT EXISTS swiped_at TIMESTAMP"))

            # Migrate data: "right" -> is_like=true, "left" -> is_like=false
            db.execute(text("""
                UPDATE swipes
                SET is_like = CASE WHEN direction = 'right' THEN true ELSE false END,
                    swiped_at = created_at
                WHERE is_like IS NULL
            """))

            # Drop old column
            db.execute(text("ALTER TABLE swipes DROP COLUMN IF EXISTS direction"))

            db.commit()
            return {"message": "Swipes table migrated successfully"}
        else:
            return {"message": "Migration already applied or table structure is correct"}

    except Exception as e:
        db.rollback()
        return {"error": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()


@app.get("/migrate-matches")
def migrate_matches():
    """
    Add matched_at column to matches table
    """
    from sqlalchemy import text
    from app.database import SessionLocal
    import traceback

    db = SessionLocal()

    try:
        # Check if matched_at column exists
        result = db.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name='matches' AND column_name='matched_at'
        """))

        has_matched_at = result.fetchone() is not None

        if not has_matched_at:
            # Add matched_at column
            db.execute(text("ALTER TABLE matches ADD COLUMN matched_at TIMESTAMP"))

            # Set matched_at to created_at for existing matches
            db.execute(text("""
                UPDATE matches
                SET matched_at = created_at
                WHERE matched_at IS NULL
            """))

            db.commit()
            return {"message": "Matches table migrated successfully"}
        else:
            return {"message": "Migration already applied or table structure is correct"}

    except Exception as e:
        db.rollback()
        return {"error": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()


@app.get("/reset-onboarding")
def reset_onboarding():
    """
    Reset all users' onboarding status for testing
    TODO: Remove this endpoint in production
    """
    from app.database import SessionLocal
    from app.models.user import User
    import traceback

    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            user.onboarding_completed = False
        db.commit()
        return {"message": f"Reset onboarding for {len(users)} users"}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()


@app.get("/migrate-add-requires-skill-level")
def migrate_add_requires_skill_level():
    """
    Add requires_skill_level column to interest_categories table
    One-time migration endpoint
    """
    from app.database import SessionLocal
    import traceback

    db = SessionLocal()
    try:
        # Check if column already exists
        check_sql = """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name='interest_categories'
        AND column_name='requires_skill_level';
        """
        result = db.execute(check_sql).fetchone()

        if result:
            return {"message": "Column 'requires_skill_level' already exists"}

        # Add the column
        alter_sql = """
        ALTER TABLE interest_categories
        ADD COLUMN requires_skill_level BOOLEAN NOT NULL DEFAULT TRUE;
        """
        db.execute(alter_sql)
        db.commit()

        return {"message": "Successfully added 'requires_skill_level' column to interest_categories"}
    except Exception as e:
        db.rollback()
        return {"error": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()


@app.get("/reset-interests")
def reset_interests_endpoint():
    """
    Reset and reseed interests into database
    WARNING: This will delete all existing interests and user interests!
    """
    from app.database import SessionLocal
    from app.models.interest import InterestCategory, UserInterest
    import traceback

    db = SessionLocal()

    try:
        # Delete all user interests first
        db.query(UserInterest).delete()
        # Delete all interest categories
        db.query(InterestCategory).delete()
        db.commit()

        # Now seed new interests
        return seed_interests_internal(db)
    except Exception as e:
        db.rollback()
        return {"error": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()


@app.get("/seed/interests")
def seed_interests_endpoint():
    """
    Seed interests into database (run once)
    TODO: Remove this endpoint after seeding or add authentication
    """
    from app.database import SessionLocal
    from app.models.interest import InterestCategory
    import traceback

    db = SessionLocal()

    try:
        # Check if already seeded
        existing = db.query(InterestCategory).first()
        if existing:
            return {"message": "Interests already seeded", "count": db.query(InterestCategory).count()}

        return seed_interests_internal(db)
    except Exception as e:
        return {"error": "Failed to query database", "details": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()


def seed_interests_internal(db):
    """Internal function to seed interests"""
    from app.models.interest import InterestCategory
    import traceback

    # Using parent_name for easier management, will be resolved to parent_id
    interests_data = [
        # LEVEL 1 CATEGORIES
        {"name": "Спорт", "icon": "⚽", "level": 1, "parent_name": None},  # Skill level makes sense
        {"name": "Творчество", "icon": "🎨", "level": 1, "parent_name": None},  # Skill level makes sense
        {"name": "Игры", "icon": "🎮", "level": 1, "parent_name": None},  # Skill level makes sense
        {"name": "Активный отдых", "icon": "🏕️", "level": 1, "parent_name": None},  # Mixed - some need skills, some don't
        {"name": "Образование", "icon": "📖", "level": 1, "parent_name": None},  # Mixed
        {"name": "Кулинария", "icon": "🍳", "level": 1, "parent_name": None},  # Skill level makes sense
        {"name": "Путешествия", "icon": "✈️", "level": 1, "parent_name": None, "requires_skill_level": False},  # Just interest
        {"name": "Животные", "icon": "🐾", "level": 1, "parent_name": None, "requires_skill_level": False},  # Just interest
        {"name": "Технологии", "icon": "💻", "level": 1, "parent_name": None},  # Skill level makes sense
        {"name": "Психология", "icon": "🧠", "level": 1, "parent_name": None, "requires_skill_level": False},  # Just interest
        {"name": "Рукоделие", "icon": "🧵", "level": 1, "parent_name": None},  # Skill level makes sense
        {"name": "Автомобили", "icon": "🚗", "level": 1, "parent_name": None},  # Skill level makes sense
        {"name": "Другое", "icon": "✨", "level": 1, "parent_name": None, "requires_skill_level": False},  # Just interest

        # СПОРТ - LEVEL 2
        {"name": "Командные виды", "icon": "👥", "level": 2, "parent_name": "Спорт"},
        {"name": "Единоборства", "icon": "🥋", "level": 2, "parent_name": "Спорт"},
        {"name": "Ракетные виды", "icon": "🎾", "level": 2, "parent_name": "Спорт"},
        {"name": "Циклические виды", "icon": "🏃", "level": 2, "parent_name": "Спорт"},
        {"name": "Силовые виды", "icon": "💪", "level": 2, "parent_name": "Спорт"},
        {"name": "Водные виды", "icon": "🏊", "level": 2, "parent_name": "Спорт"},
        {"name": "Зимние виды", "icon": "⛷️", "level": 2, "parent_name": "Спорт"},
        {"name": "Экстремальные виды", "icon": "🪂", "level": 2, "parent_name": "Спорт"},
        {"name": "Интеллектуальные", "icon": "♟️", "level": 2, "parent_name": "Спорт"},
        {"name": "Танцевальные", "icon": "💃", "level": 2, "parent_name": "Спорт"},

        # Командные виды - Level 3
        {"name": "Футбол", "icon": "⚽", "level": 3, "parent_name": "Командные виды"},
        {"name": "Баскетбол", "icon": "🏀", "level": 3, "parent_name": "Командные виды"},
        {"name": "Волейбол", "icon": "🏐", "level": 3, "parent_name": "Командные виды"},
        {"name": "Хоккей", "icon": "🏒", "level": 3, "parent_name": "Командные виды"},
        {"name": "Регби", "icon": "🏉", "level": 3, "parent_name": "Командные виды"},
        {"name": "Гандбол", "icon": "🤾", "level": 3, "parent_name": "Командные виды"},

        # Единоборства - Level 3
        {"name": "Бокс", "icon": "🥊", "level": 3, "parent_name": "Единоборства"},
        {"name": "MMA", "icon": "🥋", "level": 3, "parent_name": "Единоборства"},
        {"name": "Кикбоксинг", "icon": "🥊", "level": 3, "parent_name": "Единоборства"},
        {"name": "Джиу-джитсу", "icon": "🥋", "level": 3, "parent_name": "Единоборства"},
        {"name": "Карате", "icon": "🥋", "level": 3, "parent_name": "Единоборства"},
        {"name": "Тхэквондо", "icon": "🥋", "level": 3, "parent_name": "Единоборства"},
        {"name": "Борьба", "icon": "🤼", "level": 3, "parent_name": "Единоборства"},
        {"name": "Муай тай", "icon": "🥊", "level": 3, "parent_name": "Единоборства"},

        # Ракетные виды - Level 3
        {"name": "Теннис", "icon": "🎾", "level": 3, "parent_name": "Ракетные виды"},
        {"name": "Падел", "icon": "🎾", "level": 3, "parent_name": "Ракетные виды"},
        {"name": "Настольный теннис", "icon": "🏓", "level": 3, "parent_name": "Ракетные виды"},
        {"name": "Бадминтон", "icon": "🏸", "level": 3, "parent_name": "Ракетные виды"},
        {"name": "Сквош", "icon": "🎾", "level": 3, "parent_name": "Ракетные виды"},

        # Циклические виды - Level 3
        {"name": "Бег", "icon": "🏃", "level": 3, "parent_name": "Циклические виды"},
        {"name": "Велоспорт", "icon": "🚴", "level": 3, "parent_name": "Циклические виды"},
        {"name": "Триатлон", "icon": "🏊", "level": 3, "parent_name": "Циклические виды"},
        {"name": "Марафон", "icon": "🏃", "level": 3, "parent_name": "Циклические виды"},
        {"name": "Роликовые коньки", "icon": "⛸️", "level": 3, "parent_name": "Циклические виды"},

        # Силовые виды - Level 3
        {"name": "Фитнес", "icon": "💪", "level": 3, "parent_name": "Силовые виды"},
        {"name": "Кроссфит", "icon": "🏋️", "level": 3, "parent_name": "Силовые виды"},
        {"name": "Пауэрлифтинг", "icon": "🏋️", "level": 3, "parent_name": "Силовые виды"},
        {"name": "Бодибилдинг", "icon": "💪", "level": 3, "parent_name": "Силовые виды"},
        {"name": "Гиревой спорт", "icon": "🏋️", "level": 3, "parent_name": "Силовые виды"},
        {"name": "Стрит воркаут", "icon": "💪", "level": 3, "parent_name": "Силовые виды"},
        {"name": "Йога", "icon": "🧘", "level": 3, "parent_name": "Силовые виды"},
        {"name": "Пилатес", "icon": "🧘", "level": 3, "parent_name": "Силовые виды"},

        # Водные виды - Level 3
        {"name": "Плавание", "icon": "🏊", "level": 3, "parent_name": "Водные виды"},
        {"name": "Дайвинг", "icon": "🤿", "level": 3, "parent_name": "Водные виды"},
        {"name": "Серфинг", "icon": "🏄", "level": 3, "parent_name": "Водные виды"},
        {"name": "Виндсерфинг", "icon": "🏄", "level": 3, "parent_name": "Водные виды"},
        {"name": "Кайтсерфинг", "icon": "🪁", "level": 3, "parent_name": "Водные виды"},
        {"name": "Вейкбординг", "icon": "🏄", "level": 3, "parent_name": "Водные виды"},
        {"name": "Гребля", "icon": "🚣", "level": 3, "parent_name": "Водные виды"},
        {"name": "Парусный спорт", "icon": "⛵", "level": 3, "parent_name": "Водные виды"},

        # Зимние виды - Level 3
        {"name": "Лыжи", "icon": "⛷️", "level": 3, "parent_name": "Зимние виды"},
        {"name": "Сноуборд", "icon": "🏂", "level": 3, "parent_name": "Зимние виды"},
        {"name": "Фигурное катание", "icon": "⛸️", "level": 3, "parent_name": "Зимние виды"},
        {"name": "Коньки", "icon": "⛸️", "level": 3, "parent_name": "Зимние виды"},

        # Экстремальные виды - Level 3
        {"name": "Скейтбординг", "icon": "🛹", "level": 3, "parent_name": "Экстремальные виды"},
        {"name": "BMX", "icon": "🚴", "level": 3, "parent_name": "Экстремальные виды"},
        {"name": "Паркур", "icon": "🤸", "level": 3, "parent_name": "Экстремальные виды"},
        {"name": "Скалолазание", "icon": "🧗", "level": 3, "parent_name": "Экстремальные виды"},
        {"name": "Боулдеринг", "icon": "🧗", "level": 3, "parent_name": "Экстремальные виды"},
        {"name": "Парашютный спорт", "icon": "🪂", "level": 3, "parent_name": "Экстремальные виды"},
        {"name": "Бейсджампинг", "icon": "🪂", "level": 3, "parent_name": "Экстремальные виды"},

        # Интеллектуальные - Level 3
        {"name": "Шахматы", "icon": "♟️", "level": 3, "parent_name": "Интеллектуальные"},
        {"name": "Го", "icon": "⚫", "level": 3, "parent_name": "Интеллектуальные"},
        {"name": "Покер", "icon": "🃏", "level": 3, "parent_name": "Интеллектуальные"},
        {"name": "Бридж", "icon": "🃏", "level": 3, "parent_name": "Интеллектуальные"},

        # Танцевальные - Level 3
        {"name": "Бальные танцы", "icon": "💃", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Латина", "icon": "💃", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Сальса", "icon": "💃", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Бачата", "icon": "💃", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Кизомба", "icon": "💃", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Хип-хоп", "icon": "🕺", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Брейк-данс", "icon": "🕺", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Контемп", "icon": "💃", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Хай хилс", "icon": "👠", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Тверк", "icon": "💃", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Стрип-пластика", "icon": "💃", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Танго", "icon": "💃", "level": 3, "parent_name": "Танцевальные"},
        {"name": "Свинг", "icon": "🕺", "level": 3, "parent_name": "Танцевальные"},

        # ТВОРЧЕСТВО - LEVEL 2
        {"name": "Изобразительное", "icon": "🎨", "level": 2, "parent_name": "Творчество"},
        {"name": "Музыка", "icon": "🎵", "level": 2, "parent_name": "Творчество"},
        {"name": "Фото и видео", "icon": "📸", "level": 2, "parent_name": "Творчество"},
        {"name": "Театр и кино", "icon": "🎭", "level": 2, "parent_name": "Творчество"},
        {"name": "Литература", "icon": "📚", "level": 2, "parent_name": "Творчество"},
        {"name": "Прикладное", "icon": "🎨", "level": 2, "parent_name": "Творчество"},

        # Изобразительное - Level 3
        {"name": "Рисование", "icon": "✏️", "level": 3, "parent_name": "Изобразительное"},
        {"name": "Живопись", "icon": "🖌️", "level": 3, "parent_name": "Изобразительное"},
        {"name": "Графика", "icon": "✍️", "level": 3, "parent_name": "Изобразительное"},
        {"name": "Скульптура", "icon": "🗿", "level": 3, "parent_name": "Изобразительное"},
        {"name": "Керамика", "icon": "🏺", "level": 3, "parent_name": "Изобразительное"},
        {"name": "Граффити", "icon": "🎨", "level": 3, "parent_name": "Изобразительное"},
        {"name": "Аэрография", "icon": "🎨", "level": 3, "parent_name": "Изобразительное"},
        {"name": "Каллиграфия", "icon": "🖋️", "level": 3, "parent_name": "Изобразительное"},

        # Музыка - Level 3
        {"name": "Гитара", "icon": "🎸", "level": 3, "parent_name": "Музыка"},
        {"name": "Фортепиано", "icon": "🎹", "level": 3, "parent_name": "Музыка"},
        {"name": "Барабаны", "icon": "🥁", "level": 3, "parent_name": "Музыка"},
        {"name": "Вокал", "icon": "🎤", "level": 3, "parent_name": "Музыка"},
        {"name": "Скрипка", "icon": "🎻", "level": 3, "parent_name": "Музыка"},
        {"name": "Саксофон", "icon": "🎷", "level": 3, "parent_name": "Музыка"},
        {"name": "DJ", "icon": "🎧", "level": 3, "parent_name": "Музыка"},
        {"name": "Битмейкинг", "icon": "🎛️", "level": 3, "parent_name": "Музыка"},
        {"name": "Рэп", "icon": "🎤", "level": 3, "parent_name": "Музыка"},

        # Фото и видео - Level 3
        {"name": "Фотография", "icon": "📷", "level": 3, "parent_name": "Фото и видео"},
        {"name": "Видеосъемка", "icon": "🎥", "level": 3, "parent_name": "Фото и видео"},
        {"name": "Видеомонтаж", "icon": "🎬", "level": 3, "parent_name": "Фото и видео"},
        {"name": "Анимация", "icon": "🎞️", "level": 3, "parent_name": "Фото и видео"},
        {"name": "Моушн-дизайн", "icon": "🎬", "level": 3, "parent_name": "Фото и видео"},

        # Театр и кино - Level 3
        {"name": "Актерское мастерство", "icon": "🎭", "level": 3, "parent_name": "Театр и кино"},
        {"name": "Режиссура", "icon": "🎬", "level": 3, "parent_name": "Театр и кино"},
        {"name": "Сценаристика", "icon": "✍️", "level": 3, "parent_name": "Театр и кино"},
        {"name": "Стендап", "icon": "🎤", "level": 3, "parent_name": "Театр и кино"},
        {"name": "Импровизация", "icon": "🎭", "level": 3, "parent_name": "Театр и кино"},

        # Литература - Level 3
        {"name": "Писательство", "icon": "✍️", "level": 3, "parent_name": "Литература"},  # Skill level makes sense
        {"name": "Поэзия", "icon": "📝", "level": 3, "parent_name": "Литература"},  # Skill level makes sense
        {"name": "Блогинг", "icon": "💬", "level": 3, "parent_name": "Литература"},  # Skill level makes sense
        {"name": "Книжные клубы", "icon": "📚", "level": 3, "parent_name": "Литература", "requires_skill_level": False},  # Just interest

        # Прикладное - Level 3
        {"name": "Дизайн интерьера", "icon": "🏠", "level": 3, "parent_name": "Прикладное"},
        {"name": "Графический дизайн", "icon": "🎨", "level": 3, "parent_name": "Прикладное"},
        {"name": "Веб-дизайн", "icon": "💻", "level": 3, "parent_name": "Прикладное"},
        {"name": "UX/UI дизайн", "icon": "📱", "level": 3, "parent_name": "Прикладное"},
        {"name": "3D моделирование", "icon": "🎨", "level": 3, "parent_name": "Прикладное"},

        # ИГРЫ - LEVEL 2
        {"name": "Видеоигры", "icon": "🎮", "level": 2, "parent_name": "Игры"},
        {"name": "Настольные игры", "icon": "🎲", "level": 2, "parent_name": "Игры"},
        {"name": "Карточные игры", "icon": "🃏", "level": 2, "parent_name": "Игры"},

        # Видеоигры - Level 3
        {"name": "Шутеры", "icon": "🎮", "level": 3, "parent_name": "Видеоигры"},
        {"name": "MOBA", "icon": "🎮", "level": 3, "parent_name": "Видеоигры"},
        {"name": "RPG", "icon": "⚔️", "level": 3, "parent_name": "Видеоигры"},
        {"name": "Стратегии", "icon": "🎮", "level": 3, "parent_name": "Видеоигры"},
        {"name": "Спортивные симуляторы", "icon": "⚽", "level": 3, "parent_name": "Видеоигры"},
        {"name": "Гонки", "icon": "🏎️", "level": 3, "parent_name": "Видеоигры"},
        {"name": "Киберспорт", "icon": "🎮", "level": 3, "parent_name": "Видеоигры"},

        # Настольные игры - Level 3
        {"name": "Настолки", "icon": "🎲", "level": 3, "parent_name": "Настольные игры"},
        {"name": "Ролевые игры", "icon": "🎲", "level": 3, "parent_name": "Настольные игры"},
        {"name": "Варгеймы", "icon": "♟️", "level": 3, "parent_name": "Настольные игры"},

        # АКТИВНЫЙ ОТДЫХ - LEVEL 2
        {"name": "Туризм", "icon": "🥾", "level": 2, "parent_name": "Активный отдых", "requires_skill_level": False},  # Just interest
        {"name": "Охота и рыбалка", "icon": "🎣", "level": 2, "parent_name": "Активный отдых", "requires_skill_level": False},  # Just interest

        # Туризм - Level 3
        {"name": "Пешие походы", "icon": "🥾", "level": 3, "parent_name": "Туризм", "requires_skill_level": False},
        {"name": "Кемпинг", "icon": "⛺", "level": 3, "parent_name": "Туризм", "requires_skill_level": False},
        {"name": "Горный туризм", "icon": "⛰️", "level": 3, "parent_name": "Туризм", "requires_skill_level": False},
        {"name": "Велотуризм", "icon": "🚴", "level": 3, "parent_name": "Туризм", "requires_skill_level": False},

        # Охота и рыбалка - Level 3
        {"name": "Рыбалка", "icon": "🎣", "level": 3, "parent_name": "Охота и рыбалка", "requires_skill_level": False},
        {"name": "Спиннинг", "icon": "🎣", "level": 3, "parent_name": "Охота и рыбалка", "requires_skill_level": False},
        {"name": "Нахлыст", "icon": "🎣", "level": 3, "parent_name": "Охота и рыбалка", "requires_skill_level": False},

        # ОБРАЗОВАНИЕ - LEVEL 2
        {"name": "Языки", "icon": "🗣️", "level": 2, "parent_name": "Образование"},  # Skill level makes sense (A1-C2)
        {"name": "Наука", "icon": "🔬", "level": 2, "parent_name": "Образование", "requires_skill_level": False},  # Just interest
        {"name": "История и культура", "icon": "📜", "level": 2, "parent_name": "Образование", "requires_skill_level": False},  # Just interest

        # Наука - Level 3
        {"name": "Точные науки", "icon": "🔢", "level": 3, "parent_name": "Наука", "requires_skill_level": False},
        {"name": "Естественные науки", "icon": "🧪", "level": 3, "parent_name": "Наука", "requires_skill_level": False},
        {"name": "Астрономия", "icon": "🔭", "level": 3, "parent_name": "Наука", "requires_skill_level": False},

        # Точные науки - Level 4
        {"name": "Математика", "icon": "🔢", "level": 4, "parent_name": "Точные науки", "requires_skill_level": False},
        {"name": "Физика", "icon": "⚛️", "level": 4, "parent_name": "Точные науки", "requires_skill_level": False},
        {"name": "Программирование", "icon": "💻", "level": 4, "parent_name": "Точные науки", "requires_skill_level": False},

        # Естественные науки - Level 4
        {"name": "Химия", "icon": "🧪", "level": 4, "parent_name": "Естественные науки", "requires_skill_level": False},
        {"name": "Биология", "icon": "🧬", "level": 4, "parent_name": "Естественные науки", "requires_skill_level": False},
        {"name": "Экология", "icon": "🌱", "level": 4, "parent_name": "Естественные науки", "requires_skill_level": False},

        # КУЛИНАРИЯ - LEVEL 2
        {"name": "Готовка", "icon": "👨‍🍳", "level": 2, "parent_name": "Кулинария"},  # Skill level makes sense
        {"name": "Выпечка", "icon": "🧁", "level": 2, "parent_name": "Кулинария"},  # Skill level makes sense
        {"name": "Барбекю", "icon": "🔥", "level": 2, "parent_name": "Кулинария"},  # Skill level makes sense
        {"name": "Кондитерское дело", "icon": "🍰", "level": 2, "parent_name": "Кулинария"},  # Skill level makes sense
        {"name": "Кофе и чай", "icon": "☕", "level": 2, "parent_name": "Кулинария", "requires_skill_level": False},  # Just interest
        {"name": "Вино и сомелье", "icon": "🍷", "level": 2, "parent_name": "Кулинария"},  # Skill level makes sense (sommelier levels)
        {"name": "Миксология", "icon": "🍸", "level": 2, "parent_name": "Кулинария"},  # Skill level makes sense

        # ПУТЕШЕСТВИЯ - LEVEL 2
        {"name": "Бэкпэкинг", "icon": "🎒", "level": 2, "parent_name": "Путешествия", "requires_skill_level": False},  # Just interest
        {"name": "Экскурсии", "icon": "🗺️", "level": 2, "parent_name": "Путешествия", "requires_skill_level": False},  # Just interest
        {"name": "Автопутешествия", "icon": "🚗", "level": 2, "parent_name": "Путешествия", "requires_skill_level": False},  # Just interest
        {"name": "Круизы", "icon": "🚢", "level": 2, "parent_name": "Путешествия", "requires_skill_level": False},  # Just interest

        # ЖИВОТНЫЕ - LEVEL 2
        {"name": "Собаки", "icon": "🐕", "level": 2, "parent_name": "Животные", "requires_skill_level": False},  # Just interest
        {"name": "Кошки", "icon": "🐈", "level": 2, "parent_name": "Животные", "requires_skill_level": False},  # Just interest
        {"name": "Аквариумистика", "icon": "🐠", "level": 2, "parent_name": "Животные", "requires_skill_level": False},  # Just interest
        {"name": "Птицы", "icon": "🦜", "level": 2, "parent_name": "Животные", "requires_skill_level": False},  # Just interest
        {"name": "Лошади", "icon": "🐴", "level": 2, "parent_name": "Животные", "requires_skill_level": False},  # Just interest
        {"name": "Экзотические животные", "icon": "🦎", "level": 2, "parent_name": "Животные", "requires_skill_level": False},  # Just interest

        # ТЕХНОЛОГИИ - LEVEL 2
        {"name": "Программирование", "icon": "💻", "level": 2, "parent_name": "Технологии"},
        {"name": "Робототехника", "icon": "🤖", "level": 2, "parent_name": "Технологии"},
        {"name": "3D печать", "icon": "🖨️", "level": 2, "parent_name": "Технологии"},
        {"name": "Электроника", "icon": "⚡", "level": 2, "parent_name": "Технологии"},
        {"name": "Дроны", "icon": "🚁", "level": 2, "parent_name": "Технологии"},
        {"name": "VR/AR", "icon": "🥽", "level": 2, "parent_name": "Технологии"},

        # ПСИХОЛОГИЯ - LEVEL 2
        {"name": "Саморазвитие", "icon": "📈", "level": 2, "parent_name": "Психология", "requires_skill_level": False},  # Just interest
        {"name": "Медитация", "icon": "🧘‍♀️", "level": 2, "parent_name": "Психология", "requires_skill_level": False},  # Just interest
        {"name": "Коучинг", "icon": "💬", "level": 2, "parent_name": "Психология", "requires_skill_level": False},  # Just interest
        {"name": "Нейронауки", "icon": "🧠", "level": 2, "parent_name": "Психология", "requires_skill_level": False},  # Just interest

        # РУКОДЕЛИЕ - LEVEL 2
        {"name": "Вязание", "icon": "🧶", "level": 2, "parent_name": "Рукоделие"},
        {"name": "Шитье", "icon": "🪡", "level": 2, "parent_name": "Рукоделие"},
        {"name": "Вышивка", "icon": "🧵", "level": 2, "parent_name": "Рукоделие"},
        {"name": "Макраме", "icon": "🧵", "level": 2, "parent_name": "Рукоделие"},
        {"name": "Мыловарение", "icon": "🧼", "level": 2, "parent_name": "Рукоделие"},
        {"name": "Свечи", "icon": "🕯️", "level": 2, "parent_name": "Рукоделие"},
        {"name": "Скрапбукинг", "icon": "📔", "level": 2, "parent_name": "Рукоделие"},

        # АВТОМОБИЛИ - LEVEL 2
        {"name": "Автотюнинг", "icon": "🔧", "level": 2, "parent_name": "Автомобили"},
        {"name": "Мотоциклы", "icon": "🏍️", "level": 2, "parent_name": "Автомобили"},
        {"name": "Картинг", "icon": "🏎️", "level": 2, "parent_name": "Автомобили"},
        {"name": "Дрифт", "icon": "🚗", "level": 2, "parent_name": "Автомобили"},

        # ДРУГОЕ - LEVEL 2
        {"name": "Волонтерство", "icon": "🤝", "level": 2, "parent_name": "Другое", "requires_skill_level": False},  # Just interest
        {"name": "Астрология", "icon": "⭐", "level": 2, "parent_name": "Другое", "requires_skill_level": False},  # Just interest
        {"name": "Коллекционирование", "icon": "🎁", "level": 2, "parent_name": "Другое", "requires_skill_level": False},  # Just interest
        {"name": "Садоводство", "icon": "🌱", "level": 2, "parent_name": "Другое", "requires_skill_level": False},  # Just interest
        {"name": "Цветоводство", "icon": "🌸", "level": 2, "parent_name": "Другое", "requires_skill_level": False},  # Just interest
    ]

    try:
        # Create categories by level to handle parent references
        category_map = {}  # name -> category object

        for level_num in range(1, 5):
            level_categories = [cat for cat in interests_data if cat["level"] == level_num]

            for cat_data in level_categories:
                parent_id = None
                if cat_data.get("parent_name"):
                    parent_cat = category_map.get(cat_data["parent_name"])
                    if parent_cat:
                        parent_id = parent_cat.id

                category = InterestCategory(
                    name=cat_data["name"],
                    icon=cat_data["icon"],
                    level=cat_data["level"],
                    parent_id=parent_id,
                    requires_skill_level=cat_data.get("requires_skill_level", True)  # Default True
                )
                db.add(category)
                db.flush()  # Get ID immediately
                category_map[cat_data["name"]] = category

        db.commit()
        return {"message": "Successfully seeded interests", "count": len(category_map)}

    except Exception as e:
        db.rollback()
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()


@app.get("/migrate-messages")
def migrate_messages():
    """
    Migrate messages table to add receiver_id and read_at columns
    """
    from sqlalchemy import text
    from app.database import SessionLocal
    import traceback

    db = SessionLocal()

    try:
        # Add receiver_id column
        db.execute(text("""
            ALTER TABLE messages
            ADD COLUMN IF NOT EXISTS receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE
        """))

        # Add read_at column
        db.execute(text("""
            ALTER TABLE messages
            ADD COLUMN IF NOT EXISTS read_at TIMESTAMP
        """))

        # Create indexes
        db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_messages_receiver_id ON messages(receiver_id)
        """))

        db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_messages_match_id ON messages(match_id)
        """))

        db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_messages_sender_id ON messages(sender_id)
        """))

        db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_messages_is_read ON messages(is_read)
        """))

        db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_messages_created_at ON messages(created_at)
        """))

        db.commit()

        return {
            "success": True,
            "message": "Messages table migrated successfully"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()


# Import and include routers
from app.api.v1 import auth, users, interests, discovery, dev, matches, likes, chat

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(interests.router, prefix="/api/v1/interests", tags=["interests"])
app.include_router(discovery.router, prefix="/api/v1/discovery", tags=["discovery"])
app.include_router(matches.router, prefix="/api/v1/matches", tags=["matches"])
app.include_router(likes.router, prefix="/api/v1/likes", tags=["likes"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(dev.router, prefix="/api/v1/dev", tags=["development"])

# TODO: Add more routers as they are created
# app.include_router(messages.router, prefix="/api/v1/messages", tags=["messages"])
# app.include_router(meetings.router, prefix="/api/v1/meetings", tags=["meetings"])
# app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
# app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
