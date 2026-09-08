import { useParams, useNavigate } from 'react-router';
import { Card, Descriptions, Typography, Button, Spin, Table, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSupplierReturn } from '../../hooks/useSupplierReturns';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const SupplierReturnDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: returnData, isLoading, isError } = useSupplierReturn(id!);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  if (isError || !returnData) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Data Retur Supplier tidak ditemukan.</Title>
        <Button onClick={() => navigate('/super-admin/supplier-return')}>Kembali</Button>
      </div>
    );
  }

  const columns = [
    {
      title: 'Produk',
      dataIndex: ['batch_info', 'product_name'],
      key: 'product_name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Jumlah Retur',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => <Tag color="red" className="font-semibold">{qty} Unit</Tag>,
    },
    {
      title: 'Harga Beli (Batch)',
      dataIndex: ['batch_info', 'purchase_price'],
      key: 'purchase_price',
      render: (price: string) => `Rp ${Number(price).toLocaleString('id-ID')}`,
    },
    {
      title: 'Alasan Retur',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => reason || '-',
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/super-admin/supplier-return')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="!m-0">Detail Retur Supplier</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-[#202020]">
          <div>
            <Text type="secondary" className="block text-xs uppercase font-semibold">Nomor Retur</Text>
            <Text className="text-xl font-bold font-mono text-[#ff6a00]">{returnData.return_number}</Text>
          </div>
          <Tag color="orange" className="text-sm px-3 py-1">Retur Berhasil</Tag>
        </div>

        <Descriptions layout="vertical" column={{ xs: 1, sm: 2, md: 3 }} size="middle" bordered>
          <Descriptions.Item label={<Text className="text-slate-500">Supplier</Text>}>
            <Text strong>{returnData.suplier?.name || '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Telepon Supplier</Text>}>
            <Text>{returnData.suplier?.phone || '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Kota / Alamat</Text>}>
            <Text>{returnData.suplier?.city ? `${returnData.suplier.city}, ${returnData.suplier.province}` : '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Tanggal Retur</Text>}>
            <Text strong>{dayjs(returnData.date).format('DD MMMM YYYY')}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Catatan</Text>}>
            <Text>{returnData.notes || '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Dibuat Pada</Text>}>
            <Text>{dayjs(returnData.created_at).format('DD MMMM YYYY HH:mm')}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={<Title level={4} className="!m-0">Daftar Item Retur</Title>}
        className="dark:bg-[#141414] dark:border-[#202020] shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={returnData.items || []}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};
