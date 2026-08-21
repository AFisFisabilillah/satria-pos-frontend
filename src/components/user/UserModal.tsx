import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, App, Descriptions, Spin, Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { AxiosError } from 'axios';
import { useCreateUser, useUpdateUser, useUser } from '../../hooks/useUsers';
import type { CreateUserRequest } from '../../types/user';

const ROLE_OPTIONS = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Cashier', value: 'cashier' },
];

interface UserModalProps {
  open: boolean;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'detail';
  userId?: number | string | null;
}

export const UserModal = ({ open, onCancel, mode, userId }: UserModalProps) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const { data: userData, isLoading: isLoadingUser } = useUser(mode !== 'create' && userId ? userId : '');

  const handleClose = () => {
    setServerErrors({});
    form.resetFields();
    onCancel();
  };

  const handleError = (err: AxiosError<{ errors?: Record<string, string[]>; message?: string }>) => {
    const errors = err.response?.data?.errors;
    if (errors) {
      setServerErrors(errors);
    } else {
      message.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const { mutate: createUser, isPending: isCreating } = useCreateUser({
    onSuccess: () => { message.success('User berhasil ditambahkan'); handleClose(); },
    onError: handleError,
  });

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(userId || '', {
    onSuccess: () => { message.success('User berhasil diubah'); handleClose(); },
    onError: handleError,
  });

  useEffect(() => {
    if (open && userData && mode !== 'create') {
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    }
  }, [open, userData, mode, form]);

  const onFinish = (values: CreateUserRequest) => {
    setServerErrors({});
    if (mode === 'edit') {
      // Only send password if filled
      const payload: Partial<CreateUserRequest> = { name: values.name, email: values.email, role: values.role };
      if (values.password) payload.password = values.password;
      updateUser(payload);
    } else {
      createUser(values);
    }
  };

  const title = mode === 'create' ? 'Tambah User' : mode === 'edit' ? 'Edit User' : 'Detail User';

  // Detail view
  if (mode === 'detail') {
    return (
      <Modal title={title} open={open} onCancel={handleClose} footer={null} destroyOnClose>
        {isLoadingUser ? (
          <div className="flex justify-center py-8"><Spin size="large" /></div>
        ) : userData ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar size={80} icon={<UserOutlined />} src={userData.foto_profile} className="bg-[#ff6a00]" />
            <Descriptions column={1} bordered size="small" className="w-full" labelStyle={{ width: '120px' }}>
              <Descriptions.Item label="Nama">{userData.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={userData.role === 'super_admin' ? 'red' : 'blue'} bordered={false}>{userData.role_label}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : null}
      </Modal>
    );
  }

  // Create / Edit form
  return (
    <Modal title={title} open={open} onCancel={handleClose} footer={null} destroyOnClose>
      {mode === 'edit' && isLoadingUser ? (
        <div className="flex justify-center py-8"><Spin size="large" /></div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item
            name="name" label="Nama"
            rules={[{ required: true, message: 'Nama wajib diisi' }]}
            validateStatus={serverErrors.name ? 'error' : undefined}
            help={serverErrors.name?.[0]}
          >
            <Input placeholder="Nama lengkap" size="large" />
          </Form.Item>

          <Form.Item
            name="email" label="Email"
            rules={[{ required: true, message: 'Email wajib diisi' }, { type: 'email', message: 'Format email tidak valid' }]}
            validateStatus={serverErrors.email ? 'error' : undefined}
            help={serverErrors.email?.[0]}
          >
            <Input placeholder="email@example.com" size="large" />
          </Form.Item>

          <Form.Item
            name="role" label="Role"
            rules={[{ required: true, message: 'Role wajib dipilih' }]}
            validateStatus={serverErrors.role ? 'error' : undefined}
            help={serverErrors.role?.[0]}
          >
            <Select placeholder="Pilih role" size="large" options={ROLE_OPTIONS} />
          </Form.Item>

          <Form.Item
            name="password" label={mode === 'edit' ? 'Password (kosongkan jika tidak diubah)' : 'Password'}
            rules={mode === 'create' ? [{ required: true, message: 'Password wajib diisi' }, { min: 6, message: 'Minimal 6 karakter' }] : [{ min: 6, message: 'Minimal 6 karakter' }]}
            validateStatus={serverErrors.password ? 'error' : undefined}
            help={serverErrors.password?.[0]}
          >
            <Input.Password placeholder="Masukkan password" size="large" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={handleClose} size="large">Batal</Button>
            <Button type="primary" htmlType="submit" loading={isCreating || isUpdating} size="large" className="bg-[#ff6a00]">
              {mode === 'edit' ? 'Simpan Perubahan' : 'Simpan'}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};
