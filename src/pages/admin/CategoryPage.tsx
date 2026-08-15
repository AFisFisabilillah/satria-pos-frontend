import { useState } from 'react';
import { Table, Button, Input, Typography, App, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../../hooks/useCategories';

const { Title } = Typography;

export const CategoryPage = () => {
  const { message } = App.useApp();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const { data: categories, isLoading } = useCategories({ page, size });

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory({
    onSuccess: () => {
      message.success('Kategori berhasil ditambahkan');
      setNewCategoryName('');
    },
    onError: () => message.error('Gagal menambahkan kategori'),
  });

  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory(editingId || '', {
    onSuccess: () => {
      message.success('Kategori berhasil diubah');
      setEditingId(null);
      setEditingName('');
    },
    onError: () => message.error('Gagal mengubah kategori'),
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

  const handleStartEdit = (record: { id: number, name: string }) => {
    setEditingId(record.id);
    setEditingName(record.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = () => {
    const name = editingName.trim();
    if (!name || !editingId) return;
    updateCategory({ name });
  };

  const columns = [
    {
      title: 'No',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (page - 1) * size + index + 1,
    },
    {
      title: 'Nama Kategori',
      dataIndex: 'name',
      render: (text: string, record: { id: number }) => {
        if (editingId === record.id) {
          return (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onPressEnter={handleSaveEdit}
              autoFocus
            />
          );
        }
        return text;
      }
    },
    {
      title: 'Aksi',
      width: 120,
      render: (_: unknown, record: { id: number, name: string }) => {
        if (editingId === record.id) {
          return (
            <div className="flex gap-2">
              <Button type="text" icon={<CheckOutlined />} className="text-green-500" onClick={handleSaveEdit} loading={isUpdating} size="small" />
              <Button type="text" icon={<CloseOutlined />} className="text-slate-400" onClick={handleCancelEdit} size="small" />
            </div>
          );
        }

        return (
          <div className="flex gap-2">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleStartEdit(record)} size="small" />
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
          </div>
        );
      },
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
          dataSource={categories?.data || []}
          loading={isLoading}
          size="middle"
          onChange={(pagination) => {
            setPage(pagination.current || 1);
            if (pagination.pageSize && pagination.pageSize !== size) {
              setSize(pagination.pageSize);
              setPage(1);
            }
          }}
          pagination={{
            current: page,
            pageSize: size,
            total: categories?.meta?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} kategori`,
          }}
        />
      </div>
    </div>
  );
};
