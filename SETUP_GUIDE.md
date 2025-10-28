# 🚀 Полное руководство по настройке HobbyMatch

Пошаговая инструкция для запуска проекта с нуля.

---

## 📋 Требования

Перед началом убедитесь что установлены:

- ✅ **Node.js 18+** - [скачать](https://nodejs.org/)
- ✅ **Python 3.11+** - [скачать](https://www.python.org/)
- ✅ **Git** - [скачать](https://git-scm.com/)
- ✅ **VS Code** (рекомендуется) - [скачать](https://code.visualstudio.com/)

Проверка версий:
```bash
node --version    # v18.0.0+
python --version  # Python 3.11+
git --version     # git version 2.0+
```

---

## Часть 1: Настройка Backend

### 1.1 Создание виртуального окружения

```bash
cd hobby-match/backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Вы должны увидеть `(venv)` в начале строки терминала.

### 1.2 Установка зависимостей

```bash
pip install -r requirements.txt
```

⏱ Займет ~3-5 минут

### 1.3 Настройка Supabase

📖 **Следуйте инструкции:** [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

Кратко:
1. Создать проект на [supabase.com](https://supabase.com)
2. Получить connection string
3. Сохранить пароль БД!

### 1.4 Создание .env файла

```bash
cp .env.example .env
```

Открыть `.env` и заполнить:

```env
# Основные настройки
APP_NAME=HobbyMatch
DEBUG=True

# База данных (из Supabase)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres

# Секретный ключ (сгенерировать новый!)
SECRET_KEY=your-super-secret-key-change-this-to-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Telegram Bot (получим позже)
TELEGRAM_BOT_TOKEN=будет_позже

# CORS
ALLOWED_ORIGINS=["http://localhost:5173","https://*.telegram.org"]
```

💡 **Важно:** Замените:
- `YOUR_PASSWORD` - пароль от Supabase
- `SECRET_KEY` - сгенерируйте случайную строку

Генерация SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 1.5 Создание таблиц в БД

```bash
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine); print('✅ Tables created!')"
```

Если успешно, увидите: `✅ Tables created!`

### 1.6 Запуск Backend

```bash
uvicorn app.main:app --reload --port 8000
```

Откройте браузер: http://localhost:8000

Вы должны увидеть:
```json
{
  "message": "HobbyMatch API",
  "status": "running",
  "version": "1.0.0"
}
```

✅ **Backend работает!**

API документация: http://localhost:8000/docs

---

## Часть 2: Настройка Frontend

### 2.1 Установка зависимостей

```bash
cd ../frontend
npm install
```

⏱ Займет ~2-3 минуты

### 2.2 Создание .env файла

```bash
cp .env.example .env
```

Открыть `.env` и заполнить:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_TELEGRAM_BOT_USERNAME=будет_позже
```

### 2.3 Запуск Frontend

```bash
npm run dev
```

Откройте браузер: http://localhost:5173

Вы должны увидеть страницу с "Загрузка..."

✅ **Frontend работает!**

---

## Часть 3: Настройка Telegram

### 3.1 Создание Telegram бота

📖 **Следуйте инструкции:** [docs/TELEGRAM_SETUP.md](docs/TELEGRAM_SETUP.md)

Кратко:
1. Открыть [@BotFather](https://t.me/BotFather)
2. Команда: `/newbot`
3. Указать имя: `HobbyMatch`
4. Указать username: `hobbymatch_bot` (или другой)
5. Сохранить токен!

### 3.2 Обновление .env файлов

**Backend** (`backend/.env`):
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdef...
```

**Frontend** (`frontend/.env`):
```env
VITE_TELEGRAM_BOT_USERNAME=hobbymatch_bot
```

### 3.3 Перезапуск серверов

```bash
# Backend (Ctrl+C чтобы остановить, затем)
uvicorn app.main:app --reload --port 8000

# Frontend (в другом терминале)
npm run dev
```

---

## Часть 4: Настройка Telegram Web App

### 4.1 Установка ngrok

Для локального тестирования нужен HTTPS туннель:

```bash
# Windows
choco install ngrok

# macOS
brew install ngrok

# Или через npm
npm install -g ngrok
```

Регистрация (необязательно, но рекомендуется):
1. Зарегистрироваться на [ngrok.com](https://ngrok.com)
2. Получить authtoken
3. `ngrok authtoken YOUR_TOKEN`

### 4.2 Запуск ngrok

```bash
ngrok http 5173
```

Вы увидите:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:5173
```

Скопируйте HTTPS URL (`https://abc123.ngrok.io`)

⚠️ **Важно:** Не закрывайте ngrok!

### 4.3 Создание Web App в BotFather

1. Открыть [@BotFather](https://t.me/BotFather)
2. Команда: `/newapp`
3. Выбрать вашего бота
4. Указать Title: `HobbyMatch`
5. Указать Description:
```
Найди партнера для спорта и хобби!
Свайпы, матчи, встречи 🤝
```
6. Загрузить фото (640x360px)
7. **Web App URL**: вставить ngrok URL (`https://abc123.ngrok.io`)
8. Команда: `/setappshortname`
9. Указать short name: `hobby_match`

✅ **Web App создан!**

---

## Часть 5: Первый запуск

### 5.1 Проверка всех сервисов

Убедитесь что запущены:
- ✅ Backend: http://localhost:8000
- ✅ Frontend: http://localhost:5173
- ✅ Ngrok: https://xxx.ngrok.io → localhost:5173

### 5.2 Открытие в Telegram

1. Открыть Telegram (Desktop или Mobile)
2. Найти своего бота по username
3. Нажать "Start"
4. Нажать кнопку "Открыть приложение"

Или прямая ссылка:
```
https://t.me/your_bot_username/hobby_match
```

### 5.3 Что должно произойти

1. ✅ Приложение открывается в Telegram
2. ✅ Видна страница "Добро пожаловать в HobbyMatch!"
3. ✅ При нажатии "Начать" → переход на "Поиск партнеров"
4. ✅ В backend консоли видны запросы
5. ✅ Нет ошибок в консоли браузера

**Поздравляем! Проект запущен! 🎉**

---

## 🐛 Troubleshooting

### Backend не запускается

**Ошибка:** `ModuleNotFoundError`
```bash
# Активировать venv снова
cd backend
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

**Ошибка:** `sqlalchemy.exc.OperationalError`
- Проверить DATABASE_URL в `.env`
- Проверить что Supabase проект запущен
- Проверить интернет соединение

### Frontend не запускается

**Ошибка:** `command not found: npm`
```bash
# Установить Node.js
# https://nodejs.org/
```

**Ошибка:** Port 5173 already in use
```bash
# Убить процесс или использовать другой порт
npm run dev -- --port 5174
```

### Telegram Web App не открывается

**Ошибка:** "WebAppInvalidInit"
- Проверить что ngrok запущен
- Проверить что URL в BotFather правильный
- Попробовать обновить URL через `/setappurl`

**Приложение белое/не загружается:**
- Открыть ngrok URL в браузере напрямую
- Проверить что frontend запущен
- Очистить кэш Telegram

### Ошибка аутентификации

**"Invalid Telegram authentication data"**
- Проверить TELEGRAM_BOT_TOKEN в backend `.env`
- Закрыть и снова открыть приложение
- Проверить что токен правильный (скопировать заново)

---

## 📚 Что дальше?

Теперь когда все работает:

1. 📖 Изучить [API Documentation](docs/API_DOCUMENTATION.md)
2. 🎨 Кастомизировать UI/UX
3. 💾 Добавить тестовых пользователей
4. 🔄 Реализовать Discovery (swipe) функционал
5. 💬 Добавить чат
6. 🚀 Подготовить к деплою

---

## 🆘 Помощь

Если что-то не работает:

1. ✅ Проверьте все шаги выше
2. ✅ Посмотрите ошибки в консоли
3. ✅ Проверьте логи backend
4. ✅ Перечитайте документацию
5. 📧 Напишите разработчику

---

**Успехов в разработке! 🚀**
