import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { userService } from '../services/userService';
import type { UserQuery, CreateUserRequest } from '../types/user';

export function useUsers(params?: UserQuery) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params),
  });
}

export function useUser(id: number | string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); options?.onSuccess?.(); },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}

export function useUpdateUser(id: number | string, options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateUserRequest>) => userService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); options?.onSuccess?.(); },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}

export function useDeleteUser(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => userService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); options?.onSuccess?.(); },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}
