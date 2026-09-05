import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
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
import { useUpdateStockSupply, useStockSupply } from '../../../hooks/useStockSupply';
import { useSuppliers } from '../../../hooks/useSuppliers';
import { useProducts } from '../../../hooks/useProducts';
import type { CreateStockSupplyRequest } from '../../../types/stockSupply';
import { useDebounce } from 'use-debounce';
import { SupplierModal } from '../../../components/supplier/SupplierModal';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const StockSupplyUpdatePage = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [supplierSearch, setSupplierSearch] = useState('');
  const [debouncedSupplierSearch] = useDebounce(supplierSearch, 500);

  const [productSearch, setProductSearch] = useState('');
  const [debouncedProductSearch] = useDebounce(productSearch, 500);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const { data: stockSupply, isLoading: isStockSupplyLoading, isError: isStockSupplyError } = useStockSupply(id!);
  const { data: suppliers, isLoading: isSuppliersLoading } = useSuppliers({ search: debouncedSupplierSearch });
  const { data: productsData, isLoading: isProductsLoading } = useProducts({ search: debouncedProductSearch });

  const { mutate: updateStockSupply, isPending } = useUpdateStockSupply(id!, {
    onSuccess: () => {
      message.success('Stock Supply berhasil diperbarui');
      navigate('/super-admin/stock-supply');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      message.error(err.response?.data?.message || 'Gagal memperbarui stock supply');
    }
  });

  // Build options that include existing products so Select shows their labels
  // even if they're not in the current search results page
  const existingProductOptions = stockSupply?.items?.map((item) => ({
    value: item.product_summary.id,
    label: (
      <div className="flex items-center gap-2 py-0.5">
        {item.product_summary.image ? (
          <img
            src={item.product_summary.image}
            alt={item.product_summary.name}
            className="w-6 h-6 object-cover rounded border border-slate-200 dark:border-[#232323]"
          />
        ) : (
          <div className="w-6 h-6 bg-slate-100 dark:bg-[#202020] rounded flex items-center justify-center border border-slate-200 dark:border-[#232323]">
            <ShoppingCartOutlined className="text-slate-400 text-xs" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-xs leading-tight truncate">{item.product_summary.name}</span>
          <span className="text-[10px] text-slate-400 leading-tight font-mono">{item.product_summary.code}</span>
        </div>
      </div>
    ),
  })) || [];

  const searchProductOptions = productsData?.data?.map((p) => ({
    value: p.id,
    label: (
      <div className="flex items-center gap-2 py-0.5">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="w-6 h-6 object-cover rounded border border-slate-200 dark:border-[#232323]"
          />
        ) : (
          <div className="w-6 h-6 bg-slate-100 dark:bg-[#202020] rounded flex items-center justify-center border border-slate-200 dark:border-[#232323]">
            <ShoppingCartOutlined className="text-slate-400 text-xs" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-xs leading-tight truncate">{p.name}</span>
          <span className="text-[10px] text-slate-400 leading-tight font-mono">{p.code}</span>
        </div>
      </div>
    ),
  })) || [];

  // Merge: search results + existing (deduplicated)
  const mergedProductOptions = [
    ...searchProductOptions,
    ...existingProductOptions.filter(
      (ep) => !searchProductOptions.some((sp) => sp.value === ep.value)
    ),
  ];

  useEffect(() => {
    if (stockSupply) {
      form.setFieldsValue({
        suplier_id: stockSupply.suplier?.id,
        invoice_number: stockSupply.invoice_number,
        notes: stockSupply.notes,
        products: stockSupply.items?.map((item) => ({
          id: item.id,
          product_id: item.product_summary.id,
          quantity_in: item.quantity_in,
          purchase_price: Number(item.purchase_price),
          expired_date: item.expired_at ? dayjs(item.expired_at) : undefined,
        })) || []
      });
    }
  }, [stockSupply, form]);

  const onFinish = (values: any) => {
    if (!values.products || values.products.length === 0) {
      message.error('Minimal tambahkan 1 produk');
      return;
    }

    const payload: Partial<CreateStockSupplyRequest> = {
      suplier_id: values.suplier_id,
      invoice_number: values.invoice_number,
      notes: values.notes,
      products: values.products.map((p: any) => ({
        id: p.id,
        product_id: p.product_id,
        quantity_in: p.quantity_in,
        purchase_price: p.purchase_price,
        expired_date: p.expired_date ? p.expired_date.format('YYYY-MM-DD') : undefined,
      }))
    };

    updateStockSupply(payload);
  };

  if (isStockSupplyLoading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  if (isStockSupplyError || !stockSupply) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Data Stock Supply tidak ditemukan.</Title>
        <Button onClick={() => navigate('/super-admin/stock-supply')}>Kembali</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/super-admin/stock-supply')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="!m-0">Edit Stock Supply</Title>
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
                  <Card key={key} size="small" className="mb-4 bg-slate-50 dark:bg-[#1f1f1f] border-dashed relative">
                    <Form.Item {...restField} name={[name, 'id']} hidden>
                      <Input />
                    </Form.Item>

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
                               prevProduct?.purchase_price !== currentProduct?.purchase_price ||
                               prevProduct?.quantity_in !== currentProduct?.quantity_in;
                      }}
                    >
                      {({ getFieldValue }) => {
                        const productId = getFieldValue(['products', name, 'product_id']);
                        const purchasePrice = getFieldValue(['products', name, 'purchase_price']) || 0;
                        const quantityIn = getFieldValue(['products', name, 'quantity_in']) || 0;
                        const fullProductData = productsData?.data?.find(p => p.id === productId);
                        const salePrice = fullProductData?.sale_price || 0;

                        const profit = salePrice - purchasePrice;
                        const totalProfit = profit * quantityIn;
                        const profitMargin = purchasePrice > 0 ? ((profit / purchasePrice) * 100).toFixed(2) : 0;
                        const isLoss = profit < 0;
                        const isProfit = profit > 0;
                        const textColorClass = isLoss ? "text-red-500" : (isProfit ? "text-green-500" : "");

                        return (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                                  options={mergedProductOptions}
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

                              <Form.Item label="Harga Jual Saat Ini" className="mb-0">
                                <InputNumber
                                  disabled
                                  className="w-full"
                                  value={salePrice}
                                  formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
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

                            {salePrice > 0 && (
                              <div className="mt-4 p-3 bg-white dark:bg-[#141414] rounded-lg border border-slate-200 dark:border-[#202020] flex flex-wrap gap-6 items-center">
                                <div>
                                  <Text type="secondary" className="block text-xs">Harga Jual Saat Ini</Text>
                                  <Text strong>Rp {new Intl.NumberFormat('id-ID').format(salePrice)}</Text>
                                </div>
                                <div>
                                  <Text type="secondary" className="block text-xs">Margin (Profit Satuan)</Text>
                                  <Text strong className={textColorClass}>
                                    {isProfit ? "+" : ""}Rp {new Intl.NumberFormat('id-ID').format(profit)} ({isProfit ? "+" : ""}{profitMargin}%)
                                  </Text>
                                </div>
                                <div>
                                  <Text type="secondary" className="block text-xs">Proyeksi Profit (Total Qty)</Text>
                                  <Text strong className={textColorClass}>
                                    {totalProfit > 0 ? "+" : ""}Rp {new Intl.NumberFormat('id-ID').format(totalProfit)}
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

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const productsList: any[] = getFieldValue('products') || [];
              let grandTotalPurchase = 0;
              let grandTotalProfit = 0;

              productsList.forEach((item) => {
                const qty = item?.quantity_in || 0;
                const purchasePrice = item?.purchase_price || 0;
                const pData = productsData?.data?.find(p => p.id === item?.product_id);
                const salePrice = pData?.sale_price || 0;

                grandTotalPurchase += purchasePrice * qty;
                grandTotalProfit += (salePrice - purchasePrice) * qty;
              });

              const grandTotalProfitClass = grandTotalProfit < 0 ? "text-red-500" : (grandTotalProfit > 0 ? "text-green-500" : "");

              return (
                <div className="p-4 bg-slate-100 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-[#262626] flex flex-wrap justify-between items-center gap-4 my-4">
                  <div>
                    <Text type="secondary" className="block text-xs font-semibold uppercase">Total Pembelian (Modal)</Text>
                    <Text strong className="text-lg">Rp {new Intl.NumberFormat('id-ID').format(grandTotalPurchase)}</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="block text-xs font-semibold uppercase">Total Proyeksi Keuntungan</Text>
                    <Text strong className={`text-lg ${grandTotalProfitClass}`}>
                      {grandTotalProfit > 0 ? "+" : ""}Rp {new Intl.NumberFormat('id-ID').format(grandTotalProfit)}
                    </Text>
                  </div>
                </div>
              );
            }}
          </Form.Item>

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
              Perbarui Stock Supply
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
