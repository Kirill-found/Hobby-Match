# 🤝 HobbyMatch

**Telegram Mini App для поиска партнеров по спорту и хобби**

> Dating-механика для поиска единомышленников. Свайпы, матчи, встречи.

---

## 📱 Описание

HobbyMatch решает проблему одиночества и сложности поиска партнеров для совместных активностей. Вместо поиска романтических отношений, пользователи ищут компанию для:

- 🏀 Спорта (155+ видов)
- 🎨 Хобби и творчества
- 🎮 Настольных игр
- 🎸 Музыки и танцев
- 📚 Образования и саморазвития

## ✨ Ключевые особенности

- 🎯 **Dating-механика** - знакомый swipe-интерфейс
- 🌳 **Умное дерево интересов** - 4-уровневая классификация 155+ активностей
- 📍 **Геолокация** - поиск партнеров поблизости
- 💬 **Встроенный чат** - общение после матча
- 📅 **Система встреч** - предложение конкретных встреч
- ⭐ **Рейтинг надежности** - проверенные пользователи
- 💎 **Freemium модель** - бесплатная база + Premium

## 🏗 Архитектура

### Backend
- **FastAPI** - современный Python веб-фреймворк
- **PostgreSQL** (Supabase) - основная база данных
- **SQLAlchemy** - ORM
- **JWT** - аутентификация
- **Cloudflare R2** - хранение фото

### Frontend
- **React 18 + TypeScript** - UI
- **Vite** - сборщик
- **Tailwind CSS** - стилизация
- **Zustand** - state management
- **React Query** - data fetching
- **Telegram WebApp SDK** - интеграция

### Infrastructure
- **Supabase** - PostgreSQL БД
- **Railway/Vercel** - деплой backend
- **Vercel/Cloudflare Pages** - деплой frontend
- **Cloudflare R2** - хранение файлов

## 📂 Структура проекта

```
hobby-match/
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Utilities
│   │   ├── config.py    # Configuration
│   │   ├── database.py  # Database setup
│   │   └── main.py      # FastAPI app
│   ├── alembic/         # Migrations
│   └── requirements.txt
│
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── api/        # API clients
│   │   ├── components/ # React components
│   │   ├── pages/      # Pages
│   │   ├── hooks/      # Custom hooks
│   │   ├── store/      # Zustand stores
│   │   ├── types/      # TypeScript types
│   │   └── App.tsx     # Main app
│   └── package.json
│
├── docs/               # Документация
└── README.md
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- Python 3.11+
- PostgreSQL (или Supabase аккаунт)
- Telegram Bot Token

### 1. Клонировать репозиторий

```bash
git clone <repository-url>
cd hobby-match
```

### 2. Настроить Backend

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Установить зависимости
pip install -r requirements.txt

# Настроить .env
cp .env.example .env
# Заполнить DATABASE_URL, SECRET_KEY, TELEGRAM_BOT_TOKEN

# Запустить сервер
uvicorn app.main:app --reload --port 8000
```

Backend будет доступен на `http://localhost:8000`

### 3. Настроить Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Настроить .env
cp .env.example .env
# Заполнить VITE_API_URL и VITE_TELEGRAM_BOT_USERNAME

# Запустить dev server
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

### 4. Настроить Telegram Bot

1. Открыть [@BotFather](https://t.me/BotFather) в Telegram
2. Создать нового бота: `/newbot`
3. Получить токен и добавить в backend `.env`
4. Настроить Web App: `/newapp`
5. Указать URL (ngrok для локальной разработки)

Подробнее: [docs/TELEGRAM_SETUP.md](docs/TELEGRAM_SETUP.md)

### 5. Настроить Supabase

1. Создать проект на [supabase.com](https://supabase.com)
2. Получить PostgreSQL connection string
3. Добавить DATABASE_URL в backend `.env`

Подробнее: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

## 📖 Документация

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Telegram Setup](docs/TELEGRAM_SETUP.md)
- [Supabase Setup](docs/SUPABASE_SETUP.md)

## 🛣 Roadmap

### MVP (Week 1-6) ✅
- [x] Backend структура
- [x] Модели БД
- [x] Auth, Users, Interests API
- [x] Frontend структура
- [x] Базовые страницы
- [ ] Онбординг флоу
- [ ] Discovery (swipe)

### Phase 2 (Week 7-10)
- [ ] Matches & Chat
- [ ] Meeting proposals
- [ ] Profile & Settings
- [ ] Push notifications

### Phase 3 (Week 11-14)
- [ ] Premium features
- [ ] Payments (YooKassa)
- [ ] Analytics
- [ ] Admin panel

## 🎯 Целевая аудитория

**Primary:**
- 👨‍🎓 Студенты 18-25 (переехавшие в новый город)
- 👔 Young professionals 23-35 (хотят новые хобби)

**Secondary:**
- 🏙 Переехавшие / удаленщики
- 👶 После декрета

## 💰 Монетизация

**Freemium модель:**
- **Free:** 10 свайпов/день, базовые фильтры
- **Premium:** 490₽/мес
  - Безлимит свайпов
  - Расширенные фильтры (район, уровень)
  - Видимость "кто лайкнул"
  - Приоритет в показах

**In-app покупки:**
- Boost (99₽) - приоритет на 24 часа
- Super Swipes (49₽/шт) - гарантия просмотра

## 📊 Ключевые метрики

- **40%+** Day-1 Retention
- **20%+** Week-1 Retention
- **5%** конверсия в Premium (Month-3)
- **20%+** получают минимум 1 match в первую неделю

## 👥 Команда

Solo founder project

## 📝 Лицензия

Proprietary

## 🤝 Контакты

- Telegram: [@your_username](https://t.me/your_username)
- Email: your.email@example.com

---

Made with ❤️ and AI assistance
# Trigger redeploy
