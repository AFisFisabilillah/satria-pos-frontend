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
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    const user: User = JSON.parse(userStr);
    if (user.role === 'super_admin' || user.role === 'admin') {
      return <Navigate to="/super-admin" replace />;
    } else if (user.role === 'cashier') {
      return <Navigate to="/kasir" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
