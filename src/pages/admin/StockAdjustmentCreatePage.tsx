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
  InputNumber
} from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { AxiosError } from 'axios';
import { useCreateStockAdjustment } from '../../hooks/useStockAdjustments';
import { useStockSupplies, useStockSupply } from '../../hooks/useStockSupply';
import type { CreateStockAdjustmentRequest } from '../../types/stockAdjustment';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const StockAdjustmentCreatePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const selectedStockSupplyId = Form.useWatch('stock_supply_id', form);
  const selectedItemId = Form.useWatch('stock_supply_item_id', form);

  const { data: stockSuppliesData, isLoading: isStockSuppliesLoading } = useStockSupplies({ size: 100 });
  const { data: stockSupplyDetail, isLoading: isStockSupplyDetailLoading } = useStockSupply(selectedStockSupplyId);

  const selectedItemDetail = stockSupplyDetail?.items?.find((i) => i.id === selectedItemId);
  const maxQty = selectedItemDetail ? selectedItemDetail.quantity_remaining : 99999;

  const { mutate: createStockAdjustment, isPending } = useCreateStockAdjustment({
    onSuccess: () => {
      message.success('Penyesuaian stok berhasil dibuat');
      navigate('/super-admin/stock-adjustment');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      message.error(err.response?.data?.message || 'Gagal membuat penyesuaian stok');
    }
  });

  const onFinish = (values: any) => {
    const payload: CreateStockAdjustmentRequest = {
      stock_supply_item_id: values.stock_supply_item_id,
      quantity: values.quantity,
      type: values.type,
      reason: values.reason,
    };

    createStockAdjustment(payload);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/super-admin/stock-adjustment')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="m-0!">Tambah Penyesuaian Stok</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="stock_supply_id"
            label={<Text strong>Pilih Faktur / Stock Supply</Text>}
            rules={[{ required: true, message: 'Pilih stock supply' }]}
          >
            <Select
              size="large"
              showSearch
              allowClear
              placeholder="Pilih Faktur / Batch Pembelian"
              loading={isStockSuppliesLoading}
              onChange={() => {
                form.setFieldsValue({ stock_supply_item_id: undefined, quantity: undefined });
              }}
              options={stockSuppliesData?.data?.map((ss) => ({
                label: `${ss.invoice_number} - ${typeof ss.suplier === 'object' ? (ss.suplier as any)?.name : (ss.suplier || 'Tanpa Supplier')} (${dayjs(ss.date).format('DD/MM/YYYY')})`,
                value: ss.id,
              })) || []}
            />
          </Form.Item>

          <Form.Item
            name="stock_supply_item_id"
            label={
              <div className="flex items-center justify-between w-full">
                <Text strong>Pilih Item Produk</Text>
                {isStockSupplyDetailLoading && <Spin size="small" />}
              </div>
            }
            rules={[{ required: true, message: 'Pilih item produk' }]}
          >
            <Select
              size="large"
              showSearch
              placeholder="Pilih produk dari stock supply terpilih"
              disabled={!selectedStockSupplyId || isStockSupplyDetailLoading}
              onChange={() => form.setFieldsValue({ quantity: undefined })}
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
                          Sisa Stok: {item.quantity_remaining} | Harga Beli: Rp {Number(item.purchase_price).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ),
                })) || []
              }
            />
          </Form.Item>

          {selectedItemDetail && (
            <div className="mb-4 p-3 bg-slate-50 dark:bg-[#1a1a1a] rounded-lg border border-slate-200 dark:border-[#262626] flex justify-between items-center text-xs">
              <Text type="secondary">Sisa Stok Tersedia:</Text>
              <Text strong className="text-sm text-[#ff6a00]">{selectedItemDetail.quantity_remaining} Unit</Text>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item
              name="type"
              label={<Text strong>Tipe Adjustment</Text>}
              rules={[{ required: true, message: 'Pilih tipe adjustment' }]}
            >
              <Select
                size="large"
                placeholder="Pilih tipe"
                options={[
                  { label: 'Rusak (Damaged)', value: 'damaged' },
                  { label: 'Kadaluarsa (Expired)', value: 'expired' },
                  { label: 'Hilang (Lost)', value: 'lost' },
                  { label: 'Lainnya (Other)', value: 'other' },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="quantity"
              label={<Text strong>Jumlah (Qty)</Text>}
              rules={[{ required: true, message: 'Masukkan jumlah adjustment' }]}
            >
              <InputNumber
                size="large"
                min={1}
                max={maxQty}
                className="w-full"
                placeholder="Jumlah produk"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="reason"
            label={<Text strong>Alasan Adjustment</Text>}
            rules={[{ required: true, message: 'Masukkan alasan adjustment' }]}
          >
            <TextArea rows={3} placeholder="Contoh: Kemasan rusak saat dipindahkan ke rak..." />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-[#202020]">
            <Button size="large" onClick={() => navigate('/super-admin/stock-adjustment')}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isPending}
              className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
            >
              Simpan Adjustment
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
