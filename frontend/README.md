# HobbyMatch Frontend

React + TypeScript frontend для HobbyMatch - Telegram Mini App для поиска партнеров по хобби.

## Технологии

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **Tailwind CSS** - стилизация
- **React Router** - роутинг
- **Zustand** - state management
- **React Query** - data fetching
- **Axios** - HTTP client
- **Telegram WebApp SDK** - интеграция с Telegram

## Установка

### 1. Установить зависимости

```bash
npm install
```

### 2. Настроить переменные окружения

Скопировать `.env.example` в `.env`:

```bash
cp .env.example .env
```

Заполнить:
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
```

### 3. Запустить dev server

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`

## Структура проекта

```
frontend/
├── src/
│   ├── api/              # API клиенты
│   │   ├── client.ts     # Axios instance
│   │   └── auth.ts       # Auth API
│   ├── components/       # React компоненты
│   │   ├── common/       # Общие компоненты
│   │   ├── onboarding/   # Онбординг
│   │   ├── discovery/    # Свайп карточки
│   │   ├── matches/      # Матчи
│   │   ├── chat/         # Чат
│   │   └── profile/      # Профиль
│   ├── hooks/            # Custom hooks
│   │   └── useTelegramWebApp.ts
│   ├── pages/            # Страницы
│   │   ├── OnboardingPage.tsx
│   │   └── DiscoveryPage.tsx
│   ├── store/            # Zustand stores
│   │   └── userStore.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── utils/            # Утилиты
│   ├── App.tsx           # Main App
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Статические файлы
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Preview production build
npm run preview

# Линтинг
npm run lint
```

## Разработка с Telegram

### Локальная разработка

Для тестирования Telegram Mini App локально используйте ngrok:

```bash
# Установить ngrok
npm install -g ngrok

# Запустить туннель
ngrok http 5173
```

Затем используйте HTTPS URL от ngrok в настройках бота через @BotFather.

### Открытие в Telegram

1. Создать бота через @BotFather
2. Настроить Web App с ngrok URL
3. Открыть бота в Telegram
4. Нажать кнопку "Открыть приложение"

## Следующие шаги

1. ✅ Базовая структура
2. ✅ Аутентификация через Telegram
3. ✅ Базовые страницы
4. 🔄 Онбординг флоу
5. 🔄 Discovery (swipe) функционал
6. 🔄 Matches & Chat
7. 🔄 Profile & Settings

## TypeScript

Проект использует строгую типизацию. Все типы находятся в `src/types/index.ts`.

## Стилизация

- Tailwind CSS для утилитарных классов
- CSS переменные Telegram для темизации
- Responsive design
