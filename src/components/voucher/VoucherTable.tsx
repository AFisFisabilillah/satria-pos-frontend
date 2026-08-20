import { Table, Tag } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import type { PaginatedResponse } from '../../types/api';
import type { Voucher } from '../../types/voucher';
import dayjs from 'dayjs';

interface VoucherTableProps {
  data?: PaginatedResponse<Voucher>;
  isLoading: boolean;
  page: number;
  size: number;
  onTableChange: (page: number, size: number) => void;
}

export const VoucherTable = ({
  data,
  isLoading,
  page,
  size,
  onTableChange,
}: VoucherTableProps) => {

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
      title: 'Nama Voucher',
      dataIndex: 'name',
    },
    {
      title: 'Kode',
      dataIndex: 'code',
      render: (text: string) => (
        <span className="font-mono bg-slate-100 dark:bg-[#202020] px-2 py-1 rounded text-xs">
          {text}
        </span>
      ),
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'percent' ? 'blue' : 'green'}>
          {type === 'percent' ? 'Persen' : 'Nominal'}
        </Tag>
      ),
    },
    {
      title: 'Nilai',
      dataIndex: 'value',
      render: (value: number, record: Voucher) =>
        record.type === 'percent'
          ? `${value}%`
          : `Rp ${value.toLocaleString('id-ID')}`,
    },
    {
      title: 'Min. Pembelian',
      dataIndex: 'min_purchase',
      render: (value: number) => `Rp ${value.toLocaleString('id-ID')}`,
    },
    {
      title: 'Kuota',
      dataIndex: 'quota',
    },
    {
      title: 'Expired',
      dataIndex: 'expired_at',
      render: (date: string) => {
        const isExpired = dayjs(date).isBefore(dayjs(), 'day');
        return (
          <span className={isExpired ? 'text-red-500' : ''}>
            {dayjs(date).format('DD MMM YYYY')}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'active',
      width: 100,
      render: (active: number) => (
        <Tag color={active ? 'green' : 'default'}>
          {active ? 'Aktif' : 'Nonaktif'}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data?.data || []}
      loading={isLoading}
      onChange={handleTableChange}
      scroll={{ x: 900 }}
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
