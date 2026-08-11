import { apiClient } from '../lib/apiClient';
import type { LoginRequest, LoginResponse, User } from '../types/auth';

export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/login', data).then((res) => res.data),
  getMe: () => apiClient.get<{ data: User }>('/user').then((res) => res.data.data),
};
