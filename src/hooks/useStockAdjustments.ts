import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockAdjustmentService } from '../services/stockAdjustmentService';
import type { StockAdjustmentQuery, CreateStockAdjustmentRequest } from '../types/stockAdjustment';

export function useStockAdjustments(params?: StockAdjustmentQuery) {
  return useQuery({
    queryKey: ['stock-adjustments', params],
    queryFn: () => stockAdjustmentService.getAll(params),
  });
}

export function useStockAdjustment(id: string | number) {
  return useQuery({
    queryKey: ['stock-adjustments', id],
    queryFn: () => stockAdjustmentService.getById(id),
    enabled: !!id,
  });
}

export function useCreateStockAdjustment(options?: {
  onSuccess?: () => void;
  onError?: (err: any) => void;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStockAdjustmentRequest) => stockAdjustmentService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock-adjustments'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['stockSupplies'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
