import { useState, useMemo } from 'react';
import { Card, Typography, DatePicker, Spin, Segmented, Table, Tag, Tooltip as AntTooltip } from 'antd';
import {
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  UserOutlined,
  InboxOutlined,
  GiftOutlined,
  RollbackOutlined,
  TrophyOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useDashboard } from '../../hooks/useDashboard';
import { useTheme } from '../../contexts/ThemeContext';
import type { DashboardPeriod } from '../../types/dashboard';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function DashboardPage() {
  const { isDarkMode } = useTheme();
  const [period, setPeriod] = useState<DashboardPeriod>('today');
  const [dateRange, setDateRange] = useState<[string, string] | undefined>();

  const { data, isLoading } = useDashboard({
    period,
    start_date: period === 'custom' ? dateRange?.[0] : undefined,
    end_date: period === 'custom' ? dateRange?.[1] : undefined,
  });

  // Chart data setup
  const chartData = useMemo(() => {
    if (!data?.chart_transactions) {
      return { labels: [], datasets: [] };
    }

    const labels = data.chart_transactions.map((tx) => dayjs(tx.created_at).format('DD/MM HH:mm'));
    const prices = data.chart_transactions.map((tx) => tx.total_price);

    return {
      labels,
      datasets: [
        {
          label: 'Total Penjualan (Rp)',
          data: prices,
          borderColor: '#ff6a00',
          backgroundColor: isDarkMode ? 'rgba(255, 106, 0, 0.15)' : 'rgba(255, 106, 0, 0.1)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ff6a00',
        },
      ],
    };
  }, [data, isDarkMode]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            color: isDarkMode ? '#e2e8f0' : '#334155',
            font: { family: 'sans-serif', size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `Rp ${Number(context.raw).toLocaleString('id-ID')}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          ticks: { color: isDarkMode ? '#94a3b8' : '#64748b' },
        },
        y: {
          grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            color: isDarkMode ? '#94a3b8' : '#64748b',
            callback: (val: any) => `Rp ${(val / 1000).toLocaleString('id-ID')}k`,
          },
        },
      },
    }),
    [isDarkMode]
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Title level={3} className="m-0!">Dashboard POS</Title>
          <Text type="secondary" className="text-sm">Ringkasan performa penjualan dan persediaan stok</Text>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto overflow-x-auto max-w-full pb-1">
          <Segmented<DashboardPeriod>
            className="max-w-full overflow-x-auto"
            options={[
              { label: 'Hari ini', value: 'today' },
              { label: 'Minggu', value: 'week' },
              { label: 'Bulan', value: 'month' },
              { label: 'Tahun', value: 'year' },
              { label: 'Semua', value: 'all' },
              { label: 'Custom', value: 'custom' },
            ]}
            value={period}
            onChange={(val) => setPeriod(val)}
          />

          {period === 'custom' && (
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
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
      ) : (
        <>
          {/* Main Sales KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <Text type="secondary" className="block text-xs uppercase font-semibold">Total Omset (Sales)</Text>
                  <Text strong className="text-xl text-[#ff6a00]">
                    Rp {Number(data?.sales?.total_sales || 0).toLocaleString('id-ID')}
                  </Text>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-[#20150d] rounded-xl text-[#ff6a00]">
                  <DollarOutlined className="text-2xl" />
                </div>
              </div>
            </Card>

            <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1">
                    <Text type="secondary" className="block text-xs uppercase font-semibold">Laba Kotor</Text>
                    <AntTooltip title="Sudah termasuk potongan dari diskon voucher">
                      <InfoCircleOutlined className="text-slate-400 text-xs cursor-pointer hover:text-slate-600" />
                    </AntTooltip>
                  </div>
                  <Text strong className="text-xl text-green-600 dark:text-green-500">
                    Rp {Number(data?.sales?.laba_kotor || 0).toLocaleString('id-ID')}
                  </Text>
                </div>
                <div className="p-3 bg-green-50 dark:bg-[#0f2316] rounded-xl text-green-600">
                  <RiseOutlined className="text-2xl" />
                </div>
              </div>
            </Card>

            <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <Text type="secondary" className="block text-xs uppercase font-semibold">Total Modal (COGS)</Text>
                  <Text strong className="text-xl text-slate-700 dark:text-slate-200">
                    Rp {Number(data?.sales?.total_cogs || 0).toLocaleString('id-ID')}
                  </Text>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-[#1f1f1f] rounded-xl text-slate-500">
                  <ShoppingOutlined className="text-2xl" />
                </div>
              </div>
            </Card>

            <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <Text type="secondary" className="block text-xs uppercase font-semibold">Total Transaksi</Text>
                  <Text strong className="text-xl text-blue-600 dark:text-blue-500">
                    {data?.sales?.total_transactions || 0}
                  </Text>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-[#0d1b2a] rounded-xl text-blue-600">
                  <ShoppingOutlined className="text-2xl" />
                </div>
              </div>
            </Card>

            <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <Text type="secondary" className="block text-xs uppercase font-semibold">Total Jenis Produk</Text>
                  <Text strong className="text-xl text-purple-600 dark:text-purple-500">
                    {data?.total_product || 0}
                  </Text>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-[#1e102a] rounded-xl text-purple-600">
                  <InboxOutlined className="text-2xl" />
                </div>
              </div>
            </Card>
          </div>

          {/* Chart & Top Products/Members Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Line Chart */}
            <Card title={<Title level={4} className="m-0!">Grafik Transaksi Penjualan</Title>} className="lg:col-span-2 dark:bg-[#141414] dark:border-[#202020]">
              <div className="h-72 w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </Card>

            {/* Top Products Card */}
            <Card title={<div className="flex items-center gap-2"><TrophyOutlined className="text-yellow-500" /><Title level={4} className="m-0!">Produk Terlaris</Title></div>} className="dark:bg-[#141414] dark:border-[#202020]">
              <div className="flex flex-col gap-3">
                {data?.top_products?.map((tp, idx) => (
                  <div key={tp.id} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#ff6a00] text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <Text strong className="text-sm">{tp.name}</Text>
                    </div>
                    <Tag color="orange" className="font-semibold">{tp.total_sold} Terjual</Tag>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Inventory, Member, Voucher Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Member Stats */}
            <Card title={<div className="flex items-center gap-2"><UserOutlined className="text-blue-500" /><Title level={5} className="m-0!">Statistik Member</Title></div>} className="dark:bg-[#141414] dark:border-[#202020]">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <Text type="secondary">Total Member</Text>
                  <Text strong>{data?.member_stats?.total_members || 0}</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">Member Aktif</Text>
                  <Text strong className="text-green-600">{data?.member_stats?.active_members || 0}</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">Baru Hari Ini</Text>
                  <Text strong>{data?.member_stats?.new_members_today || 0}</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">Baru Periode Ini</Text>
                  <Text strong>{data?.member_stats?.new_members_period || 0}</Text>
                </div>
              </div>
            </Card>

            {/* Inventory Stats */}
            <Card title={<div className="flex items-center gap-2"><InboxOutlined className="text-[#ff6a00]" /><Title level={5} className="m-0!">Statistik Stok & Nilai</Title></div>} className="dark:bg-[#141414] dark:border-[#202020]">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <Text type="secondary">Total Fisik Stok</Text>
                  <Text strong>{data?.inventory_stats?.total_stock || 0} Pcs</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">Nilai Inventaris (Modal)</Text>
                  <Text strong className="text-blue-600">Rp {Number(data?.inventory_stats?.total_inventory_value || 0).toLocaleString('id-ID')}</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">Kerugian Adjustment</Text>
                  <Text strong className="text-red-500">Rp {Number(data?.adjustment_loss || 0).toLocaleString('id-ID')}</Text>
                </div>
              </div>
            </Card>

            {/* Supplier Return Stats */}
            <Card title={<div className="flex items-center gap-2"><RollbackOutlined className="text-orange-500" /><Title level={5} className="m-0!">Statistik Retur Supplier</Title></div>} className="dark:bg-[#141414] dark:border-[#202020]">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <Text type="secondary">Total Stok Diteretur</Text>
                  <Text strong>{data?.supplier_return_stats?.total_return_stock || 0} Pcs</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">Nilai Nominal Retur</Text>
                  <Text strong className="text-amber-600">Rp {Number(data?.supplier_return_stats?.total_return_value || 0).toLocaleString('id-ID')}</Text>
                </div>
              </div>
            </Card>

            {/* Voucher Stats */}
            <Card title={<div className="flex items-center gap-2"><GiftOutlined className="text-purple-500" /><Title level={5} className="m-0!">Statistik Voucher</Title></div>} className="dark:bg-[#141414] dark:border-[#202020]">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <Text type="secondary">Total Voucher Aktif</Text>
                  <Text strong>{data?.voucher_stats?.active_vouchers || 0} / {data?.voucher_stats?.total_vouchers || 0}</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">Terpakai Periode Ini</Text>
                  <Text strong>{data?.voucher_usage_period?.total_used || 0} Kali</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">Total Potongan Diskon</Text>
                  <Text strong className="text-green-600">Rp {Number(data?.voucher_usage_period?.total_discount || 0).toLocaleString('id-ID')}</Text>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Members Table */}
          <Card title={<Title level={4} className="m-0!">Member Belanja Terbanyak (Top Members)</Title>} className="dark:bg-[#141414] dark:border-[#202020]">
            <Table
              dataSource={data?.top_members || []}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: 'Member',
                  dataIndex: 'name',
                  key: 'name',
                  render: (name: string) => <Text strong>{name}</Text>,
                },
                {
                  title: 'Kode Member',
                  dataIndex: 'member_code',
                  key: 'member_code',
                  render: (code: string) => <span className="font-mono text-slate-500">{code}</span>,
                },
                {
                  title: 'Total Belanja',
                  dataIndex: 'total_spent',
                  key: 'total_spent',
                  render: (val: number) => <Text strong className="text-green-600">Rp {Number(val).toLocaleString('id-ID')}</Text>,
                },
              ]}
            />
          </Card>
        </>
      )}
    </div>
  );
}
