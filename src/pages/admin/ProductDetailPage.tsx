import { useParams, useNavigate } from 'react-router';
import { Card, Descriptions, Tag, Button, Spin, Typography, Image, Table } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useProduct } from '../../hooks/useProducts';

const { Title, Text } = Typography;

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: product, isLoading, isError } = useProduct(id!);

  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Produk tidak ditemukan atau terjadi kesalahan.</Title>
        <Button onClick={() => navigate('/super-admin/product')}>Kembali</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/super-admin/product')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="!m-0">Detail Produk: {product.name}</Title>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="dark:bg-[#141414] dark:border-[#202020] h-full flex flex-col items-center justify-center p-4">
            <Image
              src={product.image}
              fallback="/image/placeholder.png"
              className="rounded-lg object-cover w-full max-w-[250px] aspect-square border border-slate-200 dark:border-[#232323]"
            />
            
            <div className="mt-4 text-center">
              <Tag color={product.active ? 'success' : 'error'} className="text-sm px-3 py-1">
                {product.active ? 'Aktif' : 'Nonaktif'}
              </Tag>
            </div>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="dark:bg-[#141414] dark:border-[#202020] h-full">
            <Descriptions title="Informasi Dasar" column={1} bordered size="middle" labelStyle={{ width: '150px' }}>
              <Descriptions.Item label="Kode">{product.code}</Descriptions.Item>
              <Descriptions.Item label="Nama">{product.name}</Descriptions.Item>
              <Descriptions.Item label="Slug">{product.slug}</Descriptions.Item>
              <Descriptions.Item label="Kategori">
                <div className="flex gap-1 flex-wrap">
                  {product.categories?.map(c => (
                    <Tag key={c.id} color="orange" bordered={false}>{c.name}</Tag>
                  ))}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Satuan">{product.unit?.name}</Descriptions.Item>
              <Descriptions.Item label="Harga Jual">
                <Text strong className="text-[#ff6a00]">
                  Rp {new Intl.NumberFormat('id-ID').format(product.sale_price)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Total Stok Saat Ini">
                <Text strong>{product.quantity} {product.unit?.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Deskripsi">
                {product.description || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020]" title="Riwayat Stok Masuk">
        <Table
          dataSource={product.stok_history}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
          columns={[
            {
              title: 'Supplier',
              dataIndex: 'suppliers',
              key: 'suppliers',
            },
            {
              title: 'Qty Masuk',
              dataIndex: 'quantity_in',
              align: 'right',
              render: (v) => <Text strong>{v}</Text>
            },
            {
              title: 'Qty Sisa',
              dataIndex: 'quantity_remaining',
              align: 'right',
              render: (v) => <Text type={v === 0 ? 'danger' : 'success'} strong>{v}</Text>
            },
            {
              title: 'Harga Beli/Pcs',
              dataIndex: 'purchase_price',
              align: 'right',
              render: (val: string) => `Rp ${new Intl.NumberFormat('id-ID').format(Number(val))}`
            },
            {
              title: 'Tgl Kedaluwarsa',
              dataIndex: 'expired_at',
              render: (val) => val ? new Date(val).toLocaleDateString('id-ID') : '-'
            },
            {
              title: 'Tgl Masuk',
              dataIndex: 'created_at',
              render: (val) => new Date(val).toLocaleDateString('id-ID'),
            },
          ]}
        />
      </Card>
    </div>
  );
};
