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
    if (data.image) formData.append('image', data.image);

    if (data.category_ids && data.category_ids.length > 0) {
      data.category_ids.forEach((id) => {
        formData.append('category_ids[]', id.toString());
      });
    }

    return apiClient
      .post<{ data: Partial<Product> }>('/products', formData)
      .then((res) => res.data);
  },

  bulkToggleActive: (data: BulkToggleActiveRequest) =>
    apiClient
      .post<{ message: string }>('/products/bulk-toggle-active', data)
      .then((res) => res.data),

  getById: (id: number | string) =>
    apiClient.get<{ data: Product }>(`/products/${id}`).then((res) => res.data.data),

  update: (id: number | string, data: Partial<CreateProductRequest>) => {
    const formData = new FormData();

    // Ensure _method=POST is removed if the route is strictly POST
    if (data.name) formData.append('name', data.name);
    if (data.code) formData.append('code', data.code);
    if (data.unit_id) formData.append('unit_id', data.unit_id.toString());
    if (data.sale_price) formData.append('sale_price', data.sale_price.toString());
    if (data.description !== undefined) formData.append('description', data.description || '');
    if (data.active !== undefined) formData.append('active', data.active ? '1' : '0');
    if (data.image) formData.append('image', data.image);

    console.log("image : "+data.image);
    
    if (data.category_ids) {
      if (data.category_ids.length > 0) {
        data.category_ids.forEach((categoryId) => {
          formData.append('category_ids[]', categoryId.toString());
        });
      } else {
        // if empty, send empty array so backend clears it
        formData.append('category_ids', '');
      }
    }

    return apiClient
      .post<{ data: Partial<Product> }>(`/products/${id}`, formData)
      .then((res) => res.data);
  },

  delete: (id: number | string) =>
    apiClient.delete<{ message: string }>(`/products/${id}`).then((res) => res.data),
};
