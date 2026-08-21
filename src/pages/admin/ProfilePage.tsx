import { Card, Descriptions, Spin, Typography, Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useProfile } from '../../hooks/useUsers';

const { Title, Text } = Typography;

export const ProfilePage = () => {
  const { data: profile, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Gagal memuat data profil.</Title>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <Title level={3} className="!m-0">Profil Saya</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] rounded-xl shadow-sm">
        <div className="flex flex-col items-center gap-6 py-6">
          <Avatar
            size={120}
            icon={<UserOutlined />}
            src={profile.foto_profile}
            className="bg-[#ff6a00] border-4 border-white dark:border-[#141414] shadow-md"
          />

          <div className="text-center">
            <Title level={4} className="!m-0 !mb-1">{profile.name}</Title>
            <Text type="secondary" className="block mb-3">{profile.email}</Text>
            <Tag color={profile.role === 'super_admin' ? 'red' : 'blue'} bordered={false} className="text-sm px-3 py-1">
              {profile.role_label}
            </Tag>
          </div>

          <Descriptions column={1} bordered size="middle" className="w-full mt-4" labelStyle={{ width: '150px' }}>
            <Descriptions.Item label="ID User">{profile.id}</Descriptions.Item>
            <Descriptions.Item label="Nama Lengkap">{profile.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{profile.role_label}</Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
    </div>
  );
};
