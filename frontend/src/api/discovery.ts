import apiClient from './client';

export interface Interest {
  name: string;
  icon: string;
  skill_level?: string;
  want_to_try?: boolean;
}

export interface DiscoveryUser {
  user_id: number;
  name: string;
  age: number | null;
  photos: string[];
  bio: string | null;
  city: string | null;
  interests: Interest[];
  common_interests: any[];
  distance_km: number | null;
  reliability_score: number;
  is_verified: boolean;
}

export interface SwipeResponse {
  success: boolean;
  action: 'like' | 'dislike';
  matched: boolean;
  message: string;
}

export interface DiscoveryFilters {
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  selectedInterests?: number[];
}

export const discoveryApi = {
  // Get users for discovery
  getUsers: async (limit: number = 10, filters?: DiscoveryFilters): Promise<DiscoveryUser[]> => {
    const params: any = { limit };

    if (filters) {
      if (filters.minAge !== undefined) params.min_age = filters.minAge;
      if (filters.maxAge !== undefined) params.max_age = filters.maxAge;
      if (filters.maxDistance !== undefined) params.max_distance = filters.maxDistance;
      if (filters.selectedInterests && filters.selectedInterests.length > 0) {
        params.interest_ids = filters.selectedInterests.join(',');
      }
    }

    const response = await apiClient.get<DiscoveryUser[]>('/discovery/users', { params });
    return response.data;
  },

  // Swipe on a user
  swipe: async (targetUserId: number, action: 'like' | 'dislike'): Promise<SwipeResponse> => {
    const response = await apiClient.post<SwipeResponse>('/discovery/swipe', null, {
      params: {
        target_user_id: targetUserId,
        action,
      },
    });
    return response.data;
  },

  // Reset all swipes (for testing/dev)
  resetSwipes: async (): Promise<{ success: boolean; message: string; swipes_deleted: number }> => {
    const response = await apiClient.delete('/discovery/swipes/reset');
    return response.data;
  },
};
