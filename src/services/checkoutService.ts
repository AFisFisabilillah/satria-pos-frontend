import { apiClient } from '../lib/apiClient';
import type { CheckoutRequest, CheckoutResponse } from '../types/checkout';

export const checkoutService = {
  processCheckout: (data: CheckoutRequest) =>
    apiClient.post<CheckoutResponse>('/checkout', data).then((res) => res.data),
};
