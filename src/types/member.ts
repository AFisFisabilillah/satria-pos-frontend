export interface MemberTransaction {
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

export interface Member {
  id: number;
  name: string;
  member_code: string;
  phone?: string;
  email?: string;
  total_spent: number;
  active: boolean;
  transaction?: MemberTransaction[];
  created_at: string;
  updated_at: string;
}

export interface CreateMemberRequest {
  name: string;
  phone?: string;
  email?: string;
  active?: boolean;
}

export interface MemberQuery {
  name?: string;
  active?: boolean | string;
  min_total_spent?: number;
  max_total_spent?: number;
  size?: number;
  page?: number;
}
