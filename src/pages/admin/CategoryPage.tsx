import { useState } from 'react';
import { Table, Button, Input, Typography, App, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCategories, useCreateCategory, useDeleteCategory } from '../../hooks/useCategories';

const { Title } = Typography;

export const CategoryPage = () => {
  const { message } = App.useApp();
  const [newCategoryName, setNewCategoryName] = useState('');

  const { data: categories, isLoading } = useCategories();

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory({
    onSuccess: () => {
      message.success('Kategori berhasil ditambahkan');
      setNewCategoryName('');
    },
    onError: () => message.error('Gagal menambahkan kategori'),
  });

  const { mutate: deleteCategory } = useDeleteCategory({
    onSuccess: () => message.success('Kategori berhasil dihapus'),
    onError: () => message.error('Gagal menghapus kategori'),
  });

  const handleCreate = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    createCategory({ name });
  };

  const columns = [
    {
      title: 'No',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'Nama Kategori',
      dataIndex: 'name',
    },
    {
      title: 'Aksi',
      width: 80,
      render: (_: unknown, record: { id: number }) => (
        <Popconfirm
          title="Hapus kategori ini?"
          description="Kategori yang sudah dipakai produk tidak bisa dihapus."
          onConfirm={() => deleteCategory(record.id)}
          okText="Hapus"
          cancelText="Batal"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Title level={3} className="!m-0">Data Kategori</Title>

      <div className="bg-white dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-[#202020] shadow-sm flex flex-col gap-5">
        <div className="flex gap-2 max-w-md">
          <Input
            placeholder="Nama kategori baru..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onPressEnter={handleCreate}
            size="large"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            loading={isCreating}
            disabled={!newCategoryName.trim()}
            size="large"
            className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
          >
            Tambah
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={categories}
          loading={isLoading}
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};
