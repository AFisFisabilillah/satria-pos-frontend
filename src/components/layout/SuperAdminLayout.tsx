import { Layout, type MenuProps } from "antd";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ContentLayout } from "./ContentLayout";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ContainerOutlined,
  InboxOutlined,
  FileTextOutlined,
  TruckOutlined,
  TeamOutlined,
  GiftOutlined,
  UserOutlined,
  RollbackOutlined,
  DiffOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";

interface AdminGudangLayoutProps {
  children: ReactNode;
}

export const SuperAdminLayout = ({ children }: AdminGudangLayoutProps) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems: MenuProps['items'] = [
    {
      key: '/super-admin',
      label: <Link to="/super-admin">Dashboard</Link>,
      icon: <DashboardOutlined />
    },
    {
      key: '/kasir',
      label: <Link to="/kasir">Kasir (POS)</Link>,
      icon: <ShoppingCartOutlined />
    },
    {
      type: 'group',
      label: 'Master Data',
      children: [
        {
          key: '/super-admin/product',
          label: <Link to="/super-admin/product">Produk</Link>,
          icon: <AppstoreOutlined />
        },
        {
          key: '/super-admin/category',
          label: <Link to="/super-admin/category">Kategori</Link>,
          icon: <TagsOutlined />
        },
        {
          key: '/super-admin/unit',
          label: <Link to="/super-admin/unit">Satuan (Unit)</Link>,
          icon: <ContainerOutlined />
        },
      ]
    },
    {
      type: 'group',
      label: 'Stok & Transaksi',
      children: [
        {
          key: '/super-admin/stock-supply',
          label: <Link to="/super-admin/stock-supply">Stock Supply</Link>,
          icon: <InboxOutlined />
        },
        {
          key: '/super-admin/stock-adjustment',
          label: <Link to="/super-admin/stock-adjustment">Stock Adjustment</Link>,
          icon: <DiffOutlined />
        },
        {
          key: '/super-admin/supplier-return',
          label: <Link to="/super-admin/supplier-return">Retur Supplier</Link>,
          icon: <RollbackOutlined />
        },
        {
          key: '/super-admin/transaction',
          label: <Link to="/super-admin/transaction">Riwayat Transaksi</Link>,
          icon: <FileTextOutlined />
        },
      ]
    },
    {
      type: 'group',
      label: 'Relasi & Promosi',
      children: [
        {
          key: '/super-admin/supplier',
          label: <Link to="/super-admin/supplier">Supplier</Link>,
          icon: <TruckOutlined />
        },
        {
          key: '/super-admin/member',
          label: <Link to="/super-admin/member">Member</Link>,
          icon: <TeamOutlined />
        },
        {
          key: '/super-admin/voucher',
          label: <Link to="/super-admin/voucher">Voucher</Link>,
          icon: <GiftOutlined />
        },
      ]
    },
    {
      type: 'group',
      label: 'Pengaturan',
      children: [
        {
          key: '/super-admin/user',
          label: <Link to="/super-admin/user">Manajemen User</Link>,
          icon: <UserOutlined />
        },
      ]
    },
  ];

  return (
    <Layout className="h-screen bg-slate-50! dark:bg-[#141414]! flex flex-row overflow-hidden">
      <Sidebar
        menuItems={menuItems}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />
      <Layout className="bg-transparent! flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <ContentLayout>
          {children}
        </ContentLayout>
      </Layout>
    </Layout>
  );
};
