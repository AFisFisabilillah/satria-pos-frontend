import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { Supplier, SupplierQuery, CreateSupplierRequest } from '../types/supplier';

export const supplierService = {
  getAll: (params?: SupplierQuery) =>
    apiClient
      .get<PaginatedResponse<Supplier>>('/supliers', { params })
      .then((res) => res.data),

  create: (data: CreateSupplierRequest) =>
    apiClient.post<{ data: Supplier }>('/supliers', data).then((res) => res.data.data),

  update: (id: number | string, data: Partial<CreateSupplierRequest>) =>
    apiClient.put<{ data: Supplier }>(`/supliers/${id}`, data).then((res) => res.data.data),

  delete: (id: number | string) =>
    apiClient.delete<{ message: string }>(`/supliers/${id}`).then((res) => res.data),

  bulkDelete: (data: { ids: (number | string)[] }) =>
    apiClient.post<{ message: string }>('/supliers/bulk-delete', data).then((res) => res.data),
};
