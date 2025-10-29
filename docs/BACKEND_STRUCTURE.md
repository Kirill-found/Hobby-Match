# Backend Structure

## Структура директорий
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Точка входа FastAPI
│   ├── config.py               # Настройки (env variables)
│   ├── database.py             # Database connection
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── interest.py
│   │   ├── swipe.py
│   │   ├── match.py
│   │   ├── message.py
│   │   ├── meeting.py
│   │   ├── payment.py
│   │   └── report.py
│   │
│   ├── schemas/                # Pydantic schemas (API models)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── interest.py
│   │   ├── swipe.py
│   │   ├── match.py
│   │   ├── message.py
│   │   ├── meeting.py
│   │   └── payment.py
│   │
│   ├── api/                    # API endpoints
│   │   ├── __init__.py
│   │   ├── deps.py             # Dependencies (auth, db session)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py         # Authentication
│   │       ├── users.py        # User management
│   │       ├── interests.py    # Interests/categories
│   │       ├── discovery.py    # Swipe cards, filters
│   │       ├── matches.py      # Matches list
│   │       ├── messages.py     # Chat messages
│   │       ├── meetings.py     # Meeting proposals
│   │       ├── payments.py     # Payments, subscriptions
│   │       └── reports.py      # Reports, blocks
│   │
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── matching_service.py      # Matching algorithm
│   │   ├── recommendation_service.py # Interest recommendations
│   │   ├── payment_service.py
│   │   ├── notification_service.py
│   │   └── reliability_service.py
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── telegram.py         # Telegram WebApp validation
│   │   ├── geo.py              # Geolocation calculations
│   │   ├── s3.py               # S3/R2 file upload
│   │   ├── security.py         # Password hashing, tokens
│   │   └── analytics.py        # Event tracking
│   │
│   └── alembic/                # Database migrations
│       ├── versions/
│       └── env.py
│
├── tests/                      # Tests
│   ├── __init__.py
│   ├── test_auth.py
│   ├── test_matching.py
│   └── test_api/
│
├── scripts/                    # Utility scripts
│   ├── load_interests.py       # Load interests tree to DB
│   └── seed_data.py            # Seed test data
│
├── requirements.txt
├── .env.example
├── alembic.ini
└── README.md
```

## Ключевые файлы

### app/main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, users, interests, discovery, matches, messages, meetings, payments, reports
from app.database import engine, Base
from app.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HobbyMatch API",
    description="API for HobbyMatch Telegram Mini App",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(interests.router, prefix="/api/v1/interests", tags=["interests"])
app.include_router(discovery.router, prefix="/api/v1/discovery", tags=["discovery"])
app.include_router(matches.router, prefix="/api/v1/matches", tags=["matches"])
app.include_router(messages.router, prefix="/api/v1/messages", tags=["messages"])
app.include_router(meetings.router, prefix="/api/v1/meetings", tags=["meetings"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])

@app.get("/")
def read_root():
    return {"message": "HobbyMatch API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

### app/config.py
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App
    APP_NAME: str = "HobbyMatch"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Telegram
    TELEGRAM_BOT_TOKEN: str
    
    # S3/R2
    S3_ENDPOINT_URL: str = ""  # For Cloudflare R2
    S3_BUCKET_NAME: str
    S3_ACCESS_KEY: str
    S3_SECRET_KEY: str
    S3_REGION: str = "auto"
    
    # Payments
    YOOKASSA_SHOP_ID: str = ""
    YOOKASSA_SECRET_KEY: str = ""
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:5173", "https://*.telegram.org"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### app/database.py
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Следующие шаги

1. Изучить `API_DOCUMENTATION.md` для детального описания всех endpoints
2. Изучить `DATABASE_SCHEMA.md` для полной схемы БД
3. Начать кодинг с `app/main.py` и базовой структуры