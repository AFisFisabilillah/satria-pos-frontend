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
