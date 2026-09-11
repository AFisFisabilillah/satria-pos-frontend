import { useState, useEffect } from 'react';
import { Tour } from 'antd';
import type { TourProps } from 'antd';

interface AppTourProps {
  sidebarRef?: React.RefObject<HTMLElement | null>;
  themeToggleRef?: React.RefObject<HTMLElement | null>;
  profileRef?: React.RefObject<HTMLElement | null>;
}

export const AppTour = ({ themeToggleRef, profileRef }: AppTourProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('has_seen_tour');
    if (!hasSeenTour) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('has_seen_tour', 'true');
    setOpen(false);
  };

  const getTarget = (selector: string) => {
    return () => document.querySelector(selector) as HTMLElement;
  };

  const steps: TourProps['steps'] = [
    {
      title: 'Selamat Datang di SatriaPOS!',
      description: 'Mari ikuti tur singkat untuk mengenal fitur-fitur utama sistem ini.',
      target: null,
    },
    {
      title: 'Dashboard',
      description: 'Melihat ringkasan data omset, laba kotor, total transaksi, statistik stok, dan grafik penjualan.',
      target: getTarget('[data-tour="menu-dashboard"]'),
    },
    {
      title: 'Kasir (POS)',
      description: 'Akses halaman aplikasi kasir untuk melakukan transaksi penjualan secara realtime.',
      target: getTarget('[data-tour="menu-kasir"]'),
    },
    {
      title: 'Produk',
      description: 'Kelola daftar produk, harga jual, harga beli (COGS), serta barcode barang.',
      target: getTarget('[data-tour="menu-product"]'),
    },
    {
      title: 'Kategori',
      description: 'Kelola pengelompokan kategori produk untuk memudahkan pencarian barang.',
      target: getTarget('[data-tour="menu-category"]'),
    },
    {
      title: 'Satuan (Unit)',
      description: 'Pengaturan unit/satuan barang seperti Pcs, Box, Kg, dll.',
      target: getTarget('[data-tour="menu-unit"]'),
    },
    {
      title: 'Stock Supply',
      description: 'Pencatatan pasokan barang masuk dari supplier untuk menambah stok toko.',
      target: getTarget('[data-tour="menu-stock-supply"]'),
    },
    {
      title: 'Stock Adjustment',
      description: 'Penyesuaian jumlah stok fisik apabila terdapat barang hilang, rusak, atau selisih.',
      target: getTarget('[data-tour="menu-stock-adjustment"]'),
    },
    {
      title: 'Retur Supplier',
      description: 'Pencatatan pengembalian barang yang rusak atau cacat kembali ke pihak supplier.',
      target: getTarget('[data-tour="menu-supplier-return"]'),
    },
    {
      title: 'Riwayat Transaksi',
      description: 'Melihat dan mengunduh seluruh rekapan riwayat transaksi penjualan kasir.',
      target: getTarget('[data-tour="menu-transaction"]'),
    },
    {
      title: 'Supplier',
      description: 'Kelola data kontak dan informasi pemasok/vendor barang.',
      target: getTarget('[data-tour="menu-supplier"]'),
    },
    {
      title: 'Member',
      description: 'Kelola data pelanggan terdaftar dan poin/diskon member.',
      target: getTarget('[data-tour="menu-member"]'),
    },
    {
      title: 'Voucher',
      description: 'Buat dan atur promo voucher diskon yang dapat digunakan saat transaksi di kasir.',
      target: getTarget('[data-tour="menu-voucher"]'),
    },
    {
      title: 'Manajemen User',
      description: 'Atur hak akses dan data akun pengguna (Admin, Kasir, Manajer).',
      target: getTarget('[data-tour="menu-user"]'),
    },
    ...(themeToggleRef ? [{
      title: 'Mode Tampilan',
      description: 'Beralih tampilan antara Mode Terang (Light) dan Mode Gelap (Dark).',
      target: () => themeToggleRef.current!,
    }] : []),
    ...(profileRef ? [{
      title: 'Profil & Akun',
      description: 'Melihat informasi akun login serta akses tombol Keluar (Logout).',
      target: () => profileRef.current!,
    }] : []),
  ];

  return (
    <Tour
      open={open}
      onClose={handleClose}
      steps={steps}
    />
  );
};
