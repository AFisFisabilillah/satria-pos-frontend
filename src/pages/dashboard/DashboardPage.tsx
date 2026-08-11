import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '../../types/auth';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem('user');
  const user: User | null = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div className="p-8">
      <Title level={2}>Dashboard</Title>
      <Text>Selamat datang, {user?.name} ({user?.role_label})</Text>

      <div className="mt-8">
        <Button onClick={handleLogout} danger type="primary">Logout</Button>
      </div>
    </div>
  );
}
