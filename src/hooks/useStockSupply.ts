import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { stockSupplyService } from '../services/stockSupplyService';
import type { StockSupplyQuery, CreateStockSupplyRequest } from '../types/stockSupply';

export function useStockSupplies(params?: StockSupplyQuery) {
  return useQuery({
    queryKey: ['stockSupplies', params],
    queryFn: () => stockSupplyService.getAll(params),
  });
}

export function useCreateStockSupply(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStockSupplyRequest) => stockSupplyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockSupplies'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}
