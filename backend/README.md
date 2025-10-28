# HobbyMatch Backend

FastAPI backend для HobbyMatch - Telegram Mini App для поиска партнеров по хобби.

## Технологии

- **FastAPI** - современный веб-фреймворк для Python
- **PostgreSQL** - основная база данных (Supabase)
- **SQLAlchemy** - ORM для работы с БД
- **Alembic** - миграции БД
- **JWT** - аутентификация
- **Pydantic** - валидация данных

## Установка

### 1. Создать виртуальное окружение

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Установить зависимости

```bash
pip install -r requirements.txt
```

### 3. Настроить переменные окружения

Скопировать `.env.example` в `.env` и заполнить:

```bash
cp .env.example .env
```

**Важные переменные:**
- `DATABASE_URL` - URL подключения к PostgreSQL (Supabase)
- `SECRET_KEY` - секретный ключ для JWT
- `TELEGRAM_BOT_TOKEN` - токен Telegram бота

### 4. Применить миграции

```bash
# Будет доступно после настройки Alembic
alembic upgrade head
```

### 5. Запустить сервер

```bash
uvicorn app.main:app --reload --port 8000
```

API будет доступен на `http://localhost:8000`

## API Документация

После запуска сервера документация доступна по адресам:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Структура проекта

```
backend/
├── app/
│   ├── api/              # API endpoints
│   │   ├── deps.py       # Dependencies (auth, db)
│   │   └── v1/           # API v1 routes
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic
│   ├── utils/            # Utilities
│   ├── config.py         # Configuration
│   ├── database.py       # Database setup
│   └── main.py           # FastAPI app
├── alembic/              # Database migrations
├── tests/                # Tests
├── requirements.txt      # Dependencies
└── .env.example          # Environment variables example
```

## Endpoints

### Authentication
- `POST /api/v1/auth/telegram-login` - Аутентификация через Telegram
- `GET /api/v1/auth/me` - Получить текущего пользователя

### Users
- `GET /api/v1/users/profile` - Получить профиль
- `PUT /api/v1/users/profile` - Обновить профиль
- `POST /api/v1/users/photos` - Загрузить фото
- `DELETE /api/v1/users/photos/{index}` - Удалить фото

### Interests
- `GET /api/v1/interests/tree` - Получить дерево интересов
- `GET /api/v1/interests/categories` - Получить категории
- `GET /api/v1/interests/user/interests` - Получить интересы пользователя
- `POST /api/v1/interests/user/interests` - Добавить интерес
- `DELETE /api/v1/interests/user/interests/{id}` - Удалить интерес

## Следующие шаги

1. ✅ Базовая структура backend
2. ✅ Модели БД
3. ✅ Auth, Users, Interests endpoints
4. 🔄 Discovery (swipe) endpoints
5. 🔄 Matches & Messages endpoints
6. 🔄 Meetings endpoints
7. 🔄 Payments integration

## Разработка

```bash
# Форматирование кода
black .
isort .

# Тесты
pytest

# Создать новую миграцию
alembic revision --autogenerate -m "description"
```
