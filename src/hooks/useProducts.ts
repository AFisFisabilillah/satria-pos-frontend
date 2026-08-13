import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { productService } from '../services/productService';
import type { ProductQuery, CreateProductRequest, BulkToggleActiveRequest } from '../types/product';

export function useProducts(params?: ProductQuery) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params),
  });
}

interface UseCreateProductOptions {
  onSuccess?: () => void;
  onError?: (error: AxiosError<any>) => void;
}

export function useCreateProduct(options?: UseCreateProductOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => {
      options?.onError?.(error);
    },
  });
}

export function useBulkToggleProducts(options?: UseCreateProductOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkToggleActiveRequest) => productService.bulkToggleActive(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => {
      options?.onError?.(error);
    },
  });
}

export function useProduct(id: number | string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

interface UseUpdateProductOptions {
  onSuccess?: () => void;
  onError?: (error: AxiosError<any>) => void;
}

export function useUpdateProduct(id: number | string, options?: UseUpdateProductOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CreateProductRequest>) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => {
      options?.onError?.(error);
    },
  });
}

export function useDeleteProduct(options?: UseCreateProductOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => {
      options?.onError?.(error);
    },
  });
}
