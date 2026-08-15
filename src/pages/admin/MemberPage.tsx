import { useState } from 'react';
import { Typography, Input, Select, InputNumber, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import { useMembers } from '../../hooks/useMembers';
import { MemberTable } from '../../components/member/MemberTable';
import { MemberModal } from '../../components/member/MemberModal';
import type { Member } from '../../types/member';

const { Title, Text } = Typography;

export const MemberPage = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch] = useDebounce(searchText, 500);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [minSpent, setMinSpent] = useState<number | null>(null);
  const [debouncedMinSpent] = useDebounce(minSpent, 500);
  const [maxSpent, setMaxSpent] = useState<number | null>(null);
  const [debouncedMaxSpent] = useDebounce(maxSpent, 500);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const { data, isLoading } = useMembers({
    name: debouncedSearch,
    active: activeFilter === 'all' ? undefined : activeFilter,
    min_total_spent: debouncedMinSpent ?? undefined,
    max_total_spent: debouncedMaxSpent ?? undefined,
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

  const handleAction = (action: string, record: Member) => {
    if (action === 'edit') {
      setEditingMember(record);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title level={3} className="!m-0">Data Member</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingMember(null);
            setIsModalOpen(true);
          }}
          className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
        >
          Tambah Member
        </Button>
      </div>

      <div className="bg-white dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-[#202020] shadow-sm flex flex-col gap-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Text className="block mb-2 text-slate-500">Pencarian</Text>
            <Input
              placeholder="Cari nama member..."
              prefix={<SearchOutlined className="text-slate-400" />}
              value={searchText}
              onChange={handleSearch}
              allowClear
              size="large"
            />
          </div>

          <div className="w-[150px]">
            <Text className="block mb-2 text-slate-500">Status</Text>
            <Select
              className="w-full"
              size="large"
              value={activeFilter}
              onChange={(val) => { setActiveFilter(val); setPage(1); }}
              options={[
                { label: 'Semua Status', value: 'all' },
                { label: 'Aktif', value: '1' },
                { label: 'Nonaktif', value: '0' },
              ]}
            />
          </div>

          <div className="w-[180px]">
            <Text className="block mb-2 text-slate-500">Min. Belanja</Text>
            <InputNumber
              className="w-full"
              size="large"
              placeholder="Rp 0"
              value={minSpent}
              onChange={(val) => { setMinSpent(val); setPage(1); }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={(value) => Number(value?.replace(/\Rp\s?|(\.*)/g, ''))}
            />
          </div>

          <div className="w-[180px]">
            <Text className="block mb-2 text-slate-500">Max. Belanja</Text>
            <InputNumber
              className="w-full"
              size="large"
              placeholder="Rp Tak Terhingga"
              value={maxSpent}
              onChange={(val) => { setMaxSpent(val); setPage(1); }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={(value) => Number(value?.replace(/\Rp\s?|(\.*)/g, ''))}
            />
          </div>
        </div>

        <MemberTable
          data={data}
          isLoading={isLoading}
          page={page}
          size={size}
          onTableChange={handleTableChange}
          onAction={handleAction}
        />
      </div>

      <MemberModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        initialData={editingMember}
      />
    </div>
  );
};
