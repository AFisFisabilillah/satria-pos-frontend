import { useState } from 'react';
import { Card, Input, DatePicker, Typography, Table, Tag, Select, InputNumber, Button } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';
import type { TableProps } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { useTransactions } from '../../../hooks/useTransactions';
import type { Transaction } from '../../../types/transaction';
import { useNavigate } from 'react-router';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const PAYMENT_OPTIONS = [
  { label: 'Semua Metode', value: '' },
  { label: 'Cash', value: 'cash' },
  { label: 'QRIS', value: 'qris' },
  { label: 'Transfer', value: 'transfer' },
];

export const TransactionPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [dates, setDates] = useState<[string, string] | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
  const [minTotal, setMinTotal] = useState<number | undefined>();
  const [maxTotal, setMaxTotal] = useState<number | undefined>();
  const [debouncedMinTotal] = useDebounce(minTotal, 500);
  const [debouncedMaxTotal] = useDebounce(maxTotal, 500);
  const [sortBy, setSortBy] = useState<'created_at' | 'total_price' | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const { data, isLoading } = useTransactions({
    search: debouncedSearch || undefined,
    start_date: dates?.[0],
    end_date: dates?.[1],
    payment_method: paymentMethod || undefined,
    min_total: debouncedMinTotal,
    max_total: debouncedMaxTotal,
    sort_by: sortBy,
    sort_direction: sortDirection,
    page,
    size,
  });

  const handleTableChange: TableProps<Transaction>['onChange'] = (_pagination, _filters, sorter) => {
    const s = sorter as SorterResult<Transaction>;
    if (s.field && s.order) {
      const field = s.field as string;
      setSortBy(field as 'created_at' | 'total_price');
      setSortDirection(s.order === 'ascend' ? 'asc' : 'desc');
    } else {
      setSortBy(undefined);
      setSortDirection(undefined);
    }
  };

  const columns: TableProps<Transaction>['columns'] = [
    {
      title: 'No. Invoice',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      render: (text) => <Text strong className="font-mono text-[#ff6a00]">{text}</Text>,
    },
    {
      title: 'Tanggal Waktu',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      sortOrder: sortBy === 'created_at' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (val) => dayjs(val).format('DD MMM YYYY, HH:mm'),
    },
    {
      title: 'Total Harga',
      dataIndex: 'total_price',
      key: 'total_price',
      align: 'right',
      sorter: true,
      sortOrder: sortBy === 'total_price' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (val) => <Text strong>Rp {new Intl.NumberFormat('id-ID').format(val)}</Text>,
    },
    {
      title: 'Total Dibayar',
      dataIndex: 'paid_amount',
      key: 'paid_amount',
      align: 'right',
      render: (val) => `Rp ${new Intl.NumberFormat('id-ID').format(val)}`,
    },
    {
      title: 'Kembalian',
      dataIndex: 'change_amount',
      key: 'change_amount',
      align: 'right',
      render: (val) => `Rp ${new Intl.NumberFormat('id-ID').format(val)}`,
    },
    {
      title: 'Metode',
      dataIndex: 'payment_method',
      key: 'payment_method',
      align: 'center',
      render: (val: string) => {
        const color = val === 'cash' ? 'green' : val === 'qris' ? 'blue' : 'purple';
        return <Tag color={color} bordered={false} className="uppercase">{val}</Tag>;
      },
    },
    {
      title: 'Jml Item',
      dataIndex: 'items_count',
      key: 'items_count',
      align: 'center',
    },
    {
      title: 'Aksi',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/super-admin/transaction/${record.id}`)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Title level={3} className="!m-0">Riwayat Transaksi</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] rounded-xl shadow-sm">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Cari nomor invoice..."
              prefix={<SearchOutlined className="text-slate-400" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              className="md:w-64"
            />
            <RangePicker
              className="md:w-72"
              format="YYYY-MM-DD"
              onChange={(_, dateStrings) => {
                if (dateStrings[0] && dateStrings[1]) {
                  setDates([dateStrings[0], dateStrings[1]]);
                } else {
                  setDates(undefined);
                }
                setPage(1);
              }}
            />
            <Select
              placeholder="Metode Pembayaran"
              allowClear
              className="md:w-48"
              value={paymentMethod || undefined}
              onChange={(val) => { setPaymentMethod(val || undefined); setPage(1); }}
              options={PAYMENT_OPTIONS.filter(o => o.value)}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <InputNumber
              placeholder="Min Total"
              className="md:w-48"
              min={0}
              value={minTotal}
              onChange={(val) => { setMinTotal(val ?? undefined); setPage(1); }}
              formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={(value) => (value ? Number(value.replace(/\Rp\s?|(\.*)/g, '')) : 0) as 0}
            />
            <InputNumber
              placeholder="Max Total"
              className="md:w-48"
              min={0}
              value={maxTotal}
              onChange={(val) => { setMaxTotal(val ?? undefined); setPage(1); }}
              formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={(value) => (value ? Number(value.replace(/\Rp\s?|(\.*)/g, '')) : 0) as 0}
            />
          </div>
        </div>

        <Table<Transaction>
          columns={columns}
          dataSource={data?.data}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 'max-content' }}
          onChange={handleTableChange}
          pagination={{
            current: page,
            pageSize: size,
            total: data?.meta.total || 0,
            showSizeChanger: true,
            onChange: (newPage, newSize) => {
              setPage(newPage);
              setSize(newSize);
            },
          }}
          className="border border-slate-200 dark:border-[#202020] rounded-lg overflow-hidden"
        />
      </Card>
    </div>
  );
};
