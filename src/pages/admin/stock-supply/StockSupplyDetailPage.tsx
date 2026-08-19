import { useParams, useNavigate, Link } from 'react-router';
import { Card, Descriptions, Typography, Button, Spin, Table, Tag, App, Popconfirm } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useStockSupply, useDeleteStockSupplyItem } from '../../../hooks/useStockSupply';
import type { StockSupplyDetailItem } from '../../../types/stockSupply';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const StockSupplyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const { data: stockSupply, isLoading, isError } = useStockSupply(id!);

  const { mutate: deleteItem, isPending: isDeletingItem } = useDeleteStockSupplyItem({
    onSuccess: () => message.success('Item produk berhasil dihapus dari stock supply'),
    onError: () => message.error('Gagal menghapus item produk dari stock supply'),
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  if (isError || !stockSupply) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Data Stock Supply tidak ditemukan.</Title>
        <Button onClick={() => navigate('/super-admin/stock-supply')}>Kembali</Button>
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
      title: 'Produk ID / Nama',
      render: (_: unknown, record: StockSupplyDetailItem) => {
        return (
          <div className="flex items-center gap-3">
            {record.product_summary?.image && (
              <img
                src={record.product_summary.image}
                alt={record.product_summary.name}
                className="w-10 h-10 object-cover rounded-md border border-slate-200 dark:border-[#232323]"
              />
            )}
            <div className="flex flex-col">
              <span className="font-semibold">{record.product_summary?.name ||  '-'}</span>
              <span className="text-xs text-slate-500">ID: {record.product_summary.id}</span>
            </div>
          </div>
        );
      }
    },
    {
      title: 'Jumlah Awal',
      dataIndex: 'quantity_in',
    },
    {
      title: 'Jumlah Tersisa',
      dataIndex: 'quantity_remaining',
      render: (remaining: number, record: StockSupplyDetailItem) => {
        let color = 'default';
        if (remaining === 0) color = 'red';
        else if (remaining < record.quantity_in) color = 'orange';
        else color = 'green';

        return <Tag color={color}>{remaining}</Tag>;
      }
    },
    {
      title: 'Harga Beli Satuan',
      dataIndex: 'purchase_price',
      render: (value: string | number) => `Rp ${Number(value).toLocaleString('id-ID')}`
    },
    {
      title: 'Total Harga',
      key: 'total',
      render: (_: unknown, record: StockSupplyDetailItem) => {
        const total = record.quantity_in * Number(record.purchase_price);
        return `Rp ${total.toLocaleString('id-ID')}`;
      }
    },
    {
      title: 'Tanggal Kadaluarsa',
      dataIndex: 'expired_at',
      render: (text?: string) => text ? dayjs(text).format('DD MMMM YYYY') : '-'
    },
    {
      title: 'Aksi',
      render: (_: unknown, record: StockSupplyDetailItem) => (
        <div className="flex gap-2">
          <Button
            type="link"
            size="large"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/super-admin/product/${record.product_summary?.id}`)}
          />
          <Popconfirm
            title="Hapus produk ini?"
            description="Apakah Anda yakin ingin menghapus produk ini dari daftar stok masuk?"
            onConfirm={() => deleteItem(record.id)}
            okText="Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true, loading: isDeletingItem }}
          >
            <Button type="link" danger size="large" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/super-admin/stock-supply')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="!m-0">Detail Stock Supply</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <Descriptions layout="vertical" column={{ xs: 1, sm: 2, md: 3 }} size="middle" className="mb-6">
          <Descriptions.Item label={<Text className="text-slate-500">Nomor Invoice</Text>}>
            <Text strong className="font-mono bg-slate-100 dark:bg-[#202020] px-2 py-1 rounded">
              {stockSupply.invoice_number || '-'}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Tanggal Masuk</Text>}>
            <Text strong>{dayjs(stockSupply.date).format('DD MMMM YYYY')}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Supplier</Text>}>
            {stockSupply.suplier ? (
              <div className="flex flex-col">
                <Link to={`/super-admin/supplier/${stockSupply.suplier.id}`}>
                    <Text className='text-primary underline hover:opacity-85' strong>{stockSupply.suplier.name}</Text>
                </Link>
                <Text className="text-xs text-slate-500">{stockSupply.suplier.phone || '-'}</Text>
                {stockSupply.suplier.city && <Text className="text-xs text-slate-500">{stockSupply.suplier.city}</Text>}
              </div>
            ) : (
              <Text>-</Text>
            )}
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Catatan</Text>}>
            <Text>{stockSupply.notes || '-'}</Text>
          </Descriptions.Item>
        </Descriptions>

        <Title level={5} className="mt-8 mb-4">Daftar Produk Masuk</Title>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={stockSupply.items || []}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};
