import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import type { DashboardQuery } from '../types/dashboard';

export function useDashboard(params?: DashboardQuery) {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => dashboardService.getStats(params),
  });
}
