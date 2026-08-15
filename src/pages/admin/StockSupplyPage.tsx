import { useState } from 'react';
import { Typography, Input, Button, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import { useStockSupplies } from '../../hooks/useStockSupply';
import { StockSupplyTable } from '../../components/stockSupply/StockSupplyTable';
import type { StockSupply } from '../../types/stockSupply';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const StockSupplyPage = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch] = useDebounce(searchText, 500);

  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const { data, isLoading } = useStockSupplies({
    search: debouncedSearch,
    startDate: dateRange?.[0],
    endDate: dateRange?.[1],
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

  const handleAction = (action: string, record: StockSupply) => {
    if (action === 'detail') {
      console.log('Navigate to detail:', record.id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title level={3} className="!m-0">Data Stock Supply</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
        >
          Tambah Stock Supply
        </Button>
      </div>

      <div className="bg-white dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-[#202020] shadow-sm flex flex-col gap-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-50">
            <Text className="block mb-2 text-slate-500">Pencarian</Text>
            <Input
              placeholder="Cari invoice atau catatan..."
              prefix={<SearchOutlined className="text-slate-400" />}
              value={searchText}
              onChange={handleSearch}
              allowClear
              size="large"
            />
          </div>

          <div className="w-64">
            <Text className="block mb-2 text-slate-500">Periode Tanggal</Text>
            <RangePicker
              size="large"
              className="w-full"
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
                } else {
                  setDateRange(null);
                }
                setPage(1);
              }}
            />
          </div>
        </div>

        <StockSupplyTable
          data={data}
          isLoading={isLoading}
          page={page}
          size={size}
          onTableChange={handleTableChange}
          onAction={handleAction}
        />
      </div>
    </div>
  );
};
