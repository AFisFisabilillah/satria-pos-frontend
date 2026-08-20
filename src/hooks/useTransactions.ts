import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService';
import type { TransactionQuery } from '../types/transaction';

export function useTransactions(params?: TransactionQuery) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionService.getAll(params),
  });
}
