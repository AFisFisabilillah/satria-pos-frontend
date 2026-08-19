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

export function useStockSupply(id: number | string) {
  return useQuery({
    queryKey: ['stockSupplies', id],
    queryFn: () => stockSupplyService.getById(id),
    enabled: !!id,
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

export function useUpdateStockSupply(id: number | string, options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateStockSupplyRequest>) => stockSupplyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockSupplies'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}

export function useDeleteStockSupply(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => stockSupplyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockSupplies'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}

export function useDeleteStockSupplyItem(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number | string) => stockSupplyService.deleteItem(itemId),
    onSuccess: () => {
      // Invalidate both lists and details
      queryClient.invalidateQueries({ queryKey: ['stockSupplies'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}
