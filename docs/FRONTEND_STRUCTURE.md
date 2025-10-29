# Frontend Structure

## Структура директорий
```
frontend/
├── public/
│   └── icon.png
│
├── src/
│   ├── assets/              # Статические файлы
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/          # React компоненты
│   │   ├── common/          # Общие компоненты
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── Avatar.tsx
│   │   │
│   │   ├── onboarding/
│   │   │   ├── Welcome.tsx
│   │   │   ├── BasicInfo.tsx
│   │   │   ├── PhotoUpload.tsx
│   │   │   ├── LocationPicker.tsx
│   │   │   ├── CategorySelector.tsx
│   │   │   ├── InterestTree.tsx
│   │   │   ├── SkillLevelPicker.tsx
│   │   │   ├── RecommendationsCarousel.tsx
│   │   │   ├── AvailabilityPicker.tsx
│   │   │   └── CompletionScreen.tsx
│   │   │
│   │   ├── discovery/
│   │   │   ├── SwipeCard.tsx
│   │   │   ├── SwipeDeck.tsx
│   │   │   ├── MatchModal.tsx
│   │   │   ├── FilterModal.tsx
│   │   │   ├── NoMoreCards.tsx
│   │   │   └── SwipeButtons.tsx
│   │   │
│   │   ├── matches/
│   │   │   ├── MatchList.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   └── EmptyMatches.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── MeetingProposal.tsx
│   │   │   └── RatingModal.tsx
│   │   │
│   │   ├── profile/
│   │   │   ├── MyProfile.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   ├── EditProfile.tsx
│   │   │   ├── InterestBadge.tsx
│   │   │   └── ReliabilityScore.tsx
│   │   │
│   │   └── premium/
│   │       ├── PremiumFeatures.tsx
│   │       ├── PricingCard.tsx
│   │       └── PaywallModal.tsx
│   │
│   ├── pages/               # Страницы (роуты)
│   │   ├── OnboardingPage.tsx
│   │   ├── DiscoveryPage.tsx
│   │   ├── MatchesPage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── EditProfilePage.tsx
│   │   ├── UserProfilePage.tsx
│   │   ├── PremiumPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useTelegramWebApp.ts
│   │   ├── useSwipe.ts
│   │   ├── useGeolocation.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── useDebounce.ts
│   │
│   ├── store/               # Zustand state management
│   │   ├── userStore.ts
│   │   ├── swipeStore.ts
│   │   ├── matchStore.ts
│   │   ├── chatStore.ts
│   │   └── uiStore.ts
│   │
│   ├── api/                 # API client
│   │   ├── client.ts        # Axios instance
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── interests.ts
│   │   ├── discovery.ts
│   │   ├── matches.ts
│   │   ├── messages.ts
│   │   ├── meetings.ts
│   │   └── payments.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── user.ts
│   │   ├── interest.ts
│   │   ├── swipe.ts
│   │   ├── match.ts
│   │   ├── message.ts
│   │   └── telegram.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── date.ts
│   │   ├── distance.ts
│   │   ├── validation.ts
│   │   └── analytics.ts
│   │
│   ├── constants/           # Constants
│   │   ├── routes.ts
│   │   ├── skillLevels.ts
│   │   └── config.ts
│   │
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Ключевые файлы

### src/main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize Telegram WebApp
if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready()
  window.Telegram.WebApp.expand()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### src/App.tsx
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUserStore } from './store/userStore'
import { useTelegramWebApp } from './hooks/useTelegramWebApp'

// Pages
import OnboardingPage from './pages/OnboardingPage'
import DiscoveryPage from './pages/DiscoveryPage'
import MatchesPage from './pages/MatchesPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'

const queryClient = new QueryClient()

function App() {
  const { user, isLoading } = useUserStore()
  const { isReady } = useTelegramWebApp()

  if (!isReady || isLoading) {
    return <div>Loading...</div>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route 
              path="/" 
              element={
                user?.onboarding_completed 
                  ? <Navigate to="/discovery" /> 
                  : <OnboardingPage />
              } 
            />
            <Route path="/discovery" element={<DiscoveryPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/chat/:matchId" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
```

### src/hooks/useTelegramWebApp.ts
```typescript
import { useEffect, useState } from 'react'

export const useTelegramWebApp = () => {
  const [isReady, setIsReady] = useState(false)
  const [webApp, setWebApp] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      setWebApp(tg)
      setIsReady(true)
    }
  }, [])

  return {
    webApp,
    isReady,
    user: webApp?.initDataUnsafe.user,
    initData: webApp?.initData || '',
    platform: webApp?.platform,
    colorScheme: webApp?.colorScheme,
  }
}
```

### src/store/userStore.ts
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/user'

interface UserState {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'user-storage',
    }
  )
)
```

### src/api/client.ts
```typescript
import axios from 'axios'
import { useUserStore } from '../store/userStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = useUserStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors (logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useUserStore.getState().logout()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        telegram: {
          bg: 'var(--tg-theme-bg-color)',
          text: 'var(--tg-theme-text-color)',
          hint: 'var(--tg-theme-hint-color)',
          link: 'var(--tg-theme-link-color)',
          button: 'var(--tg-theme-button-color)',
          buttonText: 'var(--tg-theme-button-text-color)',
        },
      },
    },
  },
  plugins: [],
}
```

### src/types/user.ts
```typescript
export interface User {
  id: number
  telegram_id: number
  username?: string
  first_name: string
  last_name?: string
  age: number
  gender: string
  bio: string
  city: string
  district?: string
  latitude: number
  longitude: number
  photos: string[]
  interests: Interest[]
  availability: string[]
  partner_gender_preference: string
  is_premium: boolean
  reliability_score: number
  onboarding_completed: boolean
  created_at: string
  last_active: string
}

export interface Interest {
  id: number
  category_id: number
  name: string
  icon: string
  skill_level?: string
  want_to_try: boolean
}
```