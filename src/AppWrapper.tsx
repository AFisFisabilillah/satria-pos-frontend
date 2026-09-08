import { ConfigProvider, App, theme } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router';
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
import { SupplierDetailPage } from './pages/admin/SupplierDetailPage.tsx';
import { MemberPage } from './pages/admin/MemberPage.tsx';
import { MemberDetailPage } from './pages/admin/MemberDetailPage.tsx';
import { StockSupplyPage } from './pages/admin/StockSupplyPage.tsx';
import { StockSupplyCreatePage } from './pages/admin/stock-supply/StockSupplyCreatePage.tsx';
import { StockSupplyDetailPage } from './pages/admin/stock-supply/StockSupplyDetailPage.tsx';
import { StockSupplyUpdatePage } from './pages/admin/stock-supply/StockSupplyUpdatePage.tsx';
import { VoucherPage } from './pages/admin/VoucherPage.tsx';
import { VoucherCreatePage } from './pages/admin/VoucherCreatePage.tsx';
import { VoucherUpdatePage } from './pages/admin/VoucherUpdatePage.tsx';
import { VoucherDetailPage } from './pages/admin/VoucherDetailPage.tsx';
import { KasirPage } from './pages/pos/KasirPage.tsx';
import { TransactionPage } from './pages/admin/transaction/TransactionPage.tsx';
import { TransactionDetailPage } from './pages/admin/transaction/TransactionDetailPage.tsx';
import { UserPage } from './pages/admin/UserPage.tsx';
import { ProfilePage } from './pages/admin/ProfilePage.tsx';

import { SupplierReturnPage } from './pages/admin/SupplierReturnPage.tsx';
import { SupplierReturnCreatePage } from './pages/admin/SupplierReturnCreatePage.tsx';
import { SupplierReturnDetailPage } from './pages/admin/SupplierReturnDetailPage.tsx';
import { StockAdjustmentPage } from './pages/admin/StockAdjustmentPage.tsx';

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
              <Route path="/kasir" element={<KasirPage />} />
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
              <Route path='supplier/:id' element={<SupplierDetailPage/>} />
              <Route path='member' element={<MemberPage/>} />
              <Route path='member/:id' element={<MemberDetailPage/>} />
              <Route path='stock-supply' element={<StockSupplyPage/>} />
              <Route path='stock-supply/create' element={<StockSupplyCreatePage/>} />
              <Route path='stock-supply/:id/edit' element={<StockSupplyUpdatePage/>} />
              <Route path='stock-supply/:id' element={<StockSupplyDetailPage/>} />
              <Route path='stock-adjustment' element={<StockAdjustmentPage/>} />
              <Route path='supplier-return' element={<SupplierReturnPage/>} />
              <Route path='supplier-return/create' element={<SupplierReturnCreatePage/>} />
              <Route path='supplier-return/:id' element={<SupplierReturnDetailPage/>} />
              <Route path='voucher' element={<VoucherPage/>} />
              <Route path='voucher/:id' element={<VoucherDetailPage/>} />
              <Route path='voucher/create' element={<VoucherCreatePage/>} />
              <Route path='voucher/:id/edit' element={<VoucherUpdatePage/>} />
              <Route path='transaction' element={<TransactionPage/>} />
              <Route path='transaction/:id' element={<TransactionDetailPage/>} />
              <Route path='user' element={<UserPage/>} />
              <Route path='profile' element={<ProfilePage/>} />
              <Route path='kasir' element={<KasirPage/>} />
            </Route>

          </Routes>
        </BrowserRouter>
      </App>
    </ConfigProvider>
  );
}
