import { useParams, useNavigate, Link } from 'react-router';
import { Card, Descriptions, Typography, Button, Spin, Tag, Table } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useVoucher } from '../../hooks/useVouchers';
import type { VoucherTransaction } from '../../types/voucher';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const VoucherDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: voucher, isLoading, isError } = useVoucher(id!);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  if (isError || !voucher) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Data Voucher tidak ditemukan.</Title>
        <Button onClick={() => navigate('/super-admin/voucher')}>Kembali</Button>
      </div>
    );
  }

  const isExpired = dayjs(voucher.expired_at).isBefore(dayjs(), 'day');

  const columns = [
    {
      title: 'Nomor Invoice',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      render: (text: string, record: VoucherTransaction) => (
        <Link to={`/super-admin/transaction/${record.id}`} className="font-mono text-[#ff6a00] hover:underline">
          {text}
        </Link>
      ),
    },
    {
      title: 'Total Harga',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (val: number) => <Text strong>Rp {val.toLocaleString('id-ID')}</Text>,
    },
    {
      title: 'Metode Pembayaran',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (val: string) => (
        <Tag color="blue" className="uppercase font-semibold text-xs">
          {val}
        </Tag>
      ),
    },
    {
      title: 'Tanggal Transaksi',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (val: string) => dayjs(val).format('DD MMMM YYYY, HH:mm'),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: VoucherTransaction) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/super-admin/transaction/${record.id}`)}
          className="text-[#ff6a00] hover:text-[#e55e00] p-0"
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/super-admin/voucher')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="m-0!">Detail Voucher</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <Descriptions layout="vertical" column={{ xs: 1, sm: 2, md: 3 }} size="middle" bordered>
          <Descriptions.Item label={<Text className="text-slate-500">Nama Voucher</Text>}>
            <Text strong>{voucher.name}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Kode Voucher</Text>}>
            <span className="font-mono bg-slate-100 dark:bg-[#202020] px-2 py-1 rounded">
              {voucher.code}
            </span>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Status</Text>}>
            <Tag color={voucher.active ? 'green' : 'default'}>
              {voucher.active ? 'Aktif' : 'Nonaktif'}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Tipe Diskon</Text>}>
            <Tag color={voucher.type === 'percent' ? 'blue' : 'green'}>
              {voucher.type === 'percent' ? 'Persentase' : 'Nominal'}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Nilai Diskon</Text>}>
            <Text strong>
              {voucher.type === 'percent'
                ? `${voucher.value}%`
                : `Rp ${Number(voucher.value).toLocaleString('id-ID')}`}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Minimal Pembelian</Text>}>
            <Text>
              {voucher.min_purchase
                ? `Rp ${Number(voucher.min_purchase).toLocaleString('id-ID')}`
                : '-'}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Kuota</Text>}>
            <Text>{voucher.quota} penggunaan</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Tanggal Kadaluarsa</Text>}>
            <Text className={isExpired ? 'text-red-500 font-semibold' : ''}>
              {dayjs(voucher.expired_at).format('DD MMMM YYYY')}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Dibuat Pada</Text>}>
            <Text>{dayjs(voucher.created_at).format('DD MMMM YYYY HH:mm')}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={<Title level={4} className="m-0!">Riwayat Penggunaan Voucher</Title>}
        className="dark:bg-[#141414] dark:border-[#202020] shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={voucher.transactions || []}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: 'Belum ada transaksi yang menggunakan voucher ini' }}
        />
      </Card>
    </div>
  );
};
