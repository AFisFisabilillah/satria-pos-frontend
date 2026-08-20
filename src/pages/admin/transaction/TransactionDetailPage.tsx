import { useParams, useNavigate } from 'react-router';
import { Card, Descriptions, Button, Spin, Typography, Table, Tag, Divider, Image } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTransaction } from '../../../hooks/useTransactions';
import type { TransactionItem } from '../../../types/transaction';

const { Title, Text } = Typography;

export const TransactionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: transaction, isLoading, isError } = useTransaction(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !transaction) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Transaksi tidak ditemukan atau terjadi kesalahan.</Title>
        <Button onClick={() => navigate('/super-admin/transaction')}>Kembali</Button>
      </div>
    );
  }

  const columns = [
    {
      title: 'Produk',
      dataIndex: ['product', 'name'],
      key: 'product_name',
      render: (text: string, record: TransactionItem) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.product.image}
            fallback="/image/placeholder.png"
            width={40}
            height={40}
            className="rounded object-cover border border-slate-200 dark:border-[#232323]"
          />
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Harga Satuan',
      dataIndex: 'selling_price',
      key: 'selling_price',
      align: 'right' as const,
      render: (val: number) => `Rp ${new Intl.NumberFormat('id-ID').format(val)}`,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      render: (val: number) => <Text strong>{val}</Text>,
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'right' as const,
      render: (val: number) => <Text strong className="text-[#ff6a00]">Rp {new Intl.NumberFormat('id-ID').format(val)}</Text>,
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/super-admin/transaction')}
            type="text"
            className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
          />
          <Title level={3} className="!m-0">Detail Transaksi</Title>
        </div>
        <Button icon={<PrinterOutlined />} type="primary" className="bg-[#ff6a00]">Cetak Struk</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="dark:bg-[#141414] dark:border-[#202020]" title="Informasi Utama">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="No. Invoice">
                <Text strong className="text-[#ff6a00] font-mono">{transaction.invoice_number}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tanggal">
                {dayjs(transaction.created_at).format('DD MMM YYYY, HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Metode Pembayaran">
                <Tag color={transaction.payment_method === 'cash' ? 'green' : transaction.payment_method === 'qris' ? 'blue' : 'purple'} className="uppercase">
                  {transaction.payment_method}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Item">
                {transaction.items?.length || 0}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card className="dark:bg-[#141414] dark:border-[#202020]" title="Rincian Produk" bodyStyle={{ padding: 0 }}>
            <Table
              dataSource={transaction.items}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
            <div className="p-4 bg-slate-50 dark:bg-[#1f1f1f] border-t border-slate-200 dark:border-[#202020]">
              <div className="flex justify-between items-center py-1">
                <Text type="secondary">Total Belanja</Text>
                <Text strong>Rp {new Intl.NumberFormat('id-ID').format(transaction.total_price)}</Text>
              </div>
              <div className="flex justify-between items-center py-1">
                <Text type="secondary">Jumlah Bayar</Text>
                <Text strong>Rp {new Intl.NumberFormat('id-ID').format(transaction.paid_amount)}</Text>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between items-center py-1">
                <Text strong>Kembalian</Text>
                <Text strong className="text-xl text-[#ff6a00]">Rp {new Intl.NumberFormat('id-ID').format(transaction.change_amount)}</Text>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="dark:bg-[#141414] dark:border-[#202020] h-full" title="Informasi Member">
            {transaction.member ? (
              <div className="flex flex-col gap-3">
                <div className="text-center mb-2">
                  <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">
                    {transaction.member.name.charAt(0).toUpperCase()}
                  </div>
                  <Title level={5} className="!m-0">{transaction.member.name}</Title>
                  <Text type="secondary" className="font-mono text-xs">{transaction.member.member_code}</Text>
                </div>
                <Divider className="my-2" />
                <Descriptions column={1} size="small" layout="vertical">
                  <Descriptions.Item label="Telepon" className="pb-2">{transaction.member.phone || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Email" className="pb-2">{transaction.member.email || '-'}</Descriptions.Item>
                </Descriptions>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Text type="secondary">Pelanggan Umum (Bukan Member)</Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
