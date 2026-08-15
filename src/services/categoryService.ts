import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { Category, CategoryQuery, CreateCategoryRequest } from '../types/category';

export const categoryService = {
  getAll: (params?: CategoryQuery) =>
    apiClient.get<PaginatedResponse<Category>>('/categories', { params }).then((res) => res.data),

  create: (data: CreateCategoryRequest) =>
    apiClient.post<{ data: Category }>('/categories', data).then((res) => res.data.data),

  update: (id: number | string, data: Partial<CreateCategoryRequest>) =>
    apiClient.patch<{ data: Category }>(`/categories/${id}`, data).then((res) => res.data.data),

  delete: (id: number) =>
    apiClient.delete<{ message: string }>(`/categories/${id}`).then((res) => res.data),
};
