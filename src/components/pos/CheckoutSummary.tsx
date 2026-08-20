import { useState } from 'react';
import {
  Select,
  List,
  InputNumber,
  Button,
  Radio,
  Divider,
  Popconfirm,
  App,
  Typography,
  Modal,
  Tag
} from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useCartStore } from '../../store/useCartStore';
import { useMembers } from '../../hooks/useMembers';
import { useVouchers } from '../../hooks/useVouchers';
import { useCheckout } from '../../hooks/useCheckout';
import type { PaymentMethod } from '../../types/checkout';

const { Text, Title } = Typography;

interface CheckoutSummaryProps {
  onSuccessTransaction?: () => void;
}

export const CheckoutSummary = ({ onSuccessTransaction }: CheckoutSummaryProps) => {
  const { message, notification } = App.useApp();
  const [memberSearch, setMemberSearch] = useState('');
  const [successModalData, setSuccessModalData] = useState<any>(null);

  const { data: membersData, isLoading: isMembersLoading } = useMembers({
    name: memberSearch || undefined,
    size: 20,
  });

  const { data: vouchersData, isLoading: isVouchersLoading } = useVouchers({
    active: 1,
    size: 50,
  });

  const {
    cart,
    selectedMemberId,
    selectedVouchers,
    paymentMethod,
    paidAmount,
    removeItem,
    updateQuantity,
    setSelectedMemberId,
    setSelectedVouchers,
    setPaymentMethod,
    setPaidAmount,
    resetCart,
  } = useCartStore();

  // Price calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate discount from selected vouchers
  const discountAmount = selectedVouchers.reduce((acc, voucher) => {
    if (voucher.min_purchase && subtotal < voucher.min_purchase) {
      return acc; // Skip if min_purchase not met
    }
    if (voucher.type === 'percent') {
      return acc + (subtotal * voucher.value) / 100;
    }
    return acc + voucher.value;
  }, 0);

  const total = Math.max(0, subtotal - discountAmount);
  const changeAmount = paymentMethod === 'cash' ? paidAmount - total : 0;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Checkout Mutation
  const { mutate: doCheckout, isPending: isCheckingOut } = useCheckout({
    onSuccess: (res) => {
      notification.success({
        message: 'Transaksi Berhasil!',
        description: `Invoice: ${res.data.invoice_number} | Kembalian: Rp ${res.data.change_amount.toLocaleString('id-ID')}`,
        duration: 5,
      });

      setSuccessModalData(res.data);
      resetCart();
      if (onSuccessTransaction) onSuccessTransaction();
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Gagal memproses transaksi';
      notification.error({
        message: 'Gagal Memproses Transaksi',
        description: errorMsg,
        duration: 6,
      });
    },
  });

  const handleUpdateQty = (productId: number, newQty: number) => {
    const res = updateQuantity(productId, newQty);
    if (!res.success && res.message) {
      message.error(res.message);
    }
  };

  const handleVoucherChange = (voucherIds: number[]) => {
    const selected = (vouchersData?.data || []).filter((v) => voucherIds.includes(v.id));
    setSelectedVouchers(selected);
  };

  const isCheckoutDisabled =
    cart.length === 0 ||
    isCheckingOut ||
    (paymentMethod === 'cash' && paidAmount < total);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'cash' && paidAmount < total) {
      message.error(`Pembayaran kurang Rp ${(total - paidAmount).toLocaleString('id-ID')}`);
      return;
    }

    doCheckout({
      member_id: selectedMemberId,
      paid_amount: paymentMethod === 'cash' ? paidAmount : total,
      payment_method: paymentMethod,
      products: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      vouchers: selectedVouchers.map((v) => v.id),
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-[#202020] p-4 shadow-sm">
      {/* Header / Member & Voucher Section */}
      <div className="flex flex-col gap-3 pb-3 border-b border-slate-100 dark:border-[#202020]">
        <div>
          <Text className="block text-xs font-semibold text-slate-500 mb-1">Pilih Member (Opsional)</Text>
          <Select
            showSearch
            allowClear
            placeholder="Cari Member..."
            loading={isMembersLoading}
            value={selectedMemberId}
            onChange={setSelectedMemberId}
            onSearch={setMemberSearch}
            filterOption={false}
            className="w-full"
            options={membersData?.data?.map((m) => ({
              label: `${m.name} (${m.phone || '-'})`,
              value: m.id,
            }))}
          />
        </div>

        <div>
          <Text className="block text-xs font-semibold text-slate-500 mb-1">Voucher (Opsional)</Text>
          <Select
            mode="multiple"
            allowClear
            placeholder="Pilih Voucher..."
            loading={isVouchersLoading}
            value={selectedVouchers.map((v) => v.id)}
            onChange={handleVoucherChange}
            className="w-full"
            maxTagCount="responsive"
            options={vouchersData?.data?.map((v) => ({
              label: `${v.name} (${v.type === 'percent' ? `${v.value}%` : `Rp ${v.value.toLocaleString('id-ID')}`})`,
              value: v.id,
            }))}
          />
        </div>
      </div>

      {/* Cart List */}
      <div className="flex-1 overflow-y-auto my-3 pr-1">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <ShoppingCartOutlined className="text-4xl mb-2" />
            <Text type="secondary">Keranjang Belanja Kosong</Text>
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={cart}
            renderItem={(item) => (
              <List.Item
                className="px-0! py-3! border-b border-slate-100 dark:border-[#202020]"
                actions={[
                  <Popconfirm
                    key="delete"
                    title="Hapus item?"
                    onConfirm={() => removeItem(item.product_id)}
                    okText="Ya"
                    cancelText="Tidak"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-[#202020]"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 dark:bg-[#202020] rounded-lg flex items-center justify-center text-slate-400">
                        <ShoppingCartOutlined />
                      </div>
                    )
                  }
                  title={
                    <span className="font-semibold text-sm line-clamp-1 text-slate-800 dark:text-slate-100">
                      {item.name}
                    </span>
                  }
                  description={
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="text-xs text-slate-500">
                        Rp {item.price.toLocaleString('id-ID')} x {item.quantity} ={' '}
                        <strong className="text-slate-800 dark:text-slate-200">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </strong>
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          size="small"
                          icon={<MinusOutlined />}
                          onClick={() => handleUpdateQty(item.product_id, item.quantity - 1)}
                        />
                        <InputNumber
                          size="small"
                          min={1}
                          max={item.stock}
                          value={item.quantity}
                          onChange={(val) => val && handleUpdateQty(item.product_id, val)}
                          className="w-14 text-center"
                        />
                        <Button
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => handleUpdateQty(item.product_id, item.quantity + 1)}
                        />
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      {/* Summary Footer & Payment */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#202020] flex flex-col gap-3">
        {/* Price Breakdown */}
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal ({totalItems} item)</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Diskon Voucher</span>
              <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
            </div>
          )}

          <Divider className="my-1.5" />

          <div className="flex justify-between font-bold text-base text-slate-800 dark:text-slate-100">
            <span>Total</span>
            <span className="text-primary text-lg">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <Text className="block text-xs font-semibold text-slate-500 mb-1.5">Metode Pembayaran</Text>
          <Radio.Group
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full grid grid-cols-3 gap-2"
          >
            <Radio.Button value="cash" className="text-center">Cash</Radio.Button>
            <Radio.Button value="qris" className="text-center">QRIS</Radio.Button>
            <Radio.Button value="transfer" className="text-center">Transfer</Radio.Button>
          </Radio.Group>
        </div>

        {/* Cash Payment Details */}
        {paymentMethod === 'cash' && (
          <div className="flex flex-col gap-2 bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-200 dark:border-[#262626]">
            <div className="flex justify-between items-center">
              <Text className="text-xs font-medium">Jumlah Dibayar</Text>
              <InputNumber
                size="middle"
                className="w-36"
                min={0}
                placeholder="0"
                value={paidAmount}
                onChange={(val) => setPaidAmount(val || 0)}
                formatter={(val) => `Rp ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(val: string | undefined) => (val ? Number(val.replace(/Rp\s?|(\.*)/g, '')) : 0) as any}
              />
            </div>

            {/* Change or Deficit feedback */}
            {paidAmount > 0 && (
              <div className="flex justify-between items-center text-xs font-semibold pt-1 border-t border-slate-200 dark:border-[#303030]">
                <span>{paidAmount >= total ? 'Kembalian:' : 'Pembayaran Kurang:'}</span>
                <span className={paidAmount >= total ? 'text-green-600' : 'text-red-500'}>
                  Rp {Math.abs(changeAmount).toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Checkout Button */}
        <Button
          type="primary"
          size="large"
          block
          loading={isCheckingOut}
          disabled={isCheckoutDisabled}
          onClick={handleCheckout}
          className="bg-[#ff6a00] hover:bg-[#e55e00] border-none font-bold text-base h-12 shadow-md"
        >
          {isCheckingOut
            ? 'Memproses...'
            : `Checkout — Rp ${total.toLocaleString('id-ID')}`}
        </Button>
      </div>

      {/* Success Modal */}
      {successModalData && (
        <Modal
          open={!!successModalData}
          onOk={() => setSuccessModalData(null)}
          onCancel={() => setSuccessModalData(null)}
          footer={[
            <Button key="ok" type="primary" onClick={() => setSuccessModalData(null)} className="bg-[#ff6a00] border-none">
              Selesai & Transaksi Baru
            </Button>,
          ]}
        >
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <CheckCircleOutlined className="text-5xl text-green-500" />
            <Title level={4} className="m-0!">Transaksi Berhasil!</Title>
            <Tag color="blue" className="text-sm px-3 py-1 font-mono">{successModalData.invoice_number}</Tag>

            <div className="w-full bg-slate-50 dark:bg-[#1f1f1f] p-4 rounded-lg flex flex-col gap-2 text-sm mt-2">
              <div className="flex justify-between">
                <Text type="secondary">Metode Pembayaran</Text>
                <Text strong className="uppercase">{successModalData.payment_method}</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Total Transaksi</Text>
                <Text strong>Rp {Number(successModalData.total_price).toLocaleString('id-ID')}</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Jumlah Dibayar</Text>
                <Text strong>Rp {Number(successModalData.paid_amount).toLocaleString('id-ID')}</Text>
              </div>
              <Divider className="my-1" />
              <div className="flex justify-between text-base">
                <Text strong>Kembalian</Text>
                <Text strong className="text-green-600">Rp {Number(successModalData.change_amount).toLocaleString('id-ID')}</Text>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
