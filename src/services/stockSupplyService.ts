import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { StockSupply, StockSupplyQuery, CreateStockSupplyRequest, StockSupplyDetail } from '../types/stockSupply';

export const stockSupplyService = {
  getAll: (params?: StockSupplyQuery) =>
    apiClient
      .get<PaginatedResponse<StockSupply>>('/stock-supply', { params })
      .then((res) => res.data),

  getById: (id: number | string) =>
    apiClient.get<{ data: StockSupplyDetail }>(`/stock-supply/${id}`).then((res) => res.data.data),

  create: (data: CreateStockSupplyRequest) =>
    apiClient.post<{ data: StockSupply }>('/stock-supply', data).then((res) => res.data.data),

  update: (id: number | string, data: Partial<CreateStockSupplyRequest>) =>
    apiClient.put<{ data: StockSupply }>(`/stock-supply/${id}`, data).then((res) => res.data.data),

  deleteItem: (id: number | string) =>
    apiClient.delete<{ message: string }>(`/stock-supply-items/${id}`).then((res) => res.data),
};
