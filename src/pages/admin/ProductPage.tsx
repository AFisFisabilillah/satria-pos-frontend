import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input, Typography, Button, App } from 'antd';
import { SearchOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { ProductTable } from '../../components/product/ProductTable';
import { useProducts, useBulkToggleProducts } from '../../hooks/useProducts';
import {useDebounce} from 'use-debounce';

const { Title } = Typography;

export const ProductPage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch] = useDebounce(searchText, 500);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data, isLoading } = useProducts({
    search: debouncedSearch,
    page,
    size,
  });

  const { mutate: bulkToggle, isPending: isToggling } = useBulkToggleProducts({
    onSuccess: () => {
      message.success('Status produk berhasil diubah');
      setSelectedRowKeys([]);
    },
    onError: () => {
      message.error('Gagal mengubah status produk');
    }
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
    setPage(1); // Reset page on search
  };

  const handleBulkToggle = () => {
    if (selectedRowKeys.length > 0) {
      bulkToggle({ ids: selectedRowKeys as number[] });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title level={3} className="!m-0">Data Produk</Title>
        <div className="flex gap-2">
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<SwapOutlined />}
              onClick={handleBulkToggle}
              loading={isToggling}
            >
              Ubah Status ({selectedRowKeys.length})
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/super-admin/product/create')}
            className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
          >
            Tambah Produk
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-[#202020] shadow-sm flex flex-col gap-5">
        <div className="max-w-md">
          <Input
            placeholder="Cari nama atau kode produk..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={searchText}
            onChange={handleSearch}
            allowClear
            size="large"
          />
        </div>

        <ProductTable
          data={data}
          isLoading={isLoading}
          page={page}
          size={size}
          onTableChange={handleTableChange}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={setSelectedRowKeys}
        />
      </div>
    </div>
  );
};
