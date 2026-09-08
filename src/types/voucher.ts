export interface VoucherTransaction {
  id: number;
  invoice_number: string;
  total_price: number;
  paid_amount: number;
  change_amount: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items_count?: number | null;
}

export interface Voucher {
  id: number;
  name: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  min_purchase: number;
  quota: number;
  expired_at: string;
  active: number;
  transactions?: VoucherTransaction[];
  created_at: string;
  updated_at: string;
}

export interface CreateVoucherRequest {
  name: string;
  type: 'percent' | 'fixed';
  value: number;
  quota: number;
  min_purchase?: number;
  expired_at: string;
  active: number;
  code: string;
}

export interface VoucherQuery {
  search?: string;
  active?: number;
  minExpired?: string;
  maxExpired?: string;
  minQuota?: number;
  maxQuota?: number;
  size?: number;
  page?: number;
}
