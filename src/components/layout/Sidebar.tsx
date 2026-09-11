import { Image, Layout, Menu, Drawer, Avatar } from 'antd';
import { useLocation, Link } from 'react-router';
import { UserOutlined } from '@ant-design/icons';
import type { User } from '../../types/auth';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  menuItems: any[];
  isMobile: boolean;
  setCollapsed: (collapsed: boolean) => void;
  sidebarRef?: React.RefObject<HTMLDivElement | null>;
}

export const Sidebar = ({ collapsed, menuItems, isMobile, setCollapsed, sidebarRef }: SidebarProps) => {
  const location = useLocation();
  const userString = localStorage.getItem('user');
  const user: User | null = userString ? JSON.parse(userString) : null;
  const profileLink = user?.role === 'super_admin' ? '/super-admin/profile' : null;

  const siderContent = (
    <div ref={sidebarRef} className="flex flex-col h-full overflow-hidden">
      {/* Header Logo (Fixed) */}
      <div
        className="flex items-center h-16 m-3 rounded-xl bg-slate-100 dark:bg-linear-to-br dark:from-[#111111] dark:to-[#171717] border border-slate-200 dark:border-[#232323] shrink-0"
      >
        <div className="w-full h-full flex items-center justify-center">
          <Image
            width={50}
            height={50}
            src="/image/logo-satria.png"
            className={collapsed && !isMobile ? "mx-0" : "mx-2"}
            preview={false}
          />
        </div>
        {(collapsed && !isMobile) || (
          <div className="mx-4 whitespace-nowrap">
            <p className="text-lg font-bold text-slate-800 dark:text-white m-0">Satria<span className="text-[#ff6a00]">Pos</span></p>
            <p className="text-slate-500 dark:text-white/70 text-[10px] m-0">By SatriaCorp</p>
          </div>
        )}
      </div>

      {/* Menu Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            borderInlineEnd: 'none',
          }}
          className="bg-white! dark:bg-[#0b0b0b]! text-slate-800! dark:text-white/85!"
          items={menuItems}
        />
      </div>

      {/* Fixed Profile Section at bottom */}
      {profileLink && (
        <div className="border-t border-slate-200 dark:border-[#232323] p-3 shrink-0">
          <Link to={profileLink} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer text-inherit">
            <Avatar size={36} src={user?.foto_profile} icon={<UserOutlined />} className="bg-[#ff6a00] shrink-0" />
            {(!collapsed || isMobile) && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate dark:text-white">{user?.name}</span>
                <span className="text-xs text-slate-500 truncate">{user?.role_label || user?.role}</span>
              </div>
            )}
          </Link>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setCollapsed(true)}
        open={!collapsed}
        width={250}
        styles={{ body: { padding: 0 }, header: { display: 'none' } }}
      >
        <div style={{ height: '100%' }}>
          {siderContent}
        </div>
      </Drawer>
    );
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="bg-white! dark:bg-[#0b0b0b]! border-r border-slate-200 dark:border-[#202020] h-full shrink-0"
    >
      {siderContent}
    </Sider>
  );
};
