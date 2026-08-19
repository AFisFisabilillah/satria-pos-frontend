import { useParams, useNavigate, Link } from 'react-router';
import { Card, Descriptions, Typography, Button, Spin, Table, Empty } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useSupplier } from '../../hooks/useSuppliers';
import type { StockSupply } from '../../types/stockSupply';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const SupplierDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: supplier, isLoading, isError } = useSupplier(id!);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  if (isError || !supplier) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Data Supplier tidak ditemukan.</Title>
        <Button onClick={() => navigate('/super-admin/supplier')}>Kembali</Button>
      </div>
    );
  }

  const columns = [
    {
      title: 'No',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'Nomor Invoice',
      dataIndex: 'invoice_number',
      render: (text: string) => (
        <span className="font-mono bg-slate-100 dark:bg-[#202020] px-2 py-1 rounded">{text}</span>
      ),
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      render: (date: string) => dayjs(date).format('DD MMMM YYYY'),
    },
    {
      title: 'Total Qty',
      dataIndex: 'total_items_quantity',
      render: (qty: number) => qty ?? '-',
    },
    {
      title: 'Varian Barang',
      dataIndex: 'total_item_types',
      render: (types: number) => types ?? '-',
    },
    {
      title: 'Catatan',
      dataIndex: 'notes',
      render: (text: string) => text || '-',
    },
    {
      title: 'Aksi',
      width: 80,
      render: (_: unknown, record: StockSupply) => (
        <Link to={`/super-admin/stock-supply/${record.id}`}>
          <Button type="link" icon={<EyeOutlined />} />
        </Link>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/super-admin/supplier')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="!m-0">Detail Supplier</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <Descriptions layout="vertical" column={{ xs: 1, sm: 2, md: 3 }} size="middle" className="mb-6">
          <Descriptions.Item label={<Text className="text-slate-500">Nama Supplier</Text>}>
            <Text strong>{supplier.name}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">No HP</Text>}>
            <Text strong>{supplier.phone || '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Kota</Text>}>
            <Text strong>{supplier.city || '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Provinsi</Text>}>
            <Text strong>{supplier.province || '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Kode Pos</Text>}>
            <Text strong>{supplier.postal_code || '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Alamat</Text>}>
            <Text>{supplier.address || '-'}</Text>
          </Descriptions.Item>
        </Descriptions>

        <Title level={5} className="mt-8 mb-4">Riwayat Stock Supply</Title>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={supplier.stock_suppliers || []}
          pagination={false}
          scroll={{ x: 800 }}
          locale={{ emptyText: <Empty description="Belum ada riwayat stock supply" /> }}
        />
      </Card>
    </div>
  );
};
