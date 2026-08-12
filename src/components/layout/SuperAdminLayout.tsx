import { Layout } from "antd";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ContentLayout } from "./ContentLayout";

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

  const menuItems: any[] = [
  ];

  return (
    <Layout style={{ minHeight: '100vh' }} className="bg-slate-50! dark:bg-[#141414]! flex flex-row">
      <Sidebar
        menuItems={menuItems}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />
      <Layout className="bg-transparent! flex-1 flex flex-col min-w-0">
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <ContentLayout>
          {children}
        </ContentLayout>
      </Layout>
    </Layout>
  );
};
