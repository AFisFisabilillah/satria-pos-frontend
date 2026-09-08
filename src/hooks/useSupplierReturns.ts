import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierReturnService } from '../services/supplierReturnService';
import type { SupplierReturnQuery, CreateSupplierReturnRequest } from '../types/supplierReturn';

export function useSupplierReturns(params?: SupplierReturnQuery) {
  return useQuery({
    queryKey: ['supplier-returns', params],
    queryFn: () => supplierReturnService.getAll(params),
  });
}

export function useSupplierReturn(id: string | number) {
  return useQuery({
    queryKey: ['supplier-returns', id],
    queryFn: () => supplierReturnService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSupplierReturn(options?: {
  onSuccess?: () => void;
  onError?: (err: any) => void;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupplierReturnRequest) => supplierReturnService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['supplier-returns'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['stock-supplies'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
