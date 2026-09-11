import { Layout, type MenuProps } from "antd";
import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ContentLayout } from "./ContentLayout";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { AppTour } from "../common/AppTour";

interface KasirLayoutProps {
  children: ReactNode;
}

export const KasirLayout = ({ children }: KasirLayoutProps) => {
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
      key: '/kasir',
      label: <Link to="/kasir">Kasir (POS)</Link>,
      icon: <ShoppingCartOutlined />
    },
    {
      key: '/kasir/profile',
      label: <Link to="/kasir/profile">Profile</Link>,
      icon: <UserOutlined />
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
