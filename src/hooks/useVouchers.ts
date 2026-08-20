import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { voucherService } from '../services/voucherService';
import type { VoucherQuery, CreateVoucherRequest } from '../types/voucher';

export function useVouchers(params?: VoucherQuery) {
  return useQuery({
    queryKey: ['vouchers', params],
    queryFn: () => voucherService.getAll(params),
  });
}

export function useCreateVoucher(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVoucherRequest) => voucherService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}

export function useVoucher(id: number | string) {
  return useQuery({
    queryKey: ['voucher', id],
    queryFn: () => voucherService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateVoucher(id: number | string, options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateVoucherRequest>) => voucherService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['voucher', id] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}

export function useToggleVoucher(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => voucherService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}

export function useBulkToggleVouchers(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { ids: (number | string)[] }) => voucherService.bulkToggleActive(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}

export function useDeleteVoucher(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => voucherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}
