import { apiClient } from '../lib/apiClient';
import type { User, UserQuery, CreateUserRequest } from '../types/user';

export const userService = {
  getProfile: () =>
    apiClient.get<{ data: User }>('/user').then((res) => res.data.data),

  getAll: (params?: UserQuery) =>
    apiClient.get<{ data: User[] }>('/users', { params }).then((res) => res.data),

  getById: (id: number | string) =>
    apiClient.get<{ data: User }>(`/users/${id}`).then((res) => res.data.data),

  create: (data: CreateUserRequest) =>
    apiClient.post<{ data: User }>('/users', data).then((res) => res.data.data),

  update: (id: number | string, data: Partial<CreateUserRequest>) =>
    apiClient.put<{ data: User }>(`/users/${id}`, data).then((res) => res.data.data),

  delete: (id: number | string) =>
    apiClient.delete<{ message: string }>(`/users/${id}`).then((res) => res.data),
};
