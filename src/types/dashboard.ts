export type DashboardPeriod = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

export interface DashboardQuery {
  period?: DashboardPeriod;
  start_date?: string;
  end_date?: string;
}

export interface DashboardFilter {
  period: string;
  start_date: string | null;
  end_date: string | null;
}

export interface DashboardSales {
  total_transactions: number;
  total_sales: string | number;
  total_cogs: string | number;
  laba_kotor: number;
}

export interface TopProduct {
  id: number;
  name: string;
  total_sold: string | number;
}

export interface TopMember {
  id: number;
  name: string;
  member_code: string;
  total_spent: number;
}

export interface MemberStats {
  total_members: number;
  active_members: number;
  new_members_today: number;
  new_members_period: number;
}

export interface InventoryStats {
  total_stock: string | number;
  total_inventory_value: string | number;
}

export interface SupplierReturnStats {
  total_return_stock: string | number;
  total_return_value: string | number;
}

export interface VoucherStats {
  total_vouchers: number;
  active_vouchers: number;
}

export interface VoucherUsagePeriod {
  total_used: number;
  total_discount: string | number;
}

export interface ChartTransaction {
  id: number;
  total_price: number;
  created_at: string;
}

export interface DashboardResponse {
  filter: DashboardFilter;
  sales: DashboardSales;
  total_product: number;
  top_products: TopProduct[];
  top_members: TopMember[];
  member_stats: MemberStats;
  inventory_stats: InventoryStats;
  supplier_return_stats: SupplierReturnStats;
  adjustment_loss: string | number;
  voucher_stats: VoucherStats;
  voucher_usage_period: VoucherUsagePeriod;
  chart_transactions: ChartTransaction[];
}
