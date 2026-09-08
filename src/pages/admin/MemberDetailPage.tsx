import { useParams, useNavigate, Link } from 'react-router';
import { Card, Descriptions, Typography, Button, Spin, Tag, Space, Table } from 'antd';
import { ArrowLeftOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useMember } from '../../hooks/useMembers';
import type { MemberTransaction } from '../../types/member';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const MemberDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: member, isLoading, isError } = useMember(id!);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  if (isError || !member) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Member tidak ditemukan.</Title>
        <Button onClick={() => navigate('/super-admin/member')}>Kembali</Button>
      </div>
    );
  }

  const handleEdit = () => {
    navigate('/super-admin/member');
  };

  const columns = [
    {
      title: 'Nomor Invoice',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      render: (text: string, record: MemberTransaction) => (
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
      render: (_: any, record: MemberTransaction) => (
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
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/super-admin/member')}
            type="text"
            className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
          />
          <Title level={3} className="!m-0">Detail Member</Title>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={handleEdit}
          className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
        >
          Lihat Daftar / Edit
        </Button>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-200 dark:border-[#202020] pb-6">
          <Space direction="vertical" size={2}>
            <Title level={4} className="!m-0">{member.name}</Title>
            <Text className="text-slate-500 font-mono text-lg">{member.member_code}</Text>
          </Space>
          <div className="mt-4 md:mt-0 text-right flex flex-col items-end">
            <Text className="text-slate-500 block mb-1">Status Keanggotaan</Text>
            <Tag color={member.active ? 'green' : 'red'} className="!m-0 text-sm px-3 py-1">
              {member.active ? 'Aktif' : 'Nonaktif'}
            </Tag>
          </div>
        </div>

        <Descriptions layout="vertical" column={{ xs: 1, sm: 2, md: 3 }} size="middle">
          <Descriptions.Item label={<Text className="text-slate-500">Email</Text>}>
            <Text strong>{member.email || '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Nomor Telepon</Text>}>
            <Text strong>{member.phone || '-'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Total Belanja</Text>}>
            <Text strong className="text-green-600 dark:text-green-500 text-lg">
              Rp {member.total_spent.toLocaleString('id-ID')}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Bergabung Sejak</Text>}>
            <Text strong>{dayjs(member.created_at).format('DD MMMM YYYY')}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={<Text className="text-slate-500">Terakhir Diperbarui</Text>}>
            <Text strong>{dayjs(member.updated_at).format('DD MMMM YYYY, HH:mm')}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={<Title level={4} className="!m-0">Riwayat Transaksi</Title>}
        className="dark:bg-[#141414] dark:border-[#202020] shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={member.transaction || []}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: 'Belum ada riwayat transaksi' }}
        />
      </Card>
    </div>
  );
};
