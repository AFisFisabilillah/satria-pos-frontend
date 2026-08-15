import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { StockSupply, StockSupplyQuery } from '../types/stockSupply';

export const stockSupplyService = {
  getAll: (params?: StockSupplyQuery) =>
    apiClient
      .get<PaginatedResponse<StockSupply>>('/stock-supply', { params })
      .then((res) => res.data),
};
