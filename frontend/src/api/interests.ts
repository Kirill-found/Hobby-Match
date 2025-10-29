import apiClient from './client';

export interface InterestCategory {
  id: number;
  name: string;
  icon: string | null;
  level: number;
  parent_id: number | null;
}

export interface UserInterest {
  id: number;
  category_id: number;
  name: string;
  icon: string | null;
  skill_level: string | null;
  want_to_try: boolean;
}

export const interestsApi = {
  // Get all interest categories
  getCategories: async (level?: number, parentId?: number): Promise<InterestCategory[]> => {
    const params: any = {};
    if (level !== undefined) params.level = level;
    if (parentId !== undefined) params.parent_id = parentId;

    const response = await apiClient.get<InterestCategory[]>('/interests/categories', { params });
    return response.data;
  },

  // Get user's interests
  getUserInterests: async (): Promise<UserInterest[]> => {
    const response = await apiClient.get<UserInterest[]>('/interests/user/interests');
    return response.data;
  },

  // Add user interest
  addUserInterest: async (categoryId: number, skillLevel?: string | null, wantToTry?: boolean): Promise<UserInterest> => {
    const response = await apiClient.post<UserInterest>('/interests/user/interests', {
      category_id: categoryId,
      skill_level: skillLevel,
      want_to_try: wantToTry || false,
    });
    return response.data;
  },

  // Remove user interest
  removeUserInterest: async (categoryId: number): Promise<void> => {
    await apiClient.delete(`/interests/user/interests/${categoryId}`);
  },
};
