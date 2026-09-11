import { Button, Typography } from 'antd';
import { Link } from 'react-router';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-[#141414] dark:via-[#1a1a1a] dark:to-[#1c1208] flex items-center justify-center px-6">
      <div className="max-w-2xl text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-[#ff6a00] flex items-center justify-center shadow-lg shadow-orange-300 dark:shadow-orange-900/40">
          <ShoppingCartOutlined className="text-4xl text-white" />
        </div>

        <Title level={1} className="m-0! text-4xl md:text-5xl font-bold">
          <span className="text-[#ff6a00]">SATRIA</span> POS
        </Title>

        <Paragraph className="text-lg text-slate-500 dark:text-slate-400 m-0! max-w-md">
          Sistem Point of Sale modern untuk mengelola penjualan, stok, dan laporan bisnis Anda dengan mudah.
        </Paragraph>

        <Link to="/login">
          <Button type="primary" size="large" className="h-12 px-10 text-base font-semibold rounded-xl">
            Masuk ke Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
