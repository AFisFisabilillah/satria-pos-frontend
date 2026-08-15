import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, App, Switch } from 'antd';
import type { AxiosError } from 'axios';
import { useCreateMember } from '../../hooks/useMembers';
import type { CreateMemberRequest } from '../../types/member';

interface MemberModalProps {
  open: boolean;
  onCancel: () => void;
}

export const MemberModal = ({ open, onCancel }: MemberModalProps) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const handleClose = () => {
    setServerErrors({});
    form.resetFields();
    onCancel();
  };

  const { mutate: createMember, isPending: isCreating } = useCreateMember({
    onSuccess: () => {
      message.success('Member berhasil ditambahkan');
      handleClose();
    },
    onError: (err: AxiosError<{ errors?: Record<string, string[]>; message?: string }>) => {
      const errors = err.response?.data?.errors;
      if (errors) {
        setServerErrors(errors);
      } else {
        message.error(err.response?.data?.message || 'Gagal menambahkan member');
      }
    }
  });

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ active: true });
    }
  }, [open, form]);

  const onFinish = (values: CreateMemberRequest) => {
    createMember(values);
  };

  return (
    <Modal
      title="Tambah Member Baru"
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-4"
        initialValues={{ active: true }}
      >
        <Form.Item
          name="name"
          label="Nama Member"
          rules={[{ required: true, message: 'Nama member wajib diisi' }]}
          validateStatus={serverErrors.name ? 'error' : undefined}
          help={serverErrors.name?.[0]}
        >
          <Input placeholder="Masukkan nama member" size="large" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="No HP / WhatsApp"
          validateStatus={serverErrors.phone ? 'error' : undefined}
          help={serverErrors.phone?.[0]}
        >
          <Input placeholder="Contoh: 08123456789" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: 'email', message: 'Format email tidak valid' }
          ]}
          validateStatus={serverErrors.email ? 'error' : undefined}
          help={serverErrors.email?.[0]}
        >
          <Input placeholder="Contoh: john@example.com" size="large" />
        </Form.Item>

        <Form.Item
          name="active"
          label="Status Aktif"
          valuePropName="checked"
        >
          <Switch checkedChildren="Aktif" unCheckedChildren="Nonaktif" />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={handleClose} size="large">Batal</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating}
            size="large"
            className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
          >
            Simpan
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
