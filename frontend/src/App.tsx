import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserStore } from './store/userStore';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import { authApi } from './api/auth';

// Pages
import OnboardingPage from './pages/OnboardingPage';
import DiscoveryPage from './pages/DiscoveryPage';

const queryClient = new QueryClient();

function App() {
  const { user, setAuth, isLoading } = useUserStore();
  const { isReady, initData } = useTelegramWebApp();

  useEffect(() => {
    const authenticate = async () => {
      if (!initData) {
        console.warn('No Telegram initData available');
        return;
      }

      try {
        console.log('[App] Authenticating with Telegram...');
        const response = await authApi.telegramLogin(initData);
        console.log('[App] Authentication successful:', {
          hasToken: !!response.access_token,
          user: response.user,
        });
        setAuth(response.access_token, response.user);
        console.log('[App] Token saved to localStorage');
      } catch (error) {
        console.error('[App] Authentication failed:', error);
      }
    };

    if (isReady && !user) {
      authenticate();
    }
  }, [isReady, initData, user, setAuth]);

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-telegram-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telegram-button mx-auto mb-4"></div>
          <p className="text-telegram-hint">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app-container min-h-screen bg-telegram-bg">
          <Routes>
            <Route
              path="/"
              element={
                user?.onboarding_completed ? (
                  <Navigate to="/discovery" replace />
                ) : (
                  <OnboardingPage />
                )
              }
            />
            <Route path="/discovery" element={<DiscoveryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
