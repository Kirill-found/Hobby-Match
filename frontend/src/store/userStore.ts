import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),

      setToken: (token) => {
        localStorage.setItem('access_token', token);
        set({ token });
      },

      setAuth: (token, user) => {
        console.log('[UserStore] setAuth called with token:', token ? `${token.substring(0, 20)}...` : 'null', 'user:', user);
        localStorage.setItem('access_token', token);
        console.log('[UserStore] Token saved to localStorage');
        set({ token, user });
        console.log('[UserStore] Store updated with user and token');

        // Double-check it was saved
        const saved = localStorage.getItem('access_token');
        console.log('[UserStore] Verification - token in localStorage:', saved ? 'Yes' : 'No');
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, token: null });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);
