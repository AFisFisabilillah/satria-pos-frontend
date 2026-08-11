import { Navigate, Outlet } from 'react-router';
import type { User } from '../../types/auth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // Belum login -> redirect login
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user: User = JSON.parse(userStr);

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
