import { apiClient } from '../lib/apiClient';
import type {
  StockAdjustment,
  StockAdjustmentQuery,
  CreateStockAdjustmentRequest,
} from '../types/stockAdjustment';
import type { PaginatedResponse } from '../types/api';

export const stockAdjustmentService = {
  getAll: (params?: StockAdjustmentQuery) =>
    apiClient
      .get<PaginatedResponse<StockAdjustment>>('/stock-adjustments', { params })
      .then((res) => res.data),

  getById: (id: string | number) =>
    apiClient
      .get<{ data: StockAdjustment }>(`/stock-adjustments/${id}`)
      .then((res) => res.data.data),

  create: (data: CreateStockAdjustmentRequest) =>
    apiClient
      .post<StockAdjustment>('/stock-adjustments', data)
      .then((res) => res.data),
};
