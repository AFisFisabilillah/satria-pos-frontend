import { useQuery } from '@tanstack/react-query';
import { memberService } from '../services/memberService';
import type { MemberQuery } from '../types/member';

export function useMembers(params?: MemberQuery) {
  return useQuery({
    queryKey: ['members', params],
    queryFn: () => memberService.getAll(params),
  });
}
