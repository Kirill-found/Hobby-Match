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

  console.log('[App] Render - isReady:', isReady, 'user:', user ? 'exists' : 'null', 'initData:', initData ? 'exists' : 'null');

  useEffect(() => {
    console.log('[App] useEffect triggered - isReady:', isReady, 'user:', user ? 'exists' : 'null', 'initData:', initData ? 'exists' : 'null');

    const authenticate = async () => {
      if (!initData) {
        console.warn('[App] No Telegram initData available - skipping authentication');
        return;
      }

      try {
        console.log('[App] Authenticating with Telegram...');
        console.log('[App] initData length:', initData.length);
        const response = await authApi.telegramLogin(initData);
        console.log('[App] Authentication successful:', {
          hasToken: !!response.access_token,
          tokenLength: response.access_token?.length,
          user: response.user,
        });
        setAuth(response.access_token, response.user);
        console.log('[App] Token saved to localStorage');

        // Verify token was saved
        const savedToken = localStorage.getItem('access_token');
        console.log('[App] Token verification - saved:', savedToken ? 'Yes' : 'No', 'length:', savedToken?.length);
      } catch (error) {
        console.error('[App] Authentication failed:', error);
      }
    };

    if (isReady && !user) {
      console.log('[App] Conditions met - calling authenticate()');
      authenticate();
    } else {
      console.log('[App] Conditions NOT met - isReady:', isReady, 'user:', user ? 'exists' : 'null');
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
