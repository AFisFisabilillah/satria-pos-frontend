import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { Voucher, VoucherQuery } from '../types/voucher';

export const voucherService = {
  getAll: (params?: VoucherQuery) =>
    apiClient
      .get<PaginatedResponse<Voucher>>('/voucher', { params })
      .then((res) => res.data),
};
