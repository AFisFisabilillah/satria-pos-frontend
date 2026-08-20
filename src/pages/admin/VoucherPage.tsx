import { useState } from 'react';
import { Typography, Input, Select, DatePicker, InputNumber, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import { useVouchers } from '../../hooks/useVouchers';
import { VoucherTable } from '../../components/voucher/VoucherTable';
import { useNavigate } from 'react-router';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const VoucherPage = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch] = useDebounce(searchText, 500);

  const [activeFilter, setActiveFilter] = useState<number | undefined>();
  const [expiredRange, setExpiredRange] = useState<[string, string] | null>(null);
  const [minQuota, setMinQuota] = useState<number | undefined>();
  const [maxQuota, setMaxQuota] = useState<number | undefined>();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const { data, isLoading } = useVouchers({
    search: debouncedSearch || undefined,
    active: activeFilter,
    minExpired: expiredRange?.[0],
    maxExpired: expiredRange?.[1],
    minQuota,
    maxQuota,
    page,
    size,
  });

  const handleTableChange = (newPage: number, newSize: number) => {
    setPage(newPage);
    if (newSize !== size) {
      setSize(newSize);
      setPage(1);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title level={3} className="m-0!">Data Voucher</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/super-admin/voucher/create')}
          className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
        >
          Tambah Voucher
        </Button>
      </div>

      <div className="bg-white dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-[#202020] shadow-sm flex flex-col gap-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-50">
            <Text className="block mb-2 text-slate-500">Pencarian</Text>
            <Input
              placeholder="Cari nama atau kode voucher..."
              prefix={<SearchOutlined className="text-slate-400" />}
              value={searchText}
              onChange={handleSearch}
              allowClear
              size="large"
            />
          </div>

          <div className="w-40">
            <Text className="block mb-2 text-slate-500">Status</Text>
            <Select
              size="large"
              className="w-full"
              placeholder="Semua"
              allowClear
              value={activeFilter}
              onChange={(val) => {
                setActiveFilter(val);
                setPage(1);
              }}
              options={[
                { label: 'Aktif', value: 1 },
                { label: 'Nonaktif', value: 0 },
              ]}
            />
          </div>

          <div className="w-64">
            <Text className="block mb-2 text-slate-500">Periode Expired</Text>
            <RangePicker
              size="large"
              className="w-full"
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setExpiredRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
                } else {
                  setExpiredRange(null);
                }
                setPage(1);
              }}
            />
          </div>

          <div className="flex gap-2">
            <div className="w-28">
              <Text className="block mb-2 text-slate-500">Min Kuota</Text>
              <InputNumber
                size="large"
                className="w-full"
                placeholder="Min"
                min={0}
                value={minQuota}
                onChange={(val) => {
                  setMinQuota(val ?? undefined);
                  setPage(1);
                }}
              />
            </div>
            <div className="w-28">
              <Text className="block mb-2 text-slate-500">Max Kuota</Text>
              <InputNumber
                size="large"
                className="w-full"
                placeholder="Max"
                min={0}
                value={maxQuota}
                onChange={(val) => {
                  setMaxQuota(val ?? undefined);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <VoucherTable
          data={data}
          isLoading={isLoading}
          page={page}
          size={size}
          onTableChange={handleTableChange}
        />
      </div>
    </div>
  );
};
