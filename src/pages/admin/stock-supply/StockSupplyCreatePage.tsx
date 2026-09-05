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
import { useCreateStockSupply } from '../../../hooks/useStockSupply';
import { useSuppliers } from '../../../hooks/useSuppliers';
import { useProducts } from '../../../hooks/useProducts';
import type { CreateStockSupplyRequest } from '../../../types/stockSupply';
import { useDebounce } from 'use-debounce';
import { SupplierModal } from '../../../components/supplier/SupplierModal';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const StockSupplyCreatePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [supplierSearch, setSupplierSearch] = useState('');
  const [debouncedSupplierSearch] = useDebounce(supplierSearch, 500);

  const [productSearch, setProductSearch] = useState('');
  const [debouncedProductSearch] = useDebounce(productSearch, 500);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const { data: suppliers, isLoading: isSuppliersLoading } = useSuppliers({ search: debouncedSupplierSearch });
  const { data: productsData, isLoading: isProductsLoading } = useProducts({ search: debouncedProductSearch });

  const { mutate: createStockSupply, isPending } = useCreateStockSupply({
    onSuccess: () => {
      message.success('Stock Supply berhasil ditambahkan');
      navigate('/super-admin/stock-supply');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      message.error(err.response?.data?.message || 'Gagal menambahkan stock supply');
    }
  });

  const onFinish = (values: any) => {
    if (!values.products || values.products.length === 0) {
      message.error('Minimal tambahkan 1 produk');
      return;
    }

    const payload: CreateStockSupplyRequest = {
      suplier_id: values.suplier_id,
      invoice_number: values.invoice_number,
      notes: values.notes,
      products: values.products.map((p: any) => ({
        product_id: p.product_id,
        quantity_in: p.quantity_in,
        purchase_price: p.purchase_price,
        expired_date: p.expired_date ? p.expired_date.format('YYYY-MM-DD') : undefined,
      }))
    };

    createStockSupply(payload);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/super-admin/stock-supply')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="!m-0">Tambah Stock Supply</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item
              name="suplier_id"
              label={<Text strong>Supplier</Text>}
            >
              <Select
                size="large"
                showSearch
                allowClear
                placeholder="Pilih supplier"
                loading={isSuppliersLoading}
                onSearch={setSupplierSearch}
                filterOption={false}
                options={suppliers?.data?.map((s) => ({ label: s.name, value: s.id })) || []}
                notFoundContent={
                  isSuppliersLoading ? (
                    <Spin size="small" />
                  ) : debouncedSupplierSearch ? (
                    <div className="p-2 flex flex-col gap-2 text-center">
                      <Text type="secondary">Supplier "{debouncedSupplierSearch}" tidak ditemukan.</Text>
                      <Button
                        type="dashed"
                        size="small"
                        onClick={() => setIsSupplierModalOpen(true)}
                      >
                        Tambah Supplier Baru
                      </Button>
                    </div>
                  ) : null
                }
              />
            </Form.Item>

            <Form.Item
              name="invoice_number"
              label={<Text strong>Nomor Invoice</Text>}
            >
              <Input size="large" placeholder="Contoh: TR-2321321W" />
            </Form.Item>
          </div>

          <Form.Item
            name="notes"
            label={<Text strong>Catatan</Text>}
          >
            <TextArea rows={3} placeholder="Masukkan catatan pembelian..." />
          </Form.Item>

          <div className="mt-8 mb-4">
            <Title level={5}>Daftar Produk</Title>
          </div>

          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" className="mb-4 bg-slate-50 dark:bg-[#1f1f1f] border-dashed">
                    <div className="flex justify-between items-center mb-2">
                      <Text strong>Produk {name + 1}</Text>
                      <MinusCircleOutlined className="text-red-500 cursor-pointer hover:text-red-700" onClick={() => remove(name)} />
                    </div>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) => {
                        const prevProduct = prevValues.products?.[name];
                        const currentProduct = currentValues.products?.[name];
                        return prevProduct?.product_id !== currentProduct?.product_id ||
                               prevProduct?.purchase_price !== currentProduct?.purchase_price;
                      }}
                    >
                      {({ getFieldValue }) => {
                        const productId = getFieldValue(['products', name, 'product_id']);
                        const purchasePrice = getFieldValue(['products', name, 'purchase_price']) || 0;
                        const selectedProduct = productsData?.data?.find(p => p.id === productId);
                        const salePrice = selectedProduct?.sale_price || 0;

                        const profit = salePrice - purchasePrice;
                        const profitMargin = purchasePrice > 0 ? ((profit / purchasePrice) * 100).toFixed(2) : 0;
                        const isLoss = profit < 0;
                        const isProfit = profit > 0;
                        const textColorClass = isLoss ? "text-red-500" : (isProfit ? "text-green-500" : "");

                        return (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <Form.Item
                                {...restField}
                                name={[name, 'product_id']}
                                label="Produk"
                                rules={[{ required: true, message: 'Wajib diisi' }]}
                                className="mb-0"
                              >
                                <Select
                                  showSearch
                                  placeholder="Pilih produk"
                                  loading={isProductsLoading}
                                  onSearch={setProductSearch}
                                  filterOption={false}
                                  optionLabelProp="label"
                                  options={productsData?.data?.map((p) => ({
                                    value: p.id,
                                    label: p.name,
                                    labelRender: p.name,
                                    children: (
                                      <div className="flex items-center gap-2 py-1">
                                        {p.image ? (
                                          <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-8 h-8 object-cover rounded border border-slate-200 dark:border-[#232323]"
                                          />
                                        ) : (
                                          <div className="w-8 h-8 bg-slate-100 dark:bg-[#202020] rounded flex items-center justify-center border border-slate-200 dark:border-[#232323]">
                                            <ShoppingCartOutlined className="text-slate-400 text-xs" />
                                          </div>
                                        )}
                                        <div className="flex flex-col min-w-0">
                                          <span className="font-medium text-xs leading-tight truncate">{p.name}</span>
                                          <span className="text-[10px] text-slate-400 leading-tight font-mono">{p.code}</span>
                                        </div>
                                      </div>
                                    ),
                                  })) || []}
                                  fieldNames={{ label: 'children', value: 'value' }}
                                  notFoundContent={
                                    isProductsLoading ? (
                                      <Spin size="small" />
                                    ) : debouncedProductSearch ? (
                                      <div className="p-2 flex flex-col gap-2 text-center">
                                        <Text type="secondary">Produk "{debouncedProductSearch}" tidak ditemukan.</Text>
                                        <Button
                                          type="dashed"
                                          size="small"
                                          onClick={() => navigate('/super-admin/product/create')}
                                        >
                                          Tambah Produk Baru
                                        </Button>
                                      </div>
                                    ) : null
                                  }
                                />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, 'quantity_in']}
                                label="Jumlah (Qty)"
                                rules={[{ required: true, message: 'Wajib diisi' }]}
                                className="mb-0"
                              >
                                <InputNumber min={1} className="w-full" placeholder="Qty" />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, 'purchase_price']}
                                label="Harga Beli (Satuan)"
                                rules={[{ required: true, message: 'Wajib diisi' }]}
                                className="mb-0"
                              >
                                <InputNumber
                                  min={0}
                                  className="w-full"
                                  placeholder="Harga Beli"
                                  formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                  parser={(value) => (value ? Number(value.replace(/\Rp\s?|(\.*)/g, '')) : 0) as 0}
                                />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, 'expired_date']}
                                label="Tanggal Kadaluarsa"
                                className="mb-0"
                              >
                                <DatePicker className="w-full" placeholder="Opsional" format="YYYY-MM-DD" />
                              </Form.Item>
                            </div>

                            {selectedProduct && (
                              <div className="mt-4 p-3 bg-white dark:bg-[#141414] rounded-lg border border-slate-200 dark:border-[#202020] flex gap-6 items-center">
                                <div>
                                  <Text type="secondary" className="block text-xs">Harga Jual Saat Ini</Text>
                                  <Text strong>Rp {new Intl.NumberFormat('id-ID').format(salePrice)}</Text>
                                </div>
                                <div>
                                  <Text type="secondary" className="block text-xs">Margin (Profit)</Text>
                                  <Text strong className={textColorClass}>
                                    {isProfit ? "+" : ""}Rp {new Intl.NumberFormat('id-ID').format(profit)} ({isProfit ? "+" : ""}{profitMargin}%)
                                  </Text>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      }}
                    </Form.Item>
                  </Card>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} size="large">
                    Tambah Produk ke List
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-[#202020]">
            <Button size="large" onClick={() => navigate('/super-admin/stock-supply')}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isPending}
              className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
            >
              Simpan Stock Supply
            </Button>
          </div>
        </Form>
      </Card>

      <SupplierModal
        open={isSupplierModalOpen}
        onCancel={() => setIsSupplierModalOpen(false)}
      />
    </div>
  );
};
