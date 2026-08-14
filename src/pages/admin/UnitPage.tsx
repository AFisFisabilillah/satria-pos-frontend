import { useState } from 'react';
import { Table, Button, Input, Typography, App, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useUnits, useCreateUnit, useDeleteUnit } from '../../hooks/useUnits';

const { Title } = Typography;

export const UnitPage = () => {
  const { message } = App.useApp();
  const [newUnitName, setNewUnitName] = useState('');

  const { data: units, isLoading } = useUnits();

  const { mutate: createUnit, isPending: isCreating } = useCreateUnit({
    onSuccess: () => {
      message.success('Unit berhasil ditambahkan');
      setNewUnitName('');
    },
    onError: () => message.error('Gagal menambahkan unit'),
  });

  const { mutate: deleteUnit } = useDeleteUnit({
    onSuccess: () => message.success('Unit berhasil dihapus'),
    onError: () => message.error('Gagal menghapus unit'),
  });

  const handleCreate = () => {
    const name = newUnitName.trim();
    if (!name) return;
    createUnit({ name });
  };

  const columns = [
    {
      title: 'No',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'Nama Unit',
      dataIndex: 'name',
    },
    {
      title: 'Aksi',
      width: 80,
      render: (_: unknown, record: { id: number }) => (
        <Popconfirm
          title="Hapus unit ini?"
          description="Unit yang sudah dipakai produk tidak bisa dihapus."
          onConfirm={() => deleteUnit(record.id)}
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
      <Title level={3} className="!m-0">Data Unit</Title>

      <div className="bg-white dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-[#202020] shadow-sm flex flex-col gap-5">
        <div className="flex gap-2 max-w-md">
          <Input
            placeholder="Nama unit baru..."
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
            onPressEnter={handleCreate}
            size="large"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            loading={isCreating}
            disabled={!newUnitName.trim()}
            size="large"
            className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
          >
            Tambah
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={units}
          loading={isLoading}
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};
