import { Layout } from 'antd';
import type { ReactNode } from 'react';

const { Content } = Layout;

interface ContentLayoutProps {
  children: ReactNode;
}

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <Content className="p-4 md:p-6 lg:p-8 flex-1 flex flex-col bg-slate-50! dark:bg-[#141414]! text-slate-800! dark:text-white/85! m-0">
      {children}
    </Content>
  );
};
