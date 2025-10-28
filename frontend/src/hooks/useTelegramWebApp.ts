import { useEffect, useState } from 'react';
import type { TelegramWebApp } from '../types';

export const useTelegramWebApp = () => {
  const [isReady, setIsReady] = useState(false);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      setWebApp(tg);
      setIsReady(true);

      // Set theme colors
      document.documentElement.style.setProperty(
        '--tg-theme-bg-color',
        tg.colorScheme === 'dark' ? '#1a1a1a' : '#ffffff'
      );
    } else {
      // For development without Telegram
      console.warn('Telegram WebApp not available. Running in development mode.');
      setIsReady(true);
    }
  }, []);

  return {
    webApp,
    isReady,
    user: webApp?.initDataUnsafe.user,
    initData: webApp?.initData || '',
    platform: webApp?.platform,
    colorScheme: webApp?.colorScheme,
  };
};
