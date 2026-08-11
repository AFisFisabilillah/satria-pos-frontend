import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';

export function useUser() {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['user'],
    queryFn: authService.getMe,
    enabled: !!token, // Hanya fetch jika token ada
    staleTime: 5 * 60 * 1000, // Data valid 5 menit
  });
}