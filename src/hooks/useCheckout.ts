import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { checkoutService } from '../services/checkoutService';
import type { CheckoutRequest, CheckoutResponse } from '../types/checkout';

export function useCheckout(options?: {
  onSuccess?: (data: CheckoutResponse) => void;
  onError?: (error: AxiosError<{ message?: string; error?: string }>) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CheckoutRequest) => checkoutService.processCheckout(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      options?.onSuccess?.(res);
    },
    onError: (error: AxiosError<{ message?: string; error?: string }>) => {
      options?.onError?.(error);
    },
  });
}
