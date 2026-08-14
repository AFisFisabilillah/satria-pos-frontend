import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { unitService } from '../services/unitService';
import type { UnitQuery, CreateUnitRequest } from '../types/unit';

export function useUnits(params?: UnitQuery) {
  return useQuery({
    queryKey: ['units', params],
    queryFn: () => unitService.getAll(params),
  });
}

interface UseCreateUnitOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError<any>) => void;
}

export function useCreateUnit(options?: UseCreateUnitOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUnitRequest) => unitService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError) => {
      options?.onError?.(error);
    },
  });
}

export function useDeleteUnit(options?: { onSuccess?: () => void; onError?: (error: AxiosError) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => unitService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError) => {
      options?.onError?.(error);
    },
  });
}
