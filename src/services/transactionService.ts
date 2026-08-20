import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { Transaction, TransactionQuery } from '../types/transaction';

export const transactionService = {
  getAll: (params?: TransactionQuery) =>
    apiClient
      .get<PaginatedResponse<Transaction>>('/transactions', { params })
      .then((res) => res.data),
};
