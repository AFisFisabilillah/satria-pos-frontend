import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Table, Input, Card, Button, Typography, DatePicker, Select, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useSupplierReturns } from '../../hooks/useSupplierReturns';
import { useSuppliers } from '../../hooks/useSuppliers';
import type { SupplierReturn } from '../../types/supplierReturn';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export const SupplierReturnPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [supplierId, setSupplierId] = useState<number | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: suppliersData } = useSuppliers({ size: 100 });
  const { data: returnsData, isLoading } = useSupplierReturns({
    search: search || undefined,
    suplier_id: supplierId,
    startDate: dateRange ? dateRange[0] : undefined,
    endDate: dateRange ? dateRange[1] : undefined,
    page,
    size: pageSize,
  });

  const columns = [
    {
      title: 'Nomor Retur',
      dataIndex: 'return_number',
      key: 'return_number',
      render: (text: string, record: SupplierReturn) => (
        <Link to={`/super-admin/supplier-return/${record.id}`} className="font-mono text-[#ff6a00] hover:underline">
          {text}
        </Link>
      ),
    },
    {
      title: 'Supplier',
      dataIndex: 'suplier',
      key: 'suplier',
      render: (suplier: any) => suplier?.name || '-',
    },
    {
      title: 'Tanggal Retur',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD MMMM YYYY'),
    },
    {
      title: 'Jumlah Item',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => <Tag color="blue">{items?.length || 0} Item</Tag>,
    },
    {
      title: 'Catatan',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes?: string) => notes || '-',
    },
    {
      title: 'Dibuat Pada',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (val: string) => dayjs(val).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: SupplierReturn) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/super-admin/supplier-return/${record.id}`)}
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
          <Title level={3} className="!m-0">Retur Supplier</Title>
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            Daftar pengembalian produk ke supplier
          </span>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/super-admin/supplier-return/create')}
          size="large"
          className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
        >
          Tambah Retur Supplier
        </Button>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Cari nomor retur / catatan..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
            allowClear
          />
          <Select
            placeholder="Pilih Supplier"
            allowClear
            className="w-full sm:w-56"
            value={supplierId}
            onChange={setSupplierId}
            options={suppliersData?.data?.map((s) => ({ label: s.name, value: s.id })) || []}
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
          dataSource={returnsData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize,
            total: returnsData?.meta?.total || 0,
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
