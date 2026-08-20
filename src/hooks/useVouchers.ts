import { useQuery } from '@tanstack/react-query';
import { voucherService } from '../services/voucherService';
import type { VoucherQuery } from '../types/voucher';

export function useVouchers(params?: VoucherQuery) {
  return useQuery({
    queryKey: ['vouchers', params],
    queryFn: () => voucherService.getAll(params),
  });
}
