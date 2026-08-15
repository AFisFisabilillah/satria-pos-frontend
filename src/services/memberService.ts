import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { Member, MemberQuery, CreateMemberRequest } from '../types/member';

export const memberService = {
  getAll: (params?: MemberQuery) =>
    apiClient
      .get<PaginatedResponse<Member>>('/members', { params })
      .then((res) => res.data),

  create: (data: CreateMemberRequest) =>
    apiClient.post<{ data: Member }>('/members', data).then((res) => res.data.data),

  update: (id: number | string, data: Partial<CreateMemberRequest>) =>
    apiClient.put<{ data: Member }>(`/members/${id}`, data).then((res) => res.data.data),

  getById: (id: number | string) =>
    apiClient.get<{ data: Member }>(`/members/${id}`).then((res) => res.data.data),
};
