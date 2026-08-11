import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { ConfigProvider, App, theme } from 'antd';
import { themeTokens } from './theme/token.ts';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages & Components
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminPage from './pages/admin/AdminPage';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import { SuperAdminLayout } from './components/layout/SuperAdminLayout.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: themeTokens,
          components: {
            Layout: {
              headerBg: 'transparent',
            }
          }
        }}
      >
        <App>
          <BrowserRouter>
            <Routes>
              {/* Rute Publik (Hanya untuk user yang BELUM login) */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>

              {/* Rute Terlindungi (Semua role yang sudah login) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardPage />} />
              </Route>

              {/* Rute Terlindungi (Khusus Super Admin) */}
              <Route path='/admin' element={<SuperAdminLayout><ProtectedRoute allowedRoles={['super_admin']} /></SuperAdminLayout>}>
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </App>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>
);
