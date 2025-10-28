# ⚡ Быстрый деплой за 15 минут

## 1️⃣ GitHub (2 минуты)

1. Перейти на https://github.com/new
2. Repository name: `hobby-match`
3. Private
4. Create repository
5. В терминале:
```bash
cd "C:\Users\wtk_x\OneDrive\Рабочий стол\hobby-match"
git remote add origin https://github.com/ВАШ_USERNAME/hobby-match.git
git branch -M main
git push -u origin main
```

---

## 2️⃣ Vercel - Frontend (5 минут)

1. https://vercel.com → Login с GitHub
2. **Import Project** → выбрать `hobby-match`
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
4. **Environment Variables**:
   ```
   VITE_API_URL=https://ПОКА_ОСТАВИТЬ_ПУСТЫМ
   VITE_TELEGRAM_BOT_USERNAME=hobby_matchBot
   ```
5. **Deploy**
6. **Скопировать URL**: `https://hobby-match-xxx.vercel.app`

---

## 3️⃣ Railway - Backend (5 минут)

1. https://railway.app → Login с GitHub
2. **New Project** → **Deploy from GitHub**
3. Выбрать `hobby-match`
4. **Settings** → **Root Directory**: `backend`
5. **Variables** (добавить все):
```
DATABASE_URL=postgresql://postgres:Dom401215!@db.fhwtrblhljayteltychb.supabase.co:5432/postgres
SECRET_KEY=q0AdeYdLlq32zPZuhnU9PqxOh_G6ckDlcZA-TLSri9k
TELEGRAM_BOT_TOKEN=8041259999:AAEIKBmnp9s-CsBJT3M3mNl7mFksQNniq58
ALLOWED_ORIGINS=["https://hobby-match-xxx.vercel.app","https://*.telegram.org","https://t.me"]
DEBUG=False
```
6. **Deploy**
7. **Скопировать URL**: `https://hobby-match-production.up.railway.app`

---

## 4️⃣ Обновить Vercel (2 минуты)

1. Vercel → `hobby-match` → **Settings** → **Environment Variables**
2. Обновить:
```
VITE_API_URL=https://hobby-match-production.up.railway.app/api/v1
```
3. **Deployments** → **Redeploy**

---

## 5️⃣ Telegram Bot (1 минута)

1. @BotFather → `/newapp`
2. Выбрать `@hobby_matchBot`
3. Title: `HobbyMatch`
4. Description: `Найди партнера для спорта и хобби`
5. Photo: пропустить `/empty`
6. URL: `https://hobby-match-xxx.vercel.app`
7. Short name: `hobbymatch`

---

## ✅ Готово!

Открыть: `https://t.me/hobby_matchBot/hobbymatch`

---

## 🐛 Если что-то не работает:

**Backend ошибка:**
- Railway → Deployments → Logs
- Проверить все Variables

**Frontend ошибка:**
- Vercel → Deployments → Function Logs
- Проверить VITE_API_URL

**Telegram не открывается:**
- Проверить URL в @BotFather
- Очистить кэш Telegram

---

**Подробная инструкция:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
