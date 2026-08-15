import { apiClient } from '../lib/apiClient';
import type { PaginatedResponse } from '../types/api';
import type { Member, MemberQuery } from '../types/member';

export const memberService = {
  getAll: (params?: MemberQuery) =>
    apiClient
      .get<PaginatedResponse<Member>>('/members', { params })
      .then((res) => res.data),
};
