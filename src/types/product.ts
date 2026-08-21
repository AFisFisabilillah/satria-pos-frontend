export interface Unit {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface StokHistory {
  id: number;
  quantity_in: number;
  quantity_remaining: number;
  purchase_price: string;
  expired_at: string | null;
  created_at: string;
  updated_at: string;
  product_id: number;
  product: string;
  suppliers: string;
  suplier_id: number;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  sale_price: number;
  quantity: number;
  unit: Unit;
  categories: Category[];
  stock_supply_items?: StockSupplyItem[];
  stok_history?: StokHistory[];
}

export interface ProductQuery {
  search?: string;
  size?: number;
  page?: number;
}

export interface CreateProductRequest {
  name: string;
  code: string;
  description?: string;
  image?: File | null;
  active?: boolean;
  unit_id: number;
  sale_price: number;
  category_ids?: number[];
}

export interface BulkToggleActiveRequest {
  ids: number[];
}

export interface StockSupplyItem {
  id: number;
  quantity_in: number;
  quantity_remaining: number;
  purchase_price: number;
  expired_at: string | null;
}
