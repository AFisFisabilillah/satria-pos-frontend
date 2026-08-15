import { Table, Dropdown, Button } from 'antd';
import { MoreOutlined, EyeOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { MenuProps } from 'antd';
import type { PaginatedResponse } from '../../types/api';
import type { StockSupply } from '../../types/stockSupply';
import dayjs from 'dayjs';

interface StockSupplyTableProps {
  data?: PaginatedResponse<StockSupply>;
  isLoading: boolean;
  page: number;
  size: number;
  onTableChange: (page: number, size: number) => void;
  onAction?: (action: 'detail', record: StockSupply) => void;
}

export const StockSupplyTable = ({
  data,
  isLoading,
  page,
  size,
  onTableChange,
  onAction,
}: StockSupplyTableProps) => {

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
      title: 'Nomor Invoice',
      dataIndex: 'invoice_number',
      render: (text: string) => <span className="font-mono bg-slate-100 dark:bg-[#202020] px-2 py-1 rounded">{text}</span>
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      render: (date: string) => dayjs(date).format('DD MMMM YYYY')
    },
    {
      title: 'Supplier',
      dataIndex: 'suplier',
      render: (text: string) => text || '-',
    },
    {
      title: 'Catatan',
      dataIndex: 'notes',
      render: (text: string) => text || '-',
    },
    {
      title: 'Aksi',
      width: 80,
      render: (_: unknown, record: StockSupply) => {
        const items: MenuProps['items'] = [
          {
            key: 'detail',
            icon: <EyeOutlined />,
            label: 'Detail',
          }
        ];

        return (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => onAction?.(key as any, record)
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data?.data || []}
      loading={isLoading}
      onChange={handleTableChange}
      scroll={{ x: 800 }}
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
