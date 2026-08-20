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
};
