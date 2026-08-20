import { useState, useEffect } from 'react';
import { Button, Drawer, Typography, Badge, Tooltip } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, ShopOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { ProductCatalog } from '../../components/pos/ProductCatalog';
import { CheckoutSummary } from '../../components/pos/CheckoutSummary';
import { useCartStore } from '../../store/useCartStore';

const { Title, Text } = Typography;

export const KasirPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const cart = useCartStore((state) => state.cart);
  const selectedVouchers = useCartStore((state) => state.selectedVouchers);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmount = selectedVouchers.reduce((acc, voucher) => {
    if (voucher.min_purchase && subtotal < voucher.min_purchase) return acc;
    if (voucher.type === 'percent') return acc + (subtotal * voucher.value) / 100;
    return acc + voucher.value;
  }, 0);

  const total = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-[#0a0a0a] overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 bg-white dark:bg-[#141414] border-b border-slate-200 dark:border-[#202020] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/super-admin')}
            type="text"
            className="hover:bg-slate-100 dark:hover:bg-[#202020]"
          />
          <div className="flex items-center gap-2">
            <ShopOutlined className="text-primary text-xl" />
            <Title level={4} className="m-0! text-slate-800 dark:text-slate-100">
              Kasir / POS
            </Title>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Text className="text-xs text-slate-500 hidden sm:inline">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>

          <Tooltip title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh (Fullscreen)'}>
            <Button
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={toggleFullscreen}
              type="text"
              className="hover:bg-slate-100 dark:hover:bg-[#202020]"
            />
          </Tooltip>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Column - Catalog */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          <ProductCatalog />
        </div>

        {/* Right Column - Checkout Panel (Desktop) */}
        {!isMobile && (
          <div className="w-96 flex flex-col h-full shrink-0">
            <CheckoutSummary />
          </div>
        )}
      </div>

      {/* Floating Bottom Bar for Mobile */}
      {isMobile && (
        <div className="bg-white dark:bg-[#141414] border-t border-slate-200 dark:border-[#202020] p-3 px-4 flex items-center justify-between shadow-lg shrink-0">
          <div className="flex items-center gap-3">
            <Badge count={totalItems} color="#ff6a00">
              <div className="w-10 h-10 bg-slate-100 dark:bg-[#202020] rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300">
                <ShoppingCartOutlined className="text-xl" />
              </div>
            </Badge>
            <div className="flex flex-col">
              <Text className="text-xs text-slate-500">{totalItems} Item di Keranjang</Text>
              <span className="font-bold text-primary text-base">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={() => setIsDrawerOpen(true)}
            className="bg-[#ff6a00] hover:bg-[#e55e00] border-none font-semibold"
          >
            Lihat Keranjang
          </Button>
        </div>
      )}

      {/* Bottom Sheet / Drawer for Mobile */}
      <Drawer
        title="Keranjang & Pembayaran"
        placement="bottom"
        height="85vh"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen && isMobile}
        bodyStyle={{ padding: '12px' }}
      >
        <CheckoutSummary onSuccessTransaction={() => setIsDrawerOpen(false)} />
      </Drawer>
    </div>
  );
};
