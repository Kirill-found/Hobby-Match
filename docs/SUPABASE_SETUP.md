# Настройка Supabase для HobbyMatch

## 1. Создание проекта

1. Перейти на [supabase.com](https://supabase.com)
2. Нажать "Start your project"
3. Войти через GitHub/Google
4. Нажать "New Project"

## 2. Конфигурация проекта

Заполнить форму:
- **Name**: `hobby-match` (или любое имя)
- **Database Password**: сгенерировать сложный пароль (сохранить!)
- **Region**: выбрать ближайший регион (например, Frankfurt)
- **Pricing Plan**: Free (для начала)

Нажать "Create new project"

⏱ Создание проекта занимает ~2 минуты

## 3. Получение Connection String

После создания проекта:

1. Перейти в **Settings** (значок шестеренки слева)
2. Выбрать **Database**
3. Найти секцию **Connection string**
4. Выбрать вкладку **URI**
5. Скопировать строку подключения

Пример:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres
```

⚠️ **Важно:** Замените `[YOUR-PASSWORD]` на ваш реальный пароль БД!

## 4. Добавление в Backend

Открыть `backend/.env` и добавить:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres
```

## 5. Создание таблиц

### Вариант 1: Через SQLAlchemy (рекомендуется)

```bash
cd backend
python
```

```python
from app.database import Base, engine
Base.metadata.create_all(bind=engine)
```

### Вариант 2: Через Supabase SQL Editor

1. В Supabase Dashboard перейти в **SQL Editor**
2. Создать новый query
3. Вставить SQL из `backend/alembic/versions/initial_schema.sql`
4. Запустить

## 6. Проверка подключения

Тест подключения:

```bash
cd backend
python -c "from app.database import engine; print(engine.connect())"
```

Если успешно, увидите: `<sqlalchemy.engine.base.Connection ...>`

## 7. Настройка Alembic (опционально)

Если используете миграции:

```bash
cd backend
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
```

## 8. Просмотр данных в Supabase

1. Перейти в **Table Editor** в Supabase Dashboard
2. Увидите все созданные таблицы
3. Можно просматривать/редактировать данные через UI

## Troubleshooting

### Ошибка: "could not connect to server"

**Решение:**
1. Проверить правильность connection string
2. Проверить что пароль правильный
3. Проверить что интернет подключен
4. Попробовать перезапустить проект в Supabase

### Ошибка: "SSL connection required"

**Решение:**
Добавить `?sslmode=require` в конец DATABASE_URL:

```env
DATABASE_URL=postgresql://...postgres?sslmode=require
```

### Slow queries

Для production добавить индексы:

```sql
-- Supabase SQL Editor
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_swipes_user_id ON swipes(user_id);
CREATE INDEX idx_matches_users ON matches(user1_id, user2_id);
```

## Дополнительные возможности Supabase

### Row Level Security (RLS)

Для дополнительной безопасности можно настроить RLS:

1. Перейти в **Authentication** → **Policies**
2. Включить RLS для нужных таблиц
3. Создать policies для доступа

### Realtime

Для real-time чата:

1. Перейти в **Database** → **Replication**
2. Включить Realtime для таблицы `messages`
3. Использовать Supabase JS client для подписки

### Storage

Для хранения фото можно использовать Supabase Storage вместо Cloudflare R2:

1. Перейти в **Storage**
2. Создать bucket `profile-photos`
3. Настроить политики доступа

## Полезные ссылки

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Connection](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase Python Client](https://supabase.com/docs/reference/python/introduction)
