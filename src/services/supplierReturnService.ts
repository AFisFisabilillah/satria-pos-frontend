import { apiClient } from '../lib/apiClient';
import type {
  SupplierReturn,
  SupplierReturnQuery,
  CreateSupplierReturnRequest,
} from '../types/supplierReturn';
import type { PaginatedResponse } from '../types/api';

export const supplierReturnService = {
  getAll: (params?: SupplierReturnQuery) =>
    apiClient
      .get<PaginatedResponse<SupplierReturn>>('/supplier-returns', { params })
      .then((res) => res.data),

  getById: (id: string | number) =>
    apiClient
      .get<{ data: SupplierReturn }>(`/supplier-returns/${id}`)
      .then((res) => res.data.data),

  create: (data: CreateSupplierReturnRequest) =>
    apiClient
      .post<SupplierReturn>('/supplier-returns', data)
      .then((res) => res.data),
};
