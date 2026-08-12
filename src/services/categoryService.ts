import { apiClient } from '../lib/apiClient';
import type { Category, CategoryQuery, CreateCategoryRequest } from '../types/category';

export const categoryService = {
  getAll: (params?: CategoryQuery) =>
    apiClient.get<{ data: Category[] }>('/categories', { params }).then((res) => res.data.data),

  create: (data: CreateCategoryRequest) =>
    apiClient.post<{ data: Category }>('/categories', data).then((res) => res.data.data),
};
