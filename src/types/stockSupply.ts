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

export interface StockSupplyProductPayload {
  product_id: number;
  quantity_in: number;
  purchase_price: number;
  expired_date?: string;
}

export interface CreateStockSupplyRequest {
  suplier_id?: number;
  invoice_number?: string;
  notes?: string;
  products: StockSupplyProductPayload[];
}
