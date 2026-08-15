import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, App } from 'antd';
import type { AxiosError } from 'axios';
import { useCreateSupplier, useUpdateSupplier } from '../../hooks/useSuppliers';
import type { Supplier } from '../../types/supplier';

interface SupplierModalProps {
  open: boolean;
  onCancel: () => void;
  initialData?: Supplier | null;
}

export const SupplierModal = ({ open, onCancel, initialData }: SupplierModalProps) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const isEdit = !!initialData;

  const { mutate: createSupplier, isPending: isCreating } = useCreateSupplier({
    onSuccess: () => {
      message.success('Supplier berhasil ditambahkan');
      form.resetFields();
      setServerErrors({});
      onCancel();
    },
    onError: (err: AxiosError<any>) => {
      const errors = err.response?.data?.errors;
      if (errors) {
        setServerErrors(errors);
      } else {
        message.error(err.response?.data?.message || 'Gagal menambahkan supplier');
      }
    }
  });

  const { mutate: updateSupplier, isPending: isUpdating } = useUpdateSupplier(initialData?.id || '', {
    onSuccess: () => {
      message.success('Supplier berhasil diubah');
      form.resetFields();
      setServerErrors({});
      onCancel();
    },
    onError: (err: AxiosError<any>) => {
      const errors = err.response?.data?.errors;
      if (errors) {
        setServerErrors(errors);
      } else {
        message.error(err.response?.data?.message || 'Gagal mengubah supplier');
      }
    }
  });

  useEffect(() => {
    if (open) {
      setServerErrors({});
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialData, form]);

  const onFinish = (values: any) => {
    if (isEdit) {
      updateSupplier(values);
    } else {
      createSupplier(values);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Supplier' : 'Tambah Supplier Baru'}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Nama Supplier"
          rules={[{ required: true, message: 'Nama supplier wajib diisi' }]}
          validateStatus={serverErrors.name ? 'error' : undefined}
          help={serverErrors.name?.[0]}
        >
          <Input placeholder="Masukkan nama supplier" size="large" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="No HP / WhatsApp"
          rules={[{ required: true, message: 'No HP wajib diisi' }]}
          validateStatus={serverErrors.phone ? 'error' : undefined}
          help={serverErrors.phone?.[0]}
        >
          <Input placeholder="Contoh: 08123456789" size="large" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Alamat"
          rules={[{ required: true, message: 'Alamat wajib diisi' }]}
          validateStatus={serverErrors.address ? 'error' : undefined}
          help={serverErrors.address?.[0]}
        >
          <Input.TextArea rows={3} placeholder="Masukkan alamat lengkap..." />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            name="city"
            label="Kota"
            rules={[{ required: true, message: 'Kota wajib diisi' }]}
            validateStatus={serverErrors.city ? 'error' : undefined}
            help={serverErrors.city?.[0]}
          >
            <Input placeholder="Contoh: Bekasi" size="large" />
          </Form.Item>

          <Form.Item
            name="province"
            label="Provinsi"
            rules={[{ required: true, message: 'Provinsi wajib diisi' }]}
            validateStatus={serverErrors.province ? 'error' : undefined}
            help={serverErrors.province?.[0]}
          >
            <Input placeholder="Contoh: Jawa Barat" size="large" />
          </Form.Item>
        </div>

        <Form.Item
          name="postal_code"
          label="Kode Pos"
          rules={[{ required: true, message: 'Kode pos wajib diisi' }]}
          validateStatus={serverErrors.postal_code ? 'error' : undefined}
          help={serverErrors.postal_code?.[0]}
        >
          <Input placeholder="Contoh: 17152" size="large" />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onCancel} size="large">Batal</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
            size="large"
            className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
          >
            {isEdit ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
