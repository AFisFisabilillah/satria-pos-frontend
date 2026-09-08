import type { Supplier } from './supplier';

export interface SupplierReturnBatchInfo {
  product_name: string;
  purchase_price: string;
  quantity_in: number;
  created_at: string;
}

export interface SupplierReturnItem {
  id: number;
  stock_supply_item_id: number;
  quantity: number;
  reason: string;
  batch_info: SupplierReturnBatchInfo;
}

export interface SupplierReturn {
  id: number;
  suplier_id: number;
  return_number: string;
  date: string;
  notes?: string;
  created_at: string;
  suplier?: Supplier;
  items?: SupplierReturnItem[];
}

export interface SupplierReturnQuery {
  search?: string;
  suplier_id?: number;
  startDate?: string;
  endDate?: string;
  size?: number;
  page?: number;
}

export interface CreateSupplierReturnItemPayload {
  stock_supply_item_id: number;
  quantity: number;
  reason: string;
}

export interface CreateSupplierReturnRequest {
  suplier_id: number;
  date: string;
  notes?: string;
  items: CreateSupplierReturnItemPayload[];
}
