export type PaymentMethod = 'cash' | 'qris' | 'transfer';

export interface CheckoutProductPayload {
  product_id: number;
  quantity: number;
}

export interface CheckoutRequest {
  member_id?: number;
  paid_amount: number;
  payment_method: PaymentMethod;
  products: CheckoutProductPayload[];
  vouchers?: number[];
}

export interface CheckoutResponseData {
  id: number;
  invoice_number: string;
  total_price: number;
  paid_amount: number;
  change_amount: number;
  payment_method: PaymentMethod;
  items_count: number;
}

export interface CheckoutResponse {
  data: CheckoutResponseData;
  message?: string;
  error?: string;
}

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  image?: string;
}
