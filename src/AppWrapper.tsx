import { ConfigProvider, App, theme } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { themeTokens } from './theme/token.ts';
import { useTheme } from './contexts/ThemeContext';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import { SuperAdminLayout } from './components/layout/SuperAdminLayout.tsx';

export function AppWrapper() {
  const { isDarkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
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
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
            </Route>

            <Route path='/admin' element={<SuperAdminLayout><ProtectedRoute allowedRoles={['super_admin']} /></SuperAdminLayout>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </App>
    </ConfigProvider>
  );
}
