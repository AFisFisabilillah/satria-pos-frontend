import { Layout, type MenuProps } from "antd";
import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ContentLayout } from "./ContentLayout";
import { AppTour } from "../common/AppTour";
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

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const themeToggleRef = useRef<HTMLButtonElement | null>(null);
  const profileRef = useRef<HTMLButtonElement | null>(null);

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
      label: <span data-tour="menu-dashboard"><Link to="/super-admin">Dashboard</Link></span>,
      icon: <DashboardOutlined />
    },
    {
      key: '/kasir',
      label: <span data-tour="menu-kasir"><Link to="/kasir">Kasir (POS)</Link></span>,
      icon: <ShoppingCartOutlined />
    },
    {
      type: 'group',
      label: 'Master Data',
      children: [
        {
          key: '/super-admin/product',
          label: <span data-tour="menu-product"><Link to="/super-admin/product">Produk</Link></span>,
          icon: <AppstoreOutlined />
        },
        {
          key: '/super-admin/category',
          label: <span data-tour="menu-category"><Link to="/super-admin/category">Kategori</Link></span>,
          icon: <TagsOutlined />
        },
        {
          key: '/super-admin/unit',
          label: <span data-tour="menu-unit"><Link to="/super-admin/unit">Satuan (Unit)</Link></span>,
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
          label: <span data-tour="menu-stock-supply"><Link to="/super-admin/stock-supply">Stock Supply</Link></span>,
          icon: <InboxOutlined />
        },
        {
          key: '/super-admin/stock-adjustment',
          label: <span data-tour="menu-stock-adjustment"><Link to="/super-admin/stock-adjustment">Stock Adjustment</Link></span>,
          icon: <DiffOutlined />
        },
        {
          key: '/super-admin/supplier-return',
          label: <span data-tour="menu-supplier-return"><Link to="/super-admin/supplier-return">Retur Supplier</Link></span>,
          icon: <RollbackOutlined />
        },
        {
          key: '/super-admin/transaction',
          label: <span data-tour="menu-transaction"><Link to="/super-admin/transaction">Riwayat Transaksi</Link></span>,
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
          label: <span data-tour="menu-supplier"><Link to="/super-admin/supplier">Supplier</Link></span>,
          icon: <TruckOutlined />
        },
        {
          key: '/super-admin/member',
          label: <span data-tour="menu-member"><Link to="/super-admin/member">Member</Link></span>,
          icon: <TeamOutlined />
        },
        {
          key: '/super-admin/voucher',
          label: <span data-tour="menu-voucher"><Link to="/super-admin/voucher">Voucher</Link></span>,
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
          label: <span data-tour="menu-user"><Link to="/super-admin/user">Manajemen User</Link></span>,
          icon: <UserOutlined />
        },
      ]
    },
  ];

  return (
    <Layout className="h-screen bg-slate-50! dark:bg-[#141414]! flex flex-row overflow-hidden">
      <AppTour sidebarRef={sidebarRef} themeToggleRef={themeToggleRef} profileRef={profileRef} />
      <Sidebar
        menuItems={menuItems}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarRef={sidebarRef}
      />
      <Layout className="bg-transparent! flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          themeToggleRef={themeToggleRef}
          profileRef={profileRef}
        />
        <ContentLayout>
          {children}
        </ContentLayout>
      </Layout>
    </Layout>
  );
};
