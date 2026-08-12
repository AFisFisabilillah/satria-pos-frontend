import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { categoryService } from '../services/categoryService';
import type { CategoryQuery, CreateCategoryRequest } from '../types/category';

export function useCategories(params?: CategoryQuery) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryService.getAll(params),
  });
}

interface UseCreateCategoryOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError<any>) => void;
}

export function useCreateCategory(options?: UseCreateCategoryOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError) => {
      options?.onError?.(error);
    },
  });
}
