import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { Voucher, VoucherQuery, CreateVoucherRequest } from '../types/voucher';

export const voucherService = {
  getAll: (params?: VoucherQuery) =>
    apiClient
      .get<PaginatedResponse<Voucher>>('/voucher', { params })
      .then((res) => res.data),

  create: (data: CreateVoucherRequest) =>
    apiClient
      .post<{ data: Voucher }>('/voucher', data)
      .then((res) => res.data.data),

  getById: (id: number | string) =>
    apiClient.get<{ data: Voucher }>(`/voucher/${id}`).then((res) => res.data.data),

  update: (id: number | string, data: Partial<CreateVoucherRequest>) =>
    apiClient.put<{ data: Voucher }>(`/voucher/${id}`, data).then((res) => res.data.data),

  toggleActive: (id: number | string) =>
    apiClient.patch<{ status: string; message: string }>(`/voucher/${id}/toggle-active`).then((res) => res.data),

  bulkToggleActive: (data: { ids: (number | string)[] }) =>
    apiClient.patch<{ message: string }>('/voucher/bulk-toggle-active', data).then((res) => res.data),

  delete: (id: number | string) =>
    apiClient.delete<{ message: string }>(`/voucher/${id}`).then((res) => res.data),
};
