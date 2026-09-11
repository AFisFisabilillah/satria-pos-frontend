import {
    LoginOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    UserOutlined,
    BulbOutlined,
    BulbFilled,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout } from 'antd';
import { Link, useNavigate } from "react-router";
import type { MenuProps } from 'antd';
import type { User } from '../../types/auth';
import { useTheme } from '../../contexts/ThemeContext';

const { Header } = Layout;

interface NavbarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    themeToggleRef?: React.RefObject<HTMLButtonElement | null>;
    profileRef?: React.RefObject<HTMLButtonElement | null>;
}

export const Navbar = ({ setCollapsed, collapsed, themeToggleRef, profileRef }: NavbarProps) => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    // Ambil data user dari localStorage (karena SPA murni)
    const userString = localStorage.getItem('user');
    const user: User | null = userString ? JSON.parse(userString) : null;

    function getLinkProfile() {
        const role = user?.role;

        if (role === "super_admin") {
            return "/admin/profile";
        }

        return null;
    }

    const profileLink = getLinkProfile();

    const handleLogout = () => {
        // Hapus session dan redirect ke halaman login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <span className="font-semibold">{user?.name ?? 'User'}</span>,
        },
        {
            type: "divider"
        },
        ...(profileLink ? [{
            key: '2',
            label: (
                <Link to={profileLink} className="block w-full text-inherit">
                    Profile
                </Link>
            ),
            icon: <UserOutlined />
        }] : []),
        {
            key: '3',
            label: 'Settings',
            icon: <SettingOutlined />,
            disabled: true,
        },
        {
            key: '4',
            label: (
                <div onClick={handleLogout} className="block w-full text-left">
                    Logout
                </div>
            ),
            icon: <LoginOutlined />,
            danger: true
        }
    ];

    return (
        <Header
            className="flex w-full bg-white! dark:bg-[#141414]! border-b border-slate-200 dark:border-[#202020]"
            style={{ padding: 0 }}
        >
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                    borderRadius: 0,
                }}
                className="text-slate-800! dark:text-white/85! hover:bg-black/5 dark:hover:bg-white/10!"
            />
            <div className="flex w-full items-center justify-end pr-8 gap-4">
                <Button
                    ref={themeToggleRef}
                    type="text"
                    icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                    onClick={toggleTheme}
                    className="text-slate-800! dark:text-white/85! hover:bg-black/5 dark:hover:bg-white/10! w-10 h-10"
                />
                <Dropdown trigger={["click"]} menu={{ items }} placement="bottomRight" rootClassName="dark:ant-dropdown-menu-dark">
                    <button ref={profileRef} type="button" className="cursor-pointer border-0 bg-transparent p-0 flex items-center hover:opacity-80 transition-opacity">
                        {user?.foto_profile ? (
                            <Avatar size={40} src={user.foto_profile} />
                        ) : (
                            <Avatar size={40} icon={<UserOutlined />} />
                        )}
                    </button>
                </Dropdown>
            </div>
        </Header>
    );
};
