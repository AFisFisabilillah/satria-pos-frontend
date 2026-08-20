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
}

export interface TransactionQuery {
  search?: string;
  start_date?: string;
  end_date?: string;
  size?: number;
  page?: number;
}
