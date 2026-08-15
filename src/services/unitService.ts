import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { Unit, UnitQuery, CreateUnitRequest } from '../types/unit';

export const unitService = {
  getAll: (params?: UnitQuery) =>
    apiClient.get<PaginatedResponse<Unit>>('/units', { params }).then((res) => res.data),

  create: (data: CreateUnitRequest) =>
    apiClient.post<Unit>('/units', data).then((res) => res.data),

  update: (id: number | string, data: Partial<CreateUnitRequest>) =>
    apiClient.patch<{ data: Unit }>(`/units/${id}`, data).then((res) => res.data.data),

  delete: (id: number) =>
    apiClient.delete<{ message: string }>(`/units/${id}`).then((res) => res.data),
};
