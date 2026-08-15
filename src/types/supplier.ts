export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
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
