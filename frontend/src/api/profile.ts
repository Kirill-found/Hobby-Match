import apiClient from './client';

export interface UserProfile {
  id: number;
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  age?: number;
  gender?: string;
  bio?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  availability: string[];
  partner_gender_preference?: string;
  max_distance_km?: number;
  min_age?: number;
  max_age?: number;
  is_premium: boolean;
  reliability_score: number;
  total_meetings: number;
  successful_meetings: number;
  onboarding_completed: boolean;
  created_at: string;
  last_active: string;
}

export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: string;
  bio?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  availability?: string[];
  partner_gender_preference?: string;
  max_distance_km?: number;
  min_age?: number;
  max_age?: number;
}

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/users/profile');
    return response.data;
  },

  updateProfile: async (updates: ProfileUpdate): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>('/users/profile', updates);
    return response.data;
  },

  uploadPhoto: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{ url: string }>('/users/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePhoto: async (photoUrl: string): Promise<void> => {
    await apiClient.delete('/users/photos', { params: { photo_url: photoUrl } });
  },

  reorderPhotos: async (photoUrls: string[]): Promise<{ message: string; photos: string[] }> => {
    const response = await apiClient.put<{ message: string; photos: string[] }>('/users/photos/reorder', photoUrls);
    return response.data;
  },
};
