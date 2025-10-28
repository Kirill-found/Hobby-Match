# ⚡ Quick Start Guide

Запуск HobbyMatch за 10 минут.

---

## 1️⃣ Backend (5 минут)

```bash
cd backend

# Создать venv
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Установить зависимости
pip install -r requirements.txt

# Настроить .env
cp .env.example .env
# Заполнить DATABASE_URL, SECRET_KEY, TELEGRAM_BOT_TOKEN

# Создать таблицы
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Запустить
uvicorn app.main:app --reload --port 8000
```

✅ Backend: http://localhost:8000

---

## 2️⃣ Frontend (3 минуты)

```bash
cd frontend

# Установить зависимости
npm install

# Настроить .env
cp .env.example .env
# Заполнить VITE_API_URL, VITE_TELEGRAM_BOT_USERNAME

# Запустить
npm run dev
```

✅ Frontend: http://localhost:5173

---

## 3️⃣ Telegram (2 минуты)

### Создать бота:
1. [@BotFather](https://t.me/BotFather) → `/newbot`
2. Name: `HobbyMatch`
3. Username: `hobbymatch_bot`
4. Сохранить токен → добавить в backend `.env`

### Настроить Web App:
1. [@BotFather](https://t.me/BotFather) → `/newapp`
2. Web App URL: `https://your-ngrok-url.ngrok.io`

   Получить ngrok URL:
   ```bash
   ngrok http 5173
   ```

✅ Готово! Открыть: `https://t.me/your_bot_username`

---

## 🎯 Проверка

- [ ] Backend работает: http://localhost:8000
- [ ] Frontend работает: http://localhost:5173
- [ ] Ngrok запущен
- [ ] Web App открывается в Telegram
- [ ] Аутентификация работает

---

## 📚 Полная инструкция

Если что-то не получается, смотрите:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - подробная инструкция
- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) - настройка БД
- [docs/TELEGRAM_SETUP.md](docs/TELEGRAM_SETUP.md) - настройка бота

---

**Happy coding! 🚀**
