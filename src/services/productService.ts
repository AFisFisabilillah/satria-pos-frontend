import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { Product, ProductQuery, CreateProductRequest, BulkToggleActiveRequest } from '../types/product';

export const productService = {
  getAll: (params?: ProductQuery) =>
    apiClient
      .get<PaginatedResponse<Product>>('/products', { params })
      .then((res) => res.data),
      
  create: (data: CreateProductRequest) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('code', data.code);
    formData.append('unit_id', data.unit_id.toString());
    formData.append('sale_price', data.sale_price.toString());
    
    if (data.description) formData.append('description', data.description);
    if (data.active !== undefined) formData.append('active', data.active ? '1' : '0');
    if (data.image instanceof File) formData.append('image', data.image);
    
    if (data.category_ids && data.category_ids.length > 0) {
      data.category_ids.forEach((id) => {
        formData.append('category_ids[]', id.toString());
      });
    }

    return apiClient
      .post<{ data: Partial<Product> }>('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data);
  },

  bulkToggleActive: (data: BulkToggleActiveRequest) =>
    apiClient
      .post<{ message: string }>('/products/bulk-toggle-active', data)
      .then((res) => res.data),
};
