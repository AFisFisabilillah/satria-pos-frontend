import { Table, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { PaginatedResponse } from '../../types/api';
import type { Supplier } from '../../types/supplier';
import { useDeleteSupplier } from '../../hooks/useSuppliers';
import { App } from 'antd';
import { Link } from 'react-router';

interface SupplierTableProps {
  data?: PaginatedResponse<Supplier>;
  isLoading: boolean;
  page: number;
  size: number;
  onTableChange: (page: number, size: number) => void;
  onEdit: (supplier: Supplier) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedRowKeys: React.Key[]) => void;
}

export const SupplierTable = ({
  data,
  isLoading,
  page,
  size,
  onTableChange,
  onEdit,
  selectedRowKeys,
  onSelectChange,
}: SupplierTableProps) => {
  const { message } = App.useApp();

  const { mutate: deleteSupplier } = useDeleteSupplier({
    onSuccess: () => message.success('Supplier berhasil dihapus'),
    onError: () => message.error('Gagal menghapus supplier')
  });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onTableChange(pagination.current || 1, pagination.pageSize || 10);
  };

  const columns = [
    {
      title: 'No',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (page - 1) * size + index + 1,
    },
    {
      title: 'Nama Supplier',
      dataIndex: 'name',
    },
    {
      title: 'No HP',
      dataIndex: 'phone',
      render: (text: string) => text || '-',
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      render: (text: string) => text || '-',
    },
    {
      title: 'Kota',
      dataIndex: 'city',
      render: (text: string) => text || '-',
    },
    {
      title: 'Provinsi',
      dataIndex: 'province',
      render: (text: string) => text || '-',
    },
    {
      title: 'Kode Pos',
      dataIndex: 'postal_code',
      render: (text: string) => text || '-',
    },
    {
      title: 'Aksi',
      width: 120,
      render: (_: unknown, record: Supplier) => (
        <div className="flex gap-2">
          <Link to={`/super-admin/supplier/${record.id}`}>
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Link>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Hapus supplier ini?"
            onConfirm={() => deleteSupplier(record.id)}
            okText="Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectChange,
      }}
      columns={columns}
      dataSource={data?.data || []}
      loading={isLoading}
      onChange={handleTableChange}
      scroll={{ x: 600 }}
      pagination={{
        current: page,
        pageSize: size,
        total: data?.meta?.total || 0,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} data`,
      }}
    />
  );
};
