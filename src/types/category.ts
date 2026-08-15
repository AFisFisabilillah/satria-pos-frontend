export interface Category {
  id: number;
  name: string;
}

export interface CategoryQuery {
  search?: string;
  page?: number;
  size?: number;
}

export interface CreateCategoryRequest {
  name: string;
}
