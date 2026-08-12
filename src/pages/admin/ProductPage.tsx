import { useState } from 'react';
import { Input, Typography, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { ProductTable } from '../../components/product/ProductTable';
import { useProducts } from '../../hooks/useProducts';
import {useDebounce} from 'use-debounce';

const { Title } = Typography;

export const ProductPage = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch] = useDebounce(searchText, 500);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const { data, isLoading } = useProducts({
    search: debouncedSearch,
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
    setPage(1); // Reset page on search
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title level={3} className="!m-0">Data Produk</Title>
        <Button type="primary" icon={<PlusOutlined />} className="bg-[#ff6a00] hover:bg-[#e55e00] border-none">
          Tambah Produk
        </Button>
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
        />
      </div>
    </div>
  );
};
