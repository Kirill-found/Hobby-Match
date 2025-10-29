from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from starlette.middleware.base import BaseHTTPMiddleware

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
    except Exception as e:
        return {"error": "Failed to query database", "details": str(e), "traceback": traceback.format_exc()}

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
        count = 0
        for interest_data in interests_data:
            interest = InterestCategory(**interest_data)
            db.add(interest)
            db.flush()  # Flush to get IDs for parent references
            count += 1

        db.commit()
        return {"message": "Successfully seeded interests", "count": count}

    except Exception as e:
        db.rollback()
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()


# Import and include routers
from app.api.v1 import auth, users, interests, discovery, dev

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(interests.router, prefix="/api/v1/interests", tags=["interests"])
app.include_router(discovery.router, prefix="/api/v1/discovery", tags=["discovery"])
app.include_router(dev.router, prefix="/api/v1/dev", tags=["development"])

# TODO: Add more routers as they are created
# app.include_router(matches.router, prefix="/api/v1/matches", tags=["matches"])
# app.include_router(messages.router, prefix="/api/v1/messages", tags=["messages"])
# app.include_router(meetings.router, prefix="/api/v1/meetings", tags=["meetings"])
# app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
# app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
