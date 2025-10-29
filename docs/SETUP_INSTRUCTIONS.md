# Инструкции по настройке проекта

## Требования

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+ (или Railway account)
- Git
- VS Code (рекомендуется)

## Структура проекта
```
hobby-match/
├── frontend/          # Telegram Mini App (React)
├── backend/           # FastAPI Backend
├── bot/              # Telegram Bot (уведомления)
├── data/             # Данные (interests_tree.json)
└── docs/             # Документация
```

## Шаг 1: Клонирование репозитория
```bash
git clone https://github.com/yourusername/hobby-match.git
cd hobby-match
```

## Шаг 2: Настройка Backend

### 2.1 Создать виртуальное окружение
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2.2 Установить зависимости
```bash
pip install -r requirements.txt
```

### 2.3 Создать .env файл
```bash
cp .env.example .env
```

Заполнить `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/hobbymatc
SECRET_KEY=your-super-secret-key-change-this
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
S3_BUCKET_NAME=hobby-match-photos
S3_ACCESS_KEY=your-s3-key
S3_SECRET_KEY=your-s3-secret
YOOKASSA_SHOP_ID=your-shop-id
YOOKASSA_SECRET_KEY=your-secret
```

### 2.4 Создать базу данных

**Локально (PostgreSQL):**
```bash
createdb hobbymat
```

**Или использовать Railway:**
1. Создать проект на railway.app
2. Добавить PostgreSQL
3. Скопировать DATABASE_URL из Railway в .env

### 2.5 Запустить миграции
```bash
alembic upgrade head
```

### 2.6 Загрузить данные интересов
```bash
python scripts/load_interests.py
```

### 2.7 Запустить backend
```bash
uvicorn app.main:app --reload --port 8000
```

Backend доступен на http://localhost:8000

## Шаг 3: Настройка Frontend

### 3.1 Установить зависимости
```bash
cd ../frontend
npm install
```

### 3.2 Создать .env файл
```bash
cp .env.example .env
```

Заполнить `.env`:
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
```

### 3.3 Запустить dev server
```bash
npm run dev
```

Frontend доступен на http://localhost:5173

## Шаг 4: Настройка Telegram Bot

### 4.1 Создать бота через BotFather

1. Открыть @BotFather в Telegram
2. Отправить `/newbot`
3. Следовать инструкциям
4. Получить токен и добавить в backend `.env`

### 4.2 Настроить Web App

Отправить BotFather:
```
/newapp
# Выбрать бота
# Web App URL: https://your-frontend-url.com (для прода) или ngrok URL для разработки
# Заполнить описание, фото
```

### 4.3 Настроить ngrok для локальной разработки
```bash
# Установить ngrok
npm install -g ngrok

# Запустить туннель для frontend
ngrok http 5173

# Скопировать https URL и добавить в BotFather
```

### 4.4 Запустить Telegram Bot
```bash
cd ../bot
pip install -r requirements.txt
python main.py
```

## Шаг 5: Проверка работы

1. Открыть бота в Telegram
2. Нажать кнопку "Открыть приложение"
3. Должно открыться Mini App
4. Пройти onboarding

## Полезные команды

**Backend:**
```bash
# Создать новую миграцию
alembic revision --autogenerate -m "description"

# Применить миграции
alembic upgrade head

# Откатить миграцию
alembic downgrade -1

# Тесты
pytest

# Форматирование кода
black .
isort .
```

**Frontend:**
```bash
# Разработка
npm run dev

# Сборка
npm run build

# Preview production build
npm run preview

# Линтинг
npm run lint

# Форматирование
npm run format
```

## Troubleshooting

### Backend не запускается
- Проверить DATABASE_URL в .env
- Убедиться что PostgreSQL запущен
- Проверить что миграции применены

### Frontend не подключается к backend
- Проверить VITE_API_URL в .env
- Убедиться что backend запущен
- Проверить CORS настройки в backend

### Telegram Mini App не открывается
- Проверить что frontend доступен по HTTPS (ngrok)
- Проверить URL в BotFather
- Проверить что бот запущен

## Дальнейшие шаги

После успешной настройки:
1. Изучить `DEVELOPMENT_GUIDE.md`
2. Начать с Week 1 tasks
3. Следовать `WEEK_BY_WEEK_PLAN.md`