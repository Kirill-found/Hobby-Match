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

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/users/profile', updates);
    return response.data;
  },

  // Complete onboarding
  completeOnboarding: async (): Promise<{ message: string; user: { onboarding_completed: boolean } }> => {
    const response = await apiClient.post('/users/onboarding/complete');
    return response.data;
  },
};
