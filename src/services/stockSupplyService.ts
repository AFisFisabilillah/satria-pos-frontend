import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { StockSupply, StockSupplyQuery, CreateStockSupplyRequest } from '../types/stockSupply';

export const stockSupplyService = {
  getAll: (params?: StockSupplyQuery) =>
    apiClient
      .get<PaginatedResponse<StockSupply>>('/stock-supply', { params })
      .then((res) => res.data),

  create: (data: CreateStockSupplyRequest) =>
    apiClient.post<{ data: StockSupply }>('/stock-supply', data).then((res) => res.data.data),
};
