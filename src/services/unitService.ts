import { apiClient } from '../lib/apiClient';
import type { Unit, UnitQuery, CreateUnitRequest } from '../types/unit';

export const unitService = {
  getAll: (params?: UnitQuery) =>
    apiClient.get<Unit[]>('/units', { params }).then((res) => res.data),

  create: (data: CreateUnitRequest) =>
    apiClient.post<Unit>('/units', data).then((res) => res.data),
};
