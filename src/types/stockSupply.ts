export interface StockSupply {
  id: number;
  invoice_number: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  suplier?: string;
}

export interface StockSupplyQuery {
  search?: string;
  startDate?: string;
  endDate?: string;
  size?: number;
  page?: number;
}
