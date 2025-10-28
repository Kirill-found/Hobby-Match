# 🚀 Руководство по деплою HobbyMatch

## Обзор

- **Frontend**: Vercel (бесплатно)
- **Backend**: Railway (бесплатно $5 credits)
- **Database**: Supabase PostgreSQL (уже создан)
- **Files**: Cloudflare R2 (позже)

---

## Часть 1: Деплой Frontend на Vercel

### Шаг 1: Загрузить на GitHub

1. **Создайте репозиторий на GitHub:**
   - Перейти на https://github.com/new
   - Repository name: `hobby-match`
   - Visibility: Private (рекомендуется)
   - Не добавляйте README, .gitignore (уже есть)
   - Нажать "Create repository"

2. **Подключить локальный репозиторий:**
   ```bash
   cd "C:\Users\wtk_x\OneDrive\Рабочий стол\hobby-match"
   git remote add origin https://github.com/ВАШ_USERNAME/hobby-match.git
   git branch -M main
   git push -u origin main
   ```

### Шаг 2: Деплой на Vercel

1. **Перейти на https://vercel.com**
2. **Sign Up / Login** через GitHub
3. **Import Project** → выбрать `hobby-match` репозиторий
4. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables** (добавить):
   ```
   VITE_API_URL=https://ваш-backend.railway.app/api/v1
   VITE_TELEGRAM_BOT_USERNAME=hobby_matchBot
   ```
   (Backend URL добавим после деплоя backend)

6. **Deploy** → подождать ~2 минуты

7. **Получить URL:** `https://hobby-match-xxx.vercel.app`

---

## Часть 2: Деплой Backend на Railway

### Шаг 1: Подготовка

Создать файл для Railway в корне проекта:

**`railway.json`:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r backend/requirements.txt"
  },
  "deploy": {
    "startCommand": "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Или создать `Procfile` в папке `backend/`:**
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Шаг 2: Деплой на Railway

1. **Перейти на https://railway.app**
2. **Sign Up / Login** через GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select Repository:** `hobby-match`
5. **Add variables:**
   ```
   DATABASE_URL=postgresql://postgres:Dom401215!@db.fhwtrblhljayteltychb.supabase.co:5432/postgres
   SECRET_KEY=q0AdeYdLlq32zPZuhnU9PqxOh_G6ckDlcZA-TLSri9k
   TELEGRAM_BOT_TOKEN=8041259999:AAEIKBmnp9s-CsBJT3M3mNl7mFksQNniq58
   ALLOWED_ORIGINS=["https://hobby-match-xxx.vercel.app","https://*.telegram.org","https://t.me"]
   DEBUG=False
   ```

6. **Settings** → **Root Directory**: `/backend`

7. **Deploy** → подождать ~5 минут

8. **Получить URL:** `https://hobby-match-production.up.railway.app`

### Шаг 3: Создать таблицы в Production БД

После деплоя backend:
```bash
# Локально, но с production DATABASE_URL
python backend/create_tables.py
```

Или через Railway CLI:
```bash
railway run python create_tables.py
```

---

## Часть 3: Обновить конфигурацию

### 1. Обновить Frontend ENV на Vercel

Вернуться в Vercel → Settings → Environment Variables:
```
VITE_API_URL=https://hobby-match-production.up.railway.app/api/v1
```

Redeploy frontend (Deployments → ... → Redeploy)

### 2. Обновить Backend ENV на Railway

Railway → Variables:
```
ALLOWED_ORIGINS=["https://hobby-match-xxx.vercel.app","https://*.telegram.org","https://t.me"]
```

---

## Часть 4: Настроить Telegram Web App

### Теперь у вас есть production URL!

1. **Открыть @BotFather**
2. **Команда:** `/newapp`
3. **Выбрать бота:** @hobby_matchBot
4. **Title:** HobbyMatch
5. **Description:**
   ```
   Найди партнера для спорта и хобби!

   🎯 Свайпы по карточкам
   💬 Чат после матча
   📍 Поиск рядом
   ```
6. **Web App URL:** `https://hobby-match-xxx.vercel.app`
7. **Short name:** `hobbymatch`

### Тестирование

Откройте бота → нажмите кнопку "Открыть приложение"

Или перейдите по ссылке:
```
https://t.me/hobby_matchBot/hobbymatch
```

---

## 🎉 Готово!

Ваше приложение теперь live:
- ✅ Frontend: https://hobby-match-xxx.vercel.app
- ✅ Backend: https://hobby-match-production.up.railway.app
- ✅ Database: Supabase PostgreSQL
- ✅ Telegram: @hobby_matchBot

---

## Troubleshooting

### Backend не запускается на Railway

1. Проверить логи: Railway → Deployments → View Logs
2. Проверить DATABASE_URL (правильный пароль?)
3. Проверить что все переменные добавлены

### Frontend не подключается к Backend

1. Проверить VITE_API_URL в Vercel
2. Проверить CORS в backend (ALLOWED_ORIGINS)
3. Открыть DevTools в браузере → Console

### Telegram Web App не открывается

1. Проверить что URL правильный
2. Проверить что frontend задеплоен
3. Попробовать очистить кэш Telegram

---

## Следующие шаги

1. ✅ Настроить custom domain (опционально)
2. 🔄 Добавить CI/CD (GitHub Actions)
3. 🔄 Настроить monitoring (Sentry, LogRocket)
4. 🔄 Добавить analytics
5. 🔄 Настроить Cloudflare R2 для фото

---

**Готово к использованию! 🚀**
