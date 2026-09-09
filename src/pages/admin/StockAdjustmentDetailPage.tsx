import { useParams, useNavigate } from 'react-router';
import { Card, Descriptions, Typography, Button, Spin, Tag, Avatar, Space } from 'antd';
import { ArrowLeftOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useStockAdjustment } from '../../hooks/useStockAdjustments';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const StockAdjustmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: adjustment, isLoading, isError } = useStockAdjustment(id!);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  if (isError || !adjustment) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Data Penyesuaian Stok tidak ditemukan.</Title>
        <Button onClick={() => navigate('/super-admin/stock-adjustment')}>Kembali</Button>
      </div>
    );
  }

  const getTypeTag = (type: string) => {
    switch (type) {
      case 'damaged':
        return <Tag color="red" className="text-sm px-3 py-1">Rusak (Damaged)</Tag>;
      case 'lost':
        return <Tag color="volcano" className="text-sm px-3 py-1">Hilang (Lost)</Tag>;
      case 'expired':
        return <Tag color="orange" className="text-sm px-3 py-1">Kadaluarsa (Expired)</Tag>;
      case 'correction':
        return <Tag color="blue" className="text-sm px-3 py-1">Koreksi Stok</Tag>;
      default:
        return <Tag color="default" className="uppercase text-sm px-3 py-1">{type}</Tag>;
    }
  };

  const product = adjustment.stock_supply_item?.product_summary;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/super-admin/stock-adjustment')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="m-0!">Detail Penyesuaian Stok</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-slate-200 dark:border-[#202020]">
          <div className="flex items-center gap-4">
            {product?.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-[#232323]"
              />
            ) : (
              <div className="w-14 h-14 bg-slate-100 dark:bg-[#202020] rounded-lg flex items-center justify-center border border-slate-200 dark:border-[#232323]">
                <ShoppingCartOutlined className="text-slate-400 text-xl" />
              </div>
            )}
            <div>
              <Text type="secondary" className="block text-xs uppercase font-semibold">Produk</Text>
              <Title level={4} className="m-0!">{product?.name || '-'}</Title>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right flex flex-col items-start md:items-end">
            <Text type="secondary" className="block text-xs uppercase font-semibold mb-1">Tipe Adjustment</Text>
            {getTypeTag(adjustment.type)}
          </div>
        </div>

        <Descriptions layout="vertical" column={{ xs: 1, sm: 2, md: 3 }} size="middle" bordered>
          <Descriptions.Item label={<Text className="text-slate-500">Jumlah Adjustment</Text>}>
            <Text strong className="text-red-500 text-lg">{adjustment.quantity} Unit</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Alasan</Text>}>
            <Text strong>{adjustment.reason || '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Operator (User)</Text>}>
            <Space size="small">
              <Avatar size="small" src={adjustment.user?.foto_profile} icon={<UserOutlined />} className="bg-[#ff6a00]" />
              <Text strong>{adjustment.user?.name || '-'}</Text>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Harga Beli Batch</Text>}>
            <Text>
              {adjustment.stock_supply_item?.purchase_price
                ? `Rp ${Number(adjustment.stock_supply_item.purchase_price).toLocaleString('id-ID')}`
                : '-'}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Total Stok Awal Batch</Text>}>
            <Text>{adjustment.stock_supply_item?.quantity_in || '-'} Unit</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Sisa Stok Batch Saat Ini</Text>}>
            <Text>{adjustment.stock_supply_item?.quantity_remaining ?? '-'} Unit</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Tanggal Kadaluarsa Batch</Text>}>
            <Text>
              {adjustment.stock_supply_item?.expired_at
                ? dayjs(adjustment.stock_supply_item.expired_at).format('DD MMMM YYYY')
                : '-'}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Waktu Penyesuaian</Text>}>
            <Text>{dayjs(adjustment.created_at).format('DD MMMM YYYY, HH:mm')}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};
