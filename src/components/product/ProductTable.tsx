import { Table, Tag, Typography, Image, Dropdown, Button, App } from 'antd';
import { MoreOutlined, EyeOutlined, EditOutlined, DeleteOutlined, SwapOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import type { Product } from '../../types/product';
import type { PaginatedResponse } from '../../types/api';
import { useNavigate } from 'react-router';
import { useDeleteProduct, useBulkToggleProducts } from '../../hooks/useProducts';

const { Text } = Typography;

interface ProductTableProps {
  data?: PaginatedResponse<Product>;
  isLoading: boolean;
  page: number;
  size: number;
  onTableChange: (page: number, size: number) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (newSelectedRowKeys: React.Key[]) => void;
}

export const ProductTable = ({ data, isLoading, page, size, onTableChange, selectedRowKeys, onSelectChange }: ProductTableProps) => {
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
console.log(data);

  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => message.success('Produk berhasil dihapus'),
    onError: () => message.error('Gagal menghapus produk')
  });

  const { mutate: toggleActive } = useBulkToggleProducts({
    onSuccess: () => message.success('Status produk berhasil diubah'),
    onError: () => message.error('Gagal mengubah status produk')
  });

  const handleDelete = (id: number, name: string) => {
    modal.confirm({
      title: 'Hapus Produk',
      content: `Apakah Anda yakin ingin menghapus produk "${name}"?`,
      okText: 'Hapus',
      cancelText: 'Batal',
      okButtonProps: { danger: true },
      onOk: () => deleteProduct(id),
    });
  };

  const columns: TableProps<Product>['columns'] = [
    {
      title: 'Gambar',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (img: string) => (
        <Image
          width={48}
          height={48}
          src={img}
          fallback="/image/placeholder.png"
          className="rounded-md object-cover border border-slate-200 dark:border-[#232323]"
          preview={false}
        />
      ),
    },
    {
      title: 'Kode',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (text) => <Text className="font-mono text-xs">{text}</Text>,
    },
    {
      title: 'Nama Produk',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kategori',
      key: 'categories',
      dataIndex: 'categories',
      render: (categories: Product['categories']) => (
        <div className="flex flex-wrap gap-1">
          {categories.map((c) => (
            <Tag key={c.id} bordered={false} color="orange">
              {c.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Harga Jual',
      dataIndex: 'sale_price',
      key: 'sale_price',
      align: 'right',
      render: (val: number) => (
        <Text strong>
          Rp {new Intl.NumberFormat('id-ID').format(val)}
        </Text>
      ),
    },
    {
      title: 'Satuan',
      dataIndex: ['unit', 'name'],
      key: 'unit',
      align: 'center',
      render: (unitName: string) => unitName ? <Tag bordered={false}>{unitName}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Stok',
      key: 'quantity',
      align: 'center',
      render: (_, record) => (
        <Text strong>{record.quantity}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'error'} bordered={false}>
          {active ? 'Aktif' : 'Nonaktif'}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 60,
      render: (_, record) => (
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          rootClassName="dark:ant-dropdown-menu-dark"
          menu={{
            items: [
              {
                key: 'detail',
                label: 'Detail',
                icon: <EyeOutlined />,
                onClick: () => navigate(`/super-admin/product/${record.id}`)
              },
              {
                key: 'update',
                label: 'Update',
                icon: <EditOutlined />,
                onClick: () => navigate(`/super-admin/product/${record.id}/edit`)
              },
              {
                key: 'toggle',
                label: 'Ubah Status',
                icon: <SwapOutlined />,
                onClick: () => toggleActive({ ids: [record.id] })
              },
              {
                type: 'divider'
              },
              {
                key: 'delete',
                label: 'Hapus',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDelete(record.id, record.name)
              }
            ]
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Table<Product>
      columns={columns}
      dataSource={data?.data}
      rowKey="id"
      loading={isLoading}
      scroll={{ x: 'max-content' }}
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectChange,
      }}
      pagination={{
        current: page,
        pageSize: size,
        total: data?.meta.total || 0,
        showSizeChanger: true,
        onChange: (newPage, newSize) => onTableChange(newPage, newSize),
      }}
      className="border border-slate-200 dark:border-[#202020] rounded-lg overflow-hidden"
    />
  );
};
