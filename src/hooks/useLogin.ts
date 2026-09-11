import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import type { AxiosError } from 'axios';
import { authService } from '../services/authService';
import type { LoginRequest } from '../types/auth';

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: AxiosError<any>) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (res) => {
      // res from authService.login is already res.data from axios
      // so it matches LoginResponse interface: { message, data: { token, user } }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      options?.onSuccess?.();

      const role = res.data.user?.role;
      if (role === 'super_admin' || role === 'admin') {
        navigate('/super-admin');
      } else if (role === 'kasir') {
        navigate('/kasir');
      } else {
        navigate('/');
      }
    },
    onError: (err: AxiosError) => {
      options?.onError?.(err);
    }
  });
}
