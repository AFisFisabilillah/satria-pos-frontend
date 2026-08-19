import type { Supplier } from './supplier';

export interface StockSupply {
  id: number;
  invoice_number: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  suplier?: string;
  total_items_quantity?: number;
  total_item_types?: number;
}

export interface StockSupplyQuery {
  search?: string;
  startDate?: string;
  endDate?: string;
  size?: number;
  page?: number;
}

export interface StockSupplyProductPayload {
  id?: number; // Added for PUT request matching existing items
  product_id: number;
  quantity_in: number;
  purchase_price: number;
  expired_date?: string;
}

export interface StockSupplyDetailItem {
  id: number;
  quantity_in: number;
  quantity_remaining: number;
  purchase_price: string;
  expired_at?: string;
  created_at: string;
  updated_at: string;
  product_summary: {
    id: number;
    name: string;
    image?: string;
  };
}

export interface StockSupplyDetail {
  id: number;
  invoice_number: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  suplier?: Supplier;
  items: StockSupplyDetailItem[];
}

export interface CreateStockSupplyRequest {
  suplier_id?: number;
  invoice_number?: string;
  notes?: string;
  products: StockSupplyProductPayload[];
}
