import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { ProductQuery } from '../types/product';

export function useProducts(params?: ProductQuery) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params),
  });
}
