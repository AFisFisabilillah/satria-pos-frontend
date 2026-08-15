import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { memberService } from '../services/memberService';
import type { MemberQuery, CreateMemberRequest } from '../types/member';

export function useMembers(params?: MemberQuery) {
  return useQuery({
    queryKey: ['members', params],
    queryFn: () => memberService.getAll(params),
  });
}

export function useCreateMember(options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMemberRequest) => memberService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}

export function useUpdateMember(id: number | string, options?: { onSuccess?: () => void; onError?: (error: AxiosError<any>) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateMemberRequest>) => memberService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      options?.onSuccess?.();
    },
    onError: (error: AxiosError<any>) => options?.onError?.(error),
  });
}
