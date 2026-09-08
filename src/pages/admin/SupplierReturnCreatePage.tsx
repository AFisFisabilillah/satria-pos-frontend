import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Form,
  Input,
  Button,
  Typography,
  App,
  Card,
  Select,
  Spin,
  DatePicker,
  InputNumber
} from 'antd';
import { ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { AxiosError } from 'axios';
import { useCreateSupplierReturn } from '../../hooks/useSupplierReturns';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useStockSupplies, useStockSupply } from '../../hooks/useStockSupply';
import type { CreateSupplierReturnRequest } from '../../types/supplierReturn';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const SupplierReturnCreatePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [supplierSearch, setSupplierSearch] = useState('');
  const [debouncedSupplierSearch] = useDebounce(supplierSearch, 500);

  const selectedSupplierId = Form.useWatch('suplier_id', form);
  const selectedStockSupplyId = Form.useWatch('stock_supply_id', form);

  const { data: suppliers, isLoading: isSuppliersLoading } = useSuppliers({ search: debouncedSupplierSearch });
  const { data: stockSuppliesData, isLoading: isStockSuppliesLoading } = useStockSupplies({
    size: 100
  });

  const { data: stockSupplyDetail, isLoading: isStockSupplyDetailLoading } = useStockSupply(selectedStockSupplyId);

  const { mutate: createSupplierReturn, isPending } = useCreateSupplierReturn({
    onSuccess: () => {
      message.success('Retur supplier berhasil ditambahkan');
      navigate('/super-admin/supplier-return');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      message.error(err.response?.data?.message || 'Gagal membuat retur supplier');
    }
  });

  const onFinish = (values: any) => {
    if (!values.items || values.items.length === 0) {
      message.error('Minimal tambahkan 1 item retur');
      return;
    }

    const payload: CreateSupplierReturnRequest = {
      suplier_id: values.suplier_id,
      date: values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      notes: values.notes,
      items: values.items.map((item: any) => ({
        stock_supply_item_id: item.stock_supply_item_id,
        quantity: item.quantity,
        reason: item.reason,
      }))
    };

    createSupplierReturn(payload);
  };

  // Filter stock supplies by selected supplier if supplier is chosen
  const filteredStockSupplies = stockSuppliesData?.data?.filter((ss) => {
    if (!selectedSupplierId) return true;
    return (ss.suplier as any)?.id === selectedSupplierId || ss.suplier === (suppliers?.data?.find(s => s.id === selectedSupplierId)?.name);
  }) || [];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/super-admin/supplier-return')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="!m-0">Tambah Retur Supplier</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{ date: dayjs() }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
            <Form.Item
              name="suplier_id"
              label={<Text strong>Supplier</Text>}
              rules={[{ required: true, message: 'Pilih supplier' }]}
            >
              <Select
                size="large"
                showSearch
                allowClear
                placeholder="Pilih supplier"
                loading={isSuppliersLoading}
                onSearch={setSupplierSearch}
                filterOption={false}
                onChange={() => {
                  form.setFieldsValue({ stock_supply_id: undefined, items: [] });
                }}
                options={suppliers?.data?.map((s) => ({ label: s.name, value: s.id })) || []}
              />
            </Form.Item>

            <Form.Item
              name="stock_supply_id"
              label={<Text strong>Pilih Batch Stock Supply (Opsional)</Text>}
            >
              <Select
                size="large"
                showSearch
                allowClear
                placeholder="Pilih Faktur / Stock Supply"
                loading={isStockSuppliesLoading}
                onChange={() => {
                  form.setFieldsValue({ items: [] });
                }}
                options={filteredStockSupplies.map((ss) => ({
                  label: `${ss.invoice_number} (${dayjs(ss.date).format('DD/MM/YYYY')})`,
                  value: ss.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="date"
              label={<Text strong>Tanggal Retur</Text>}
              rules={[{ required: true, message: 'Pilih tanggal retur' }]}
            >
              <DatePicker size="large" className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </div>

          <Form.Item
            name="notes"
            label={<Text strong>Catatan Retur</Text>}
          >
            <TextArea rows={2} placeholder="Masukkan catatan retur (misal: barang rusak / reject)..." />
          </Form.Item>

          <div className="mt-6 mb-4 flex justify-between items-center">
            <Title level={5} className="!m-0">Daftar Item Retur</Title>
            {isStockSupplyDetailLoading && <Spin size="small" />}
          </div>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" className="mb-4 bg-slate-50 dark:bg-[#1f1f1f] border-dashed">
                    <div className="flex justify-between items-center mb-2">
                      <Text strong>Item Retur {name + 1}</Text>
                      <MinusCircleOutlined className="text-red-500 cursor-pointer hover:text-red-700" onClick={() => remove(name)} />
                    </div>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.items?.[name]?.stock_supply_item_id !== currentValues.items?.[name]?.stock_supply_item_id
                      }
                    >
                      {({ getFieldValue }) => {
                        const itemId = getFieldValue(['items', name, 'stock_supply_item_id']);
                        const selectedItemDetail = stockSupplyDetail?.items?.find((i) => i.id === itemId);
                        const maxQty = selectedItemDetail ? selectedItemDetail.quantity_remaining : 99999;

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Form.Item
                              {...restField}
                              name={[name, 'stock_supply_item_id']}
                              label="Pilih Batch Item Produk"
                              rules={[{ required: true, message: 'Wajib diisi' }]}
                              className="mb-0"
                            >
                              <Select
                                showSearch
                                placeholder="Pilih produk dari stock supply"
                                options={
                                  stockSupplyDetail?.items?.map((item) => ({
                                    value: item.id,
                                    label: (
                                      <div className="flex items-center gap-2 py-0.5">
                                        <ShoppingCartOutlined className="text-slate-400 text-xs" />
                                        <div className="flex flex-col min-w-0">
                                          <span className="font-medium text-xs leading-tight truncate">
                                            {item.product_summary.name}
                                          </span>
                                          <span className="text-[10px] text-slate-400 leading-tight">
                                            Sisa Stok: {item.quantity_remaining} | Rp {Number(item.purchase_price).toLocaleString('id-ID')}
                                          </span>
                                        </div>
                                      </div>
                                    ),
                                  })) || []
                                }
                              />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'quantity']}
                              label={`Jumlah Retur (Sisa: ${selectedItemDetail ? selectedItemDetail.quantity_remaining : '-'})`}
                              rules={[{ required: true, message: 'Wajib diisi' }]}
                              className="mb-0"
                            >
                              <InputNumber min={1} max={maxQty} className="w-full" placeholder="Jumlah retur" />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'reason']}
                              label="Alasan Retur"
                              rules={[{ required: true, message: 'Wajib diisi' }]}
                              className="mb-0"
                            >
                              <Input placeholder="Contoh: Pecah / Rusak / Expired" />
                            </Form.Item>
                          </div>
                        );
                      }}
                    </Form.Item>
                  </Card>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} size="large">
                    Tambah Item Retur
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-[#202020]">
            <Button size="large" onClick={() => navigate('/super-admin/supplier-return')}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isPending}
              className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
            >
              Simpan Retur Supplier
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
