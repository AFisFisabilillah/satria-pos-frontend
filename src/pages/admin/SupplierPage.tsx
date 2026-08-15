import { useState } from 'react';
import { Typography, Button, Input, App, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import { useSuppliers, useBulkDeleteSuppliers } from '../../hooks/useSuppliers';
import { SupplierTable } from '../../components/supplier/SupplierTable';
import { SupplierModal } from '../../components/supplier/SupplierModal';
import type { Supplier } from '../../types/supplier';

const { Title } = Typography;

export const SupplierPage = () => {
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch] = useDebounce(searchText, 500);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const { data, isLoading } = useSuppliers({
    search: debouncedSearch,
    page,
    size,
  });

  const { mutate: bulkDelete, isPending: isBulkDeleting } = useBulkDeleteSuppliers({
    onSuccess: () => {
      message.success('Beberapa supplier berhasil dihapus');
      setSelectedRowKeys([]);
    },
    onError: () => message.error('Gagal menghapus beberapa supplier')
  });

  const handleBulkDelete = () => {
    if (selectedRowKeys.length > 0) {
      bulkDelete({ ids: selectedRowKeys as (number | string)[] });
    }
  };

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

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title level={3} className="!m-0">Data Supplier</Title>
        <div className="flex gap-2">
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title="Hapus supplier terpilih?"
              description={`Apakah Anda yakin ingin menghapus ${selectedRowKeys.length} supplier ini?`}
              onConfirm={handleBulkDelete}
              okText="Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true, loading: isBulkDeleting }}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
              >
                Hapus ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAdd}
            className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
          >
            Tambah Supplier
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-[#202020] shadow-sm flex flex-col gap-5">
        <div className="max-w-md">
          <Input
            placeholder="Cari nama supplier..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={searchText}
            onChange={handleSearch}
            allowClear
            size="large"
          />
        </div>

        <SupplierTable
          data={data}
          isLoading={isLoading}
          page={page}
          size={size}
          onTableChange={handleTableChange}
          onEdit={handleOpenEdit}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={setSelectedRowKeys}
        />
      </div>

      <SupplierModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        initialData={editingSupplier}
      />
    </div>
  );
};
