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
