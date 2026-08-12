export interface Unit {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
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
  total_stock: number;
  unit: Unit;
  categories: Category[];
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
