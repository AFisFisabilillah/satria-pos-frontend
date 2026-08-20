import { useNavigate } from 'react-router';
import {
  Form,
  Input,
  Button,
  Typography,
  App,
  Card,
  Select,
  DatePicker,
  InputNumber,
  Switch
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { AxiosError } from 'axios';
import { useCreateVoucher } from '../../hooks/useVouchers';
import type { CreateVoucherRequest } from '../../types/voucher';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const VoucherCreatePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const typeValue = Form.useWatch('type', form);

  const { mutate: createVoucher, isPending } = useCreateVoucher({
    onSuccess: () => {
      message.success('Voucher berhasil ditambahkan');
      navigate('/super-admin/voucher');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      message.error(err.response?.data?.message || 'Gagal menambahkan voucher');
    }
  });

  const onFinish = (values: any) => {
    const payload: CreateVoucherRequest = {
      name: values.name,
      code: values.code,
      type: values.type,
      value: values.value,
      quota: values.quota,
      min_purchase: values.min_purchase,
      expired_at: values.expired_at.format('YYYY-MM-DD'),
      active: values.active ? 1 : 0,
    };

    createVoucher(payload);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/super-admin/voucher')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="m-0!">Tambah Voucher</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{
            type: 'percent',
            active: true
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item
              name="name"
              label={<Text strong>Nama Voucher</Text>}
              rules={[{ required: true, message: 'Nama voucher wajib diisi' }]}
            >
              <Input size="large" placeholder="Contoh: VOUCHER 30% KEMERDEKAAN" />
            </Form.Item>

            <Form.Item
              name="code"
              label={<Text strong>Kode Voucher</Text>}
              rules={[
                { required: true, message: 'Kode voucher wajib diisi' },
                { pattern: /^\S+$/, message: 'Kode voucher tidak boleh mengandung spasi' }
              ]}
            >
              <Input size="large" placeholder="Contoh: MERDEKA30" className="font-mono uppercase" />
            </Form.Item>

            <Form.Item
              name="type"
              label={<Text strong>Tipe Diskon</Text>}
              rules={[{ required: true, message: 'Tipe diskon wajib dipilih' }]}
            >
              <Select
                size="large"
                options={[
                  { label: 'Persentase (%)', value: 'percent' },
                  { label: 'Nominal (Rp)', value: 'fixed' },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="value"
              label={<Text strong>Nilai Diskon</Text>}
              rules={[
                { required: true, message: 'Nilai diskon wajib diisi' },
                () => ({
                  validator(_, value) {
                    if (typeValue === 'percent' && value > 100) {
                      return Promise.reject(new Error('Diskon persentase maksimal 100%'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber
                size="large"
                className="w-full"
                min={0}
                placeholder={typeValue === 'percent' ? 'Maksimal 100' : 'Masukkan nominal'}
                formatter={(value) => typeValue === 'percent' ? `${value}%` : `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(value: string | undefined) => (value ? Number(value.replace(/Rp\s?|%|(\.*)/g, '')) : 0) as any}
              />
            </Form.Item>

            <Form.Item
              name="quota"
              label={<Text strong>Kuota</Text>}
              rules={[{ required: true, message: 'Kuota wajib diisi' }]}
            >
              <InputNumber size="large" className="w-full" min={1} placeholder="Jumlah kuota" />
            </Form.Item>

            <Form.Item
              name="min_purchase"
              label={<Text strong>Minimal Pembelian (Opsional)</Text>}
            >
              <InputNumber
                size="large"
                className="w-full"
                min={0}
                placeholder="Contoh: 50000"
                formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(value: string | undefined) => (value ? Number(value.replace(/Rp\s?|(\.*)/g, '')) : 0) as any}
              />
            </Form.Item>

            <Form.Item
              name="expired_at"
              label={<Text strong>Tanggal Kadaluarsa</Text>}
              rules={[{ required: true, message: 'Tanggal kadaluarsa wajib diisi' }]}
            >
              <DatePicker
                size="large"
                className="w-full"
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current < dayjs().endOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="active"
              label={<Text strong>Status Aktif</Text>}
              valuePropName="checked"
            >
              <Switch checkedChildren="Aktif" unCheckedChildren="Nonaktif" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-[#202020]">
            <Button size="large" onClick={() => navigate('/super-admin/voucher')}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isPending}
              className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
            >
              Simpan Voucher
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
