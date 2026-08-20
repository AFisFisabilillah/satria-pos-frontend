import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService';
import type { TransactionQuery } from '../types/transaction';

export function useTransactions(params?: TransactionQuery) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionService.getAll(params),
  });
}

export function useTransaction(id: number | string) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
  });
}
