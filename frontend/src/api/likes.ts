import apiClient from './client';

export interface LikedUser {
  user_id: number;
  name: string;
  age: number | null;
  photos: string[];
  bio: string | null;
  interests: any[];
  distance_km: number | null;
  reliability_score: number;
  is_verified: boolean;
  liked_at: string;
}

export const likesApi = {
  /**
   * Get all users that current user has liked
   */
  getLikes: async (): Promise<LikedUser[]> => {
    const response = await apiClient.get<LikedUser[]>('/likes/');
    return response.data;
  },

  /**
   * Unlike a user (remove like)
   */
  unlikeUser: async (userId: number): Promise<void> => {
    await apiClient.delete(`/likes/${userId}`);
  },
};
