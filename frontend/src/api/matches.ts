import apiClient from './client';

export interface MatchUser {
  user_id: number;
  name: string;
  age: number | null;
  photos: string[];
  bio: string | null;
  common_interests: any[];
  distance_km: number | null;
  reliability_score: number;
  is_verified: boolean;
  matched_at: string;
}

export const matchesApi = {
  // Get all matches
  getMatches: async (): Promise<MatchUser[]> => {
    const response = await apiClient.get<MatchUser[]>('/matches/');
    return response.data;
  },

  // Unmatch with a user
  unmatch: async (matchId: number): Promise<void> => {
    await apiClient.delete(`/matches/${matchId}`);
  },
};
