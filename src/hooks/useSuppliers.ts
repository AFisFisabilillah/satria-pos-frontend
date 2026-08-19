import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { supplierService } from '../services/supplierService';
import type { SupplierQuery, CreateSupplierRequest } from '../types/supplier';

export function useSuppliers(params?: SupplierQuery) {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => supplierService.getAll(params),
  });
}

export function useSupplier(id: number | string) {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => supplierService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSupplier(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupplierRequest) => supplierService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => options?.onError?.(error),
  });
}

export function useUpdateSupplier(id: number | string, options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateSupplierRequest>) => supplierService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => options?.onError?.(error),
  });
}

export function useDeleteSupplier(options?: { onSuccess?: () => void; onError?: (error: AxiosError) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => supplierService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => options?.onError?.(error),
  });
}

export function useBulkDeleteSuppliers(options?: { onSuccess?: () => void; onError?: (error: AxiosError) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { ids: (number | string)[] }) => supplierService.bulkDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => options?.onError?.(error),
  });
}
