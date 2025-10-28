# Настройка Telegram Бота для HobbyMatch

## 1. Создание бота через BotFather

### Шаг 1: Открыть BotFather

1. Открыть Telegram
2. Найти [@BotFather](https://t.me/BotFather)
3. Нажать "Start"

### Шаг 2: Создать нового бота

Отправить команду:
```
/newbot
```

BotFather спросит:
1. **Имя бота** (отображаемое): `HobbyMatch`
2. **Username бота** (должен заканчиваться на `bot`): `hobbymatch_bot` или `your_unique_name_bot`

⚠️ Username должен быть уникальным. Если занят, попробуйте другой.

### Шаг 3: Сохранить токен

После создания получите токен:
```
Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
```

🔒 **Важно:** Сохраните токен в безопасном месте!

## 2. Настройка бота

### Установить описание

```
/setdescription
```

Затем отправить:
```
Найди партнера для спорта и хобби! 🤝
Свайпы, матчи, встречи - как в знакомствах, но для активностей.
```

### Установить короткое описание

```
/setabouttext
```

Затем отправить:
```
Найди партнера для твоего хобби через swipe-механику! 🎯
```

### Загрузить фото профиля

```
/setuserpic
```

Затем загрузить изображение 512x512px с логотипом/аватаром бота.

## 3. Создание Web App

### Шаг 1: Создать Mini App

```
/newapp
```

BotFather спросит:
1. Выбрать бота (если у вас несколько)
2. **Title**: `HobbyMatch`
3. **Description**:
```
Найди партнера для спорта и хобби!

Функции:
🎯 Свайпы по карточкам
💬 Чат после матча
📍 Поиск рядом
⭐ Рейтинг надежности

Присоединяйся!
```

4. **Photo**: загрузить квадратное фото 640x360px
5. **Demo GIF** (опционально): можно пропустить

### Шаг 2: Указать Web App URL

BotFather попросит URL.

**Для локальной разработки:**

1. Установить ngrok:
```bash
npm install -g ngrok
```

2. Запустить ngrok:
```bash
ngrok http 5173
```

3. Скопировать HTTPS URL (например: `https://abc123.ngrok.io`)
4. Отправить BotFather этот URL

**Для production:**

Использовать URL вашего деплоя (Vercel/Cloudflare Pages):
```
https://hobbymatch.vercel.app
```

### Шаг 3: Установить Short Name

```
/setappshortname
```

Короткое имя (латиница): `hobby_match` или `hobbymatch`

Это создаст прямую ссылку: `https://t.me/your_bot/hobby_match`

## 4. Настройка Backend

Добавить токен в `backend/.env`:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
```

## 5. Настройка Frontend

Добавить username бота в `frontend/.env`:

```env
VITE_TELEGRAM_BOT_USERNAME=hobbymatch_bot
```

## 6. Тестирование

### Локальное тестирование с ngrok

1. Запустить backend:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

2. Запустить frontend:
```bash
cd frontend
npm run dev
```

3. Запустить ngrok:
```bash
ngrok http 5173
```

4. Обновить URL в BotFather (если изменился)

5. Открыть бота в Telegram

6. Нажать кнопку "Открыть приложение" или отправить команду `/start`

### Проверка работы

Если все настроено правильно:
- ✅ Приложение открывается в Telegram
- ✅ Видна страница онбординга
- ✅ В консоли браузера нет ошибок
- ✅ Backend получает запросы

## 7. Дополнительные настройки (опционально)

### Настроить команды

```
/setcommands
```

Затем отправить список команд:
```
start - Открыть приложение
help - Помощь
settings - Настройки
```

### Включить Inline Mode

Для расшаривания профиля:
```
/setinline
```

### Настроить Menu Button

Кнопка в меню (вместо ⌨️):
```
/setmenubutton
```

Выбрать "Configure menu button" → "Send URL" → указать Web App URL

## 8. Безопасность

### Проверка initData

Backend автоматически проверяет подлинность данных через `validate_telegram_init_data()`.

Это защищает от:
- Подделки данных пользователя
- Несанкционированного доступа
- MITM атак

### Что НЕ делать

❌ Не публикуйте токен бота в GitHub
❌ Не передавайте токен третьим лицам
❌ Не отключайте валидацию initData в production

## Troubleshooting

### Ошибка: "WebAppInvalidInit"

**Решение:**
1. Проверить что URL в BotFather правильный
2. Проверить что frontend запущен по HTTPS (ngrok)
3. Очистить кэш Telegram (Settings → Data → Clear Cache)

### Приложение не открывается

**Решение:**
1. Проверить что Web App создан через `/newapp`
2. Проверить что URL доступен (открыть в браузере)
3. Проверить что нет ошибок CORS на backend
4. Попробовать другой браузер/телефон

### Backend не получает запросы

**Решение:**
1. Проверить что `VITE_API_URL` в frontend `.env` правильный
2. Проверить что backend запущен
3. Проверить CORS настройки в `backend/app/main.py`
4. Открыть Developer Tools в Telegram Desktop

### Ошибка аутентификации

**Решение:**
1. Проверить что `TELEGRAM_BOT_TOKEN` в backend `.env` правильный
2. Проверить что `validate_telegram_init_data()` работает
3. Попробовать закрыть и снова открыть приложение

## Полезные ссылки

- [Telegram Bots Documentation](https://core.telegram.org/bots)
- [Telegram Web Apps Guide](https://core.telegram.org/bots/webapps)
- [BotFather Commands](https://core.telegram.org/bots/features#botfather)
- [Telegram Web Apps JS](https://core.telegram.org/bots/webapps#initializing-mini-apps)

## Следующие шаги

После настройки бота:
1. ✅ Протестировать аутентификацию
2. ✅ Проверить работу основных функций
3. 🔄 Развернуть на production
4. 🔄 Настроить уведомления
5. 🔄 Добавить команды бота
