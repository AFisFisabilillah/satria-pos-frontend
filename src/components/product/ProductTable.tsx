import { Table, Tag, Typography, Image } from 'antd';
import type { TableProps } from 'antd';
import type { Product } from '../../types/product';
import type { PaginatedResponse } from '../../types/api';

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
          src={img ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/${img}` : '/image/placeholder.png'}
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
      title: 'Stok',
      key: 'total_stock',
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Text>{record.total_stock}</Text>
          <Text type="secondary" className="text-xs">{record.unit?.name}</Text>
        </div>
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
