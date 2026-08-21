import { useState } from 'react';
import { Card, Input, Typography, Table, Tag, Button, Avatar, App, Dropdown } from 'antd';
import { SearchOutlined, PlusOutlined, UserOutlined, MoreOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import type { TableProps } from 'antd';
import { useUsers, useDeleteUser } from '../../hooks/useUsers';
import type { User } from '../../types/user';
import { UserModal } from '../../components/user/UserModal';

const { Title, Text } = Typography;

export const UserPage = () => {
  const { message, modal } = App.useApp();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail'>('create');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data, isLoading } = useUsers({ search: debouncedSearch || undefined });

  const { mutate: deleteUser } = useDeleteUser({
    onSuccess: () => message.success('User berhasil dihapus'),
    onError: () => message.error('Gagal menghapus user'),
  });

  const openModal = (mode: 'create' | 'edit' | 'detail', id?: number) => {
    setModalMode(mode);
    setSelectedUserId(id ?? null);
    setModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    modal.confirm({
      title: 'Hapus User',
      content: `Apakah Anda yakin ingin menghapus user "${name}"?`,
      okText: 'Hapus',
      cancelText: 'Batal',
      okButtonProps: { danger: true },
      onOk: () => deleteUser(id),
    });
  };

  const columns: TableProps<User>['columns'] = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} src={record.foto_profile} className="bg-[#ff6a00]" />
          <div>
            <Text strong className="block">{record.name}</Text>
            <Text type="secondary" className="text-xs">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role_label',
      key: 'role',
      align: 'center',
      render: (label: string, record) => (
        <Tag color={record.role === 'super_admin' ? 'red' : 'blue'} bordered={false}>{label}</Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      align: 'center',
      width: 60,
      render: (_, record) => (
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          menu={{
            items: [
              { key: 'detail', label: 'Detail', icon: <EyeOutlined />, onClick: () => openModal('detail', record.id) },
              { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => openModal('edit', record.id) },
              { type: 'divider' },
              { key: 'delete', label: 'Hapus', icon: <DeleteOutlined />, danger: true, onClick: () => handleDelete(record.id, record.name) },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Title level={3} className="!m-0">Manajemen User</Title>
        <Button type="primary" icon={<PlusOutlined />} className="bg-[#ff6a00]" onClick={() => openModal('create')}>
          Tambah User
        </Button>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] rounded-xl shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Cari nama atau email..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="md:w-64"
          />
        </div>

        <Table<User>
          columns={columns}
          dataSource={data?.data}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 'max-content' }}
          pagination={false}
          className="border border-slate-200 dark:border-[#202020] rounded-lg overflow-hidden"
        />
      </Card>

      <UserModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        mode={modalMode}
        userId={selectedUserId}
      />
    </div>
  );
};
