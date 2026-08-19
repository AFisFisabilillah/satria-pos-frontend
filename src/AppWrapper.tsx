import { ConfigProvider, App, theme } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { themeTokens } from './theme/token.ts';
import { useTheme } from './contexts/ThemeContext';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import { SuperAdminLayout } from './components/layout/SuperAdminLayout.tsx';
import { ProductPage } from './pages/admin/ProductPage.tsx';
import { ProductCreatePage } from './pages/admin/ProductCreatePage.tsx';
import { ProductDetailPage } from './pages/admin/ProductDetailPage.tsx';
import { ProductUpdatePage } from './pages/admin/ProductUpdatePage.tsx';
import { UnitPage } from './pages/admin/UnitPage.tsx';
import { CategoryPage } from './pages/admin/CategoryPage.tsx';
import { SupplierPage } from './pages/admin/SupplierPage.tsx';
import { MemberPage } from './pages/admin/MemberPage.tsx';
import { MemberDetailPage } from './pages/admin/MemberDetailPage.tsx';
import { StockSupplyPage } from './pages/admin/StockSupplyPage.tsx';
import { StockSupplyCreatePage } from './pages/admin/stock-supply/StockSupplyCreatePage.tsx';
import { StockSupplyDetailPage } from './pages/admin/stock-supply/StockSupplyDetailPage.tsx';
import { StockSupplyUpdatePage } from './pages/admin/stock-supply/StockSupplyUpdatePage.tsx';

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

            <Route path='/super-admin' element={<SuperAdminLayout><ProtectedRoute allowedRoles={['super_admin']} /></SuperAdminLayout>} >
              <Route index element={<DashboardPage/>} />
              <Route path='product' element={<ProductPage/>} />
              <Route path='product/create' element={<ProductCreatePage/>} />
              <Route path='product/:id/edit' element={<ProductUpdatePage/>} />
              <Route path='product/:id' element={<ProductDetailPage/>} />
              <Route path='unit' element={<UnitPage/>} />
              <Route path='category' element={<CategoryPage/>} />
              <Route path='supplier' element={<SupplierPage/>} />
              <Route path='member' element={<MemberPage/>} />
              <Route path='member/:id' element={<MemberDetailPage/>} />
              <Route path='stock-supply' element={<StockSupplyPage/>} />
              <Route path='stock-supply/create' element={<StockSupplyCreatePage/>} />
              <Route path='stock-supply/:id/edit' element={<StockSupplyUpdatePage/>} />
              <Route path='stock-supply/:id' element={<StockSupplyDetailPage/>} />
            </Route>

          </Routes>
        </BrowserRouter>
      </App>
    </ConfigProvider>
  );
}
