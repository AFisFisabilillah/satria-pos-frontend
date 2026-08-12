import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { Product, ProductQuery } from '../types/product';

export const productService = {
  getAll: (params?: ProductQuery) =>
    apiClient
      .get<PaginatedResponse<Product>>('/products', { params })
      .then((res) => res.data),
};
