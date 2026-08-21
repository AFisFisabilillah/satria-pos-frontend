export interface TransactionItem {
  id: number;
  quantity: number;
  selling_price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  transaction_id: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

export interface TransactionMember {
  id: number;
  name: string;
  member_code: string;
  phone: string;
  email: string;
  total_spent: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransactionVoucher {
  id: number;
  name: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  min_purchase: number;
  quota: number;
  expired_at: string;
  active: number | boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  invoice_number: string;
  total_price: number;
  paid_amount: number;
  change_amount: number;
  payment_method: 'cash' | 'qris' | 'transfer';
  created_at: string;
  updated_at: string;
  items_count: number;
  items?: TransactionItem[];
  member?: TransactionMember | null;
  vouchers?: TransactionVoucher[];
}

export interface TransactionQuery {
  search?: string;
  start_date?: string;
  end_date?: string;
  payment_method?: string;
  min_total?: number;
  max_total?: number;
  sort_by?: 'created_at' | 'total_price';
  sort_direction?: 'asc' | 'desc';
  size?: number;
  page?: number;
}
