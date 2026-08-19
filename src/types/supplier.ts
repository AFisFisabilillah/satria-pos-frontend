import type { StockSupply } from './stockSupply';

export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
}

export interface SupplierDetail extends Supplier {
  stock_suppliers: StockSupply[];
}

export interface SupplierQuery {
  search?: string;
  page?: number;
  size?: number;
}

export interface CreateSupplierRequest {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
}
