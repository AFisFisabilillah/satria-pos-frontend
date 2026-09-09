import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Table, Input, Card, Typography, DatePicker, Select, Tag, Avatar, Space, Button } from 'antd';
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useStockAdjustments } from '../../hooks/useStockAdjustments';
import type { StockAdjustment } from '../../types/stockAdjustment';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export const StockAdjustmentPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: adjustmentsData, isLoading } = useStockAdjustments({
    search: search || undefined,
    type: type || undefined,
    start_date: dateRange ? dateRange[0] : undefined,
    end_date: dateRange ? dateRange[1] : undefined,
    page,
    size: pageSize,
  });

  const getTypeTag = (adjType: string) => {
    switch (adjType) {
      case 'damaged':
        return <Tag color="red">Rusak (Damaged)</Tag>;
      case 'lost':
        return <Tag color="volcano">Hilang (Lost)</Tag>;
      case 'expired':
        return <Tag color="orange">Kadaluarsa (Expired)</Tag>;
      case 'correction':
        return <Tag color="blue">Koreksi Stok</Tag>;
      default:
        return <Tag color="default" className="uppercase">{adjType}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Produk',
      dataIndex: ['stock_supply_item', 'product_summary'],
      key: 'product',
      render: (product: any) => (
        <div className="flex items-center gap-3">
          {product?.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-9 h-9 object-cover rounded border border-slate-200 dark:border-[#232323]"
            />
          ) : (
            <div className="w-9 h-9 bg-slate-100 dark:bg-[#202020] rounded flex items-center justify-center border border-slate-200 dark:border-[#232323]">
              <ShoppingCartOutlined className="text-slate-400 text-xs" />
            </div>
          )}
          <span className="font-semibold text-sm">{product?.name || '-'}</span>
        </div>
      ),
    },
    {
      title: 'Jumlah Adjustment',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => <Tag color="red" className="font-semibold text-sm px-2 py-0.5">{qty} Unit</Tag>,
    },
    {
      title: 'Tipe Adjustment',
      dataIndex: 'type',
      key: 'type',
      render: (val: string) => getTypeTag(val),
    },
    {
      title: 'Alasan',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason?: string) => reason || '-',
    },
    {
      title: 'User (Operator)',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => (
        <Space size="small">
          <Avatar size="small" src={user?.foto_profile} icon={<UserOutlined />} className="bg-[#ff6a00]" />
          <span className="text-sm font-medium">{user?.name || '-'}</span>
        </Space>
      ),
    },
    {
      title: 'Tanggal',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (val: string) => dayjs(val).format('DD MMMM YYYY, HH:mm'),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: StockAdjustment) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/super-admin/stock-adjustment/${record.id}`)}
          className="text-[#ff6a00] hover:text-[#e55e00] p-0"
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title level={3} className="m-0!">Penyesuaian Stok (Stock Adjustment)</Title>
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            Riwayat pencatatan barang rusak, hilang, expired, atau koreksi stok
          </span>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/super-admin/stock-adjustment/create')}
          size="large"
          className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
        >
          Tambah Adjustment
        </Button>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Cari alasan / produk..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
            allowClear
          />
          <Select
            placeholder="Tipe Adjustment"
            allowClear
            className="w-full sm:w-48"
            value={type}
            onChange={setType}
            options={[
              { label: 'Rusak (Damaged)', value: 'damaged' },
              { label: 'Hilang (Lost)', value: 'lost' },
              { label: 'Kadaluarsa (Expired)', value: 'expired' },
              { label: 'Koreksi Stok', value: 'correction' },
            ]}
          />
          <RangePicker
            className="w-full sm:w-64"
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
              } else {
                setDateRange(undefined);
              }
            }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={adjustmentsData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize,
            total: adjustmentsData?.meta?.total || 0,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  );
};
