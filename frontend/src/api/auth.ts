import apiClient from './client';
import type { AuthResponse, User } from '../types';

export const authApi = {
  // Login via Telegram WebApp
  telegramLogin: async (initData: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/telegram-login', {
      init_data: initData,
    });
    return response.data;
  },

  // Get current user
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
