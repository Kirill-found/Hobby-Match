import apiClient from './client';

export interface InterestCategory {
  id: number;
  name: string;
  icon: string | null;
  level: number;
  parent_id: number | null;
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
};
