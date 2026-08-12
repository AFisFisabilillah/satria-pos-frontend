export interface Category {
  id: number;
  name: string;
}

export interface CategoryQuery {
  search?: string;
}

export interface CreateCategoryRequest {
  name: string;
}
