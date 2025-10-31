# Deployment Guide - HobbyMatch

**Версия:** 1.0  
**Stack:** Railway (Backend) + Vercel (Frontend) + Telegram Bot

---

## 🎯 OVERVIEW

```
Production Architecture:
┌─────────────┐
│   User      │
│  (Telegram) │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│  Telegram Bot    │ ← @HobbyMatchBot
│  (BotFather)     │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│  Frontend (SPA)  │ ← Vercel (React + Vite)
│  Telegram Mini   │    https://hobbymatch.vercel.app
│  App             │
└──────┬───────────┘
       │
       ↓ (API calls)
┌──────────────────┐
│  Backend API     │ ← Railway (FastAPI + PostgreSQL)
│  + PostgreSQL    │    https://hobbymatch.up.railway.app
└──────────────────┘
```

---

## 📦 PREREQUISITES

Перед деплоем убедись что у тебя есть:

- [x] GitHub аккаунт (для Railway и Vercel)
- [x] Telegram Bot Token (от @BotFather)
- [x] Railway аккаунт (https://railway.app)
- [x] Vercel аккаунт (https://vercel.com)
- [x] Код в GitHub репозитории

---

## 🚀 STEP 1: Deploy Backend (Railway)

### 1.1 Create Railway Project

1. Зайди на https://railway.app
2. Sign up / Log in через GitHub
3. Нажми **"New Project"**
4. Выбери **"Provision PostgreSQL"**
5. PostgreSQL создастся автоматически

### 1.2 Add Backend Service

1. В том же проекте нажми **"+ New"**
2. Выбери **"GitHub Repo"**
3. Выбери свой репозиторий `hobby-match`
4. Root directory: `/backend` (важно!)
5. Railway автоматически определит Python

### 1.3 Configure Environment Variables

В Railway dashboard для Backend service:

**Settings → Variables → Add Variable:**

```bash
# Database (автоматически из PostgreSQL)
DATABASE_URL=${RAILWAY_POSTGRES_URL}

# Security
SECRET_KEY=<сгенерируй случайный 32-байтный ключ>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Telegram
TELEGRAM_BOT_TOKEN=<твой токен от BotFather>

# S3 (пока оставь пустым, добавишь позже)
S3_BUCKET_NAME=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Python version (опционально)
PYTHON_VERSION=3.11
```

**Как сгенерировать SECRET_KEY:**
```python
import secrets
print(secrets.token_urlsafe(32))
# Скопируй результат
```

### 1.4 Configure Start Command

**Settings → Deploy → Start Command:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Settings → Deploy → Build Command:**
```bash
pip install -r requirements.txt
alembic upgrade head
```

### 1.5 Deploy

1. Railway автоматически начнет деплой после коммита в GitHub
2. Первый деплой займет 2-5 минут
3. После деплоя получишь URL: `https://hobbymatch.up.railway.app`

### 1.6 Test Backend

```bash
# Test health check
curl https://hobbymatch.up.railway.app/health

# Должен вернуть:
{"status": "healthy"}
```

---

## 🌐 STEP 2: Deploy Frontend (Vercel)

### 2.1 Import Project

1. Зайди на https://vercel.com
2. Sign up / Log in через GitHub
3. Нажми **"Add New" → "Project"**
4. Выбери свой репозиторий `hobby-match`
5. Framework Preset: **Vite** (автоматически определится)

### 2.2 Configure Build Settings

**Root Directory:** `frontend`

**Build Command:** (автоматически)
```bash
npm run build
```

**Output Directory:** (автоматически)
```bash
dist
```

**Install Command:** (автоматически)
```bash
npm install
```

### 2.3 Configure Environment Variables

В Vercel dashboard:

**Settings → Environment Variables:**

```bash
# Backend API URL (замени на свой Railway URL)
VITE_API_URL=https://hobbymatch.up.railway.app/api/v1

# Telegram Bot Username (без @)
VITE_TELEGRAM_BOT_USERNAME=HobbyMatchBot
```

### 2.4 Deploy

1. Нажми **"Deploy"**
2. Vercel автоматически задеплоит
3. Первый деплой: 1-2 минуты
4. Получишь URL: `https://hobbymatch.vercel.app`

### 2.5 Custom Domain (опционально)

**Settings → Domains → Add Domain:**
- Добавь свой домен (например: `app.hobbymatch.ru`)
- Настрой DNS записи как указано Vercel
- Vercel автоматически выдаст SSL сертификат

---

## 🤖 STEP 3: Configure Telegram Bot

### 3.1 Set WebApp URL

Теперь нужно связать Telegram бота с фронтендом.

**Вариант A: Через BotFather (UI)**

1. Открой Telegram → @BotFather
2. Отправь `/mybots`
3. Выбери своего бота
4. Нажми **"Bot Settings" → "Menu Button" → "Configure menu button"**
5. URL: `https://hobbymatch.vercel.app`
6. Text: `Открыть приложение`

**Вариант B: Через API (командная строка)**

```bash
# Set menu button
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setChatMenuButton \
  -H "Content-Type: application/json" \
  -d '{
    "menu_button": {
      "type": "web_app",
      "text": "Открыть",
      "web_app": {
        "url": "https://hobbymatch.vercel.app"
      }
    }
  }'
```

### 3.2 Set Webhook (опционально)

Если хочешь получать уведомления о событиях в боте:

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://hobbymatch.up.railway.app/webhook/telegram"
  }'
```

**Проверь что webhook установлен:**
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

### 3.3 Test Bot

1. Открой Telegram
2. Найди своего бота: `@HobbyMatchBot`
3. Нажми **"Start"**
4. Нажми на кнопку внизу (Menu Button)
5. Должно открыться твое приложение

---

## 🔄 STEP 4: CI/CD (Automatic Deploys)

### Railway (Backend)

**Автоматический деплой при push:**
1. Railway → Settings → GitHub
2. Enable **"Auto Deploy"**
3. Branch: `main`
4. Теперь каждый `git push` в `main` → автодеплой

### Vercel (Frontend)

**Автоматический деплой при push:**
- Уже включен по умолчанию
- Каждый push в `main` → production deploy
- Каждый PR → preview deploy (отдельный URL)

---

## 📊 STEP 5: Monitoring & Logs

### Railway Logs

**Railway Dashboard → Backend Service → Logs:**
- Real-time logs
- Можно фильтровать по уровню (error, warning, info)
- Можно скачать

**Useful для debugging:**
```bash
# В коде добавь логи:
import logging
logging.info(f"User {user_id} logged in")
logging.error(f"Error: {e}")
```

### Vercel Logs

**Vercel Dashboard → Project → Deployments:**
- Build logs
- Function logs (для serverless functions)
- Real-time monitoring

### PostgreSQL Metrics

**Railway Dashboard → PostgreSQL → Metrics:**
- Connections
- Queries per second
- Storage usage
- Memory usage

---

## 🐛 TROUBLESHOOTING

### Backend не запускается

**Проблема:** `ModuleNotFoundError: No module named 'app'`

**Решение:**
```bash
# Проверь что Root Directory = /backend в Railway
# Проверь что есть app/__init__.py
```

---

**Проблема:** `FATAL: database "railway" does not exist`

**Решение:**
```bash
# Railway автоматически создает базу
# Проверь что DATABASE_URL правильный:
# Railway → PostgreSQL → Variables → DATABASE_URL
```

---

**Проблема:** `alembic.util.exc.CommandError: Can't locate revision`

**Решение:**
```bash
# Убедись что миграции закоммичены в Git
cd backend
git add alembic/versions/
git commit -m "Add migrations"
git push

# Railway запустит alembic upgrade head автоматически
```

---

### Frontend не подключается к Backend

**Проблема:** `ERR_CONNECTION_REFUSED` или CORS errors

**Решение 1: Проверь VITE_API_URL**
```bash
# Vercel → Settings → Environment Variables
VITE_API_URL=https://твой-railway-url.up.railway.app/api/v1

# После изменения нужен redeploy:
# Vercel → Deployments → ... → Redeploy
```

**Решение 2: Проверь CORS на Backend**
```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://hobbymatch.vercel.app"],  # Укажи свой Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Telegram Bot не открывает приложение

**Проблема:** Кнопка "Открыть" не появляется

**Решение:**
```bash
# Проверь что menu button установлен:
curl https://api.telegram.org/bot<TOKEN>/getChatMenuButton

# Если пусто, установи заново через BotFather или API
```

---

**Проблема:** Приложение открывается, но белый экран

**Решение:**
```bash
# Проверь Console в браузере (Telegram Desktop)
# Вероятно ошибка загрузки JavaScript

# Проверь что build успешный:
# Vercel → Deployments → последний deploy → Build Logs
```

---

## 🔐 SECURITY CHECKLIST

Перед запуском в продакшн:

- [ ] **SECRET_KEY** генерирован случайно (не дефолтный)
- [ ] **DATABASE_URL** не закоммичен в Git (только в Railway env vars)
- [ ] **TELEGRAM_BOT_TOKEN** не закоммичен в Git
- [ ] **CORS** настроен только для своего Vercel домена (не `*`)
- [ ] **HTTPS** везде (Railway и Vercel автоматически)
- [ ] **.env файлы** в `.gitignore`
- [ ] **PostgreSQL** доступен только через Railway (не публичный)

---

## 📈 SCALING

### When to scale:

**Backend (Railway):**
- **1000+ users:** Upgrade to Railway Pro ($20/month)
  - Больше CPU и RAM
  - Priority support
- **10000+ users:** Upgrade to Scale plan ($50/month)

**PostgreSQL (Railway):**
- **Default:** Shared instance (достаточно для MVP)
- **1GB data:** Upgrade plan или добавь Replicas
- **10GB+ data:** Consider managed PostgreSQL (например, Supabase или AWS RDS)

**Frontend (Vercel):**
- **Бесплатно** до 100GB bandwidth
- Vercel автоматически скейлится (serverless)

---

## 💰 COST ESTIMATE

### Month 1-3 (MVP, 100-500 users):

| Service | Plan | Cost |
|---------|------|------|
| Railway Backend | Hobby ($5) | $5/month |
| Railway PostgreSQL | Included | $0 |
| Vercel Frontend | Free | $0 |
| **Total** | | **$5/month** |

### Month 4-6 (1000+ users):

| Service | Plan | Cost |
|---------|------|------|
| Railway Backend | Pro ($20) | $20/month |
| Railway PostgreSQL | Included | $0 |
| Vercel Frontend | Pro ($20) | $20/month |
| **Total** | | **$40/month** |

### Month 7+ (5000+ users):

| Service | Plan | Cost |
|---------|------|------|
| Railway Backend | Scale ($50) | $50/month |
| PostgreSQL | External (Supabase Pro) | $25/month |
| Vercel Frontend | Pro ($20) | $20/month |
| S3 Storage | AWS S3 | $5/month |
| **Total** | | **$100/month** |

---

## 🔄 ROLLBACK PROCEDURE

Если что-то пошло не так:

### Railway (Backend):

**Option 1: Rollback to previous deploy**
```bash
# Railway Dashboard → Backend Service → Deployments
# Выбери предыдущий успешный deploy
# Нажми "..." → "Redeploy"
```

**Option 2: Rollback через Git**
```bash
git revert HEAD
git push origin main
# Railway автоматически задеплоит предыдущую версию
```

### Vercel (Frontend):

**Instant Rollback:**
```bash
# Vercel Dashboard → Deployments
# Найди предыдущий успешный deploy
# Нажми "..." → "Promote to Production"
# Моментальный rollback (без rebuild)
```

---

## 📝 DEPLOYMENT CHECKLIST

Перед каждым деплоем:

### Backend:
- [ ] Все тесты проходят локально
- [ ] Миграции созданы (`alembic revision --autogenerate`)
- [ ] Миграции закоммичены в Git
- [ ] Environment variables обновлены (если нужно)
- [ ] API endpoints тестированы (Postman/curl)

### Frontend:
- [ ] Build работает локально (`npm run build`)
- [ ] TypeScript без ошибок (`npm run type-check`)
- [ ] Environment variables обновлены (если нужно)
- [ ] Тестирование в Telegram Desktop (если изменения в WebApp)

### After Deploy:
- [ ] Backend health check: `curl https://your-backend.railway.app/health`
- [ ] Frontend загружается: открыть URL в браузере
- [ ] Telegram Bot открывает приложение
- [ ] Можно зарегистрироваться и залогиниться
- [ ] API calls работают (проверь Network tab в DevTools)
- [ ] Проверь Railway/Vercel logs на ошибки

---

## 🎯 QUICK COMMANDS

### Deploy Backend (Railway):
```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway автоматически задеплоит
```

### Deploy Frontend (Vercel):
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel автоматически задеплоит
```

### Force Redeploy (без изменений кода):
```bash
# Railway: Dashboard → Service → ... → Restart
# Vercel: Dashboard → Deployments → ... → Redeploy
```

### View Logs:
```bash
# Railway: Dashboard → Service → Logs (real-time)
# Vercel: Dashboard → Deployments → Build Logs
```

---

## ✅ SUCCESS CRITERIA

Деплой считается успешным когда:

1. ✅ Backend health check возвращает `{"status": "healthy"}`
2. ✅ Frontend загружается без ошибок
3. ✅ Telegram Bot открывает приложение
4. ✅ Можно зарегистрироваться через Telegram auth
5. ✅ API calls работают (проверить в Network tab)
6. ✅ Database queries работают (users создаются)
7. ✅ Нет критичных ошибок в logs
8. ✅ SSL certificates валидны (зеленый замок в браузере)

---

## 📚 USEFUL LINKS

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html

---

**Конец DEPLOYMENT** ✅

Следуй этому гайду шаг за шагом и твое приложение будет задеплоено за 30-40 минут!