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
}

export interface TransactionQuery {
  search?: string;
  start_date?: string;
  end_date?: string;
  size?: number;
  page?: number;
}
