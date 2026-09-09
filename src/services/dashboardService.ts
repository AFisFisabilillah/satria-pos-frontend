import { apiClient } from '../lib/apiClient';
import type { DashboardResponse, DashboardQuery } from '../types/dashboard';

export const dashboardService = {
  getStats: (params?: DashboardQuery) =>
    apiClient
      .get<{ data?: DashboardResponse } | DashboardResponse>('/dashboard', { params })
      .then((res) => {
        if ('data' in res.data && res.data.data) {
          return res.data.data;
        }
        return res.data as DashboardResponse;
      }),
};
