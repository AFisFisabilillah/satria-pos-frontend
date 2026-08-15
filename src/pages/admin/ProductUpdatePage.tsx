import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Switch,
  Upload,
  Typography,
  App,
  Card,
  Select,
  Spin,
  Image
} from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { AxiosError } from 'axios';
import { useProduct, useUpdateProduct } from '../../hooks/useProducts';
import { useUnits, useCreateUnit } from '../../hooks/useUnits';
import { useCategories, useCreateCategory } from '../../hooks/useCategories';
import type { CreateProductRequest } from '../../types/product';
import { useDebounce } from 'use-debounce';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const ProductUpdatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [unitSearch, setUnitSearch] = useState('');
  const [debouncedUnitSearch] = useDebounce(unitSearch, 500);
  const [categorySearch, setCategorySearch] = useState('');
  const [debouncedCategorySearch] = useDebounce(categorySearch, 500);

  const { data: units, isLoading: isUnitsLoading } = useUnits({ search: debouncedUnitSearch });
  const { data: product, isLoading: isProductLoading, isError: isProductError } = useProduct(id!);

  useEffect(() => {
    if (product && units) {
      form.setFieldsValue({
        name: product.name,
        code: product.code,
        sale_price: product.sale_price,
        unit_id: product.unit?.id,
        category_ids: product.categories?.map(c => c.id) || [],
        active: product.active,
        description: product.description,
      });
    }
  }, [product, units, form]);

  const { mutate: createUnit, isPending: isCreatingUnit } = useCreateUnit({
    onSuccess: (newUnit) => {
      message.success('Unit baru berhasil ditambahkan');
      form.setFieldValue('unit_id', newUnit.id);
      setUnitSearch('');
    },
    onError: () => message.error('Gagal menambahkan unit baru')
  });

  const { data: categories, isLoading: isCategoriesLoading } = useCategories({ search: debouncedCategorySearch });
  const { mutate: createCategory, isPending: isCreatingCategory } = useCreateCategory({
    onSuccess: (newCategory) => {
      message.success('Kategori baru berhasil ditambahkan');
      const currentCats = form.getFieldValue('category_ids') || [];
      form.setFieldValue('category_ids', [...currentCats, newCategory.id]);
      setCategorySearch('');
    },
    onError: () => message.error('Gagal menambahkan kategori baru')
  });

  const { mutate: updateProduct, isPending, error } = useUpdateProduct(id!, {
    onSuccess: () => {
      message.success('Produk berhasil diperbarui');
      navigate('/super-admin/product');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      message.error(err.response?.data?.message || 'Gagal memperbarui produk');
    }
  });

  const serverErrors = (error as AxiosError<{ errors?: Record<string, string[]> }>)
    ?.response?.data?.errors;

  const onFinish = (values: any) => {
    const payload: CreateProductRequest = {
      name: values.name,
      code: values.code,
      description: values.description,
      sale_price: values.sale_price,
      unit_id: Number(values.unit_id),
      active: values.active,
    };

    if (values.category_ids) {
      payload.category_ids = values.category_ids.map(Number);
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      payload.image = fileList[0].originFileObj;
    }    
    
    updateProduct(payload);
  };


 const uploadProps: UploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
      if (!isJpgOrPng) {
        message.error('Hanya bisa upload file JPG/PNG/WEBP!');
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Gambar harus lebih kecil dari 2MB!');
        return Upload.LIST_IGNORE;
      }
      setFileList([{ ...file, originFileObj: file } as UploadFile]);
      return false;
    },
    fileList,
    maxCount: 1,
    listType: "picture",
  };

  if (isProductLoading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  if (isProductError || !product) {
    return (
      <div className="text-center py-10">
        <Title level={4} className="text-red-500">Produk tidak ditemukan.</Title>
        <Button onClick={() => navigate('/super-admin/product')}>Kembali</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/super-admin/product')}
          type="text"
          className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#202020]"
        />
        <Title level={3} className="!m-0">Edit Produk: {product.name}</Title>
      </div>

      <Card className="dark:bg-[#141414] dark:border-[#202020] shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item
              name="name"
              label={<Text strong>Nama Produk <span className="text-red-500">*</span></Text>}
              rules={[{ required: true, message: 'Nama produk wajib diisi' }]}
              validateStatus={serverErrors?.name ? 'error' : undefined}
              help={serverErrors?.name?.[0]}
            >
              <Input size="large" placeholder="Masukkan nama produk" />
            </Form.Item>

            <Form.Item
              name="code"
              label={<Text strong>Kode Produk <span className="text-red-500">*</span></Text>}
              rules={[{ required: true, message: 'Kode produk wajib diisi' }]}
              validateStatus={serverErrors?.code ? 'error' : undefined}
              help={serverErrors?.code?.[0]}
            >
              <Input size="large" placeholder="Contoh: PRD-001" />
            </Form.Item>

            <Form.Item
              name="sale_price"
              label={<Text strong>Harga Jual <span className="text-red-500">*</span></Text>}
              rules={[{ required: true, message: 'Harga jual wajib diisi' }]}
              validateStatus={serverErrors?.sale_price ? 'error' : undefined}
              help={serverErrors?.sale_price?.[0]}
            >
              <InputNumber
                size="large"
                className="w-full"
                formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(value) => value?.replace(/\Rp\s?|(\.*)/g, '') as unknown as number}
                placeholder="0"
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="unit_id"
              label={<Text strong>Unit (Satuan) <span className="text-red-500">*</span></Text>}
              rules={[{ required: true, message: 'Unit wajib dipilih' }]}
              validateStatus={serverErrors?.unit_id ? 'error' : undefined}
              help={serverErrors?.unit_id?.[0]}
            >
              <Select
                size="large"
                showSearch
                placeholder="Pilih atau ketik satuan baru"
                loading={isUnitsLoading || isCreatingUnit}
                onSearch={setUnitSearch}
                filterOption={false}
                options={units?.data?.map((u) => ({ label: u.name, value: u.id })) || []}
                notFoundContent={
                  isUnitsLoading ? (
                    <div className="p-2 text-center"><Spin size="small" /></div>
                  ) : (
                    debouncedUnitSearch && (
                      <div className="p-2 flex flex-col gap-2 text-center">
                        <Text type="secondary">Unit "{debouncedUnitSearch}" tidak ditemukan.</Text>
                        <Button
                          type="dashed"
                          size="small"
                          onClick={() => createUnit({ name: debouncedUnitSearch })}
                          loading={isCreatingUnit}
                        >
                          Tambah Unit Baru
                        </Button>
                      </div>
                    )
                  )
                }
              />
            </Form.Item>

            <Form.Item
              name="category_ids"
              label={<Text strong>Kategori</Text>}
              validateStatus={serverErrors?.category_ids ? 'error' : undefined}
              help={serverErrors?.category_ids?.[0]}
            >
              <Select
                mode="multiple"
                size="large"
                showSearch
                placeholder="Pilih atau ketik kategori baru"
                loading={isCategoriesLoading || isCreatingCategory}
                onSearch={setCategorySearch}
                filterOption={false}
                options={categories?.map((c) => ({ label: c.name, value: c.id })) || []}
                notFoundContent={
                  isCategoriesLoading ? (
                    <div className="p-2 text-center"><Spin size="small" /></div>
                  ) : (
                    debouncedCategorySearch && (
                      <div className="p-2 flex flex-col gap-2 text-center">
                        <Text type="secondary">Kategori "{debouncedCategorySearch}" tidak ditemukan.</Text>
                        <Button
                          type="dashed"
                          size="small"
                          onClick={() => createCategory({ name: debouncedCategorySearch })}
                          loading={isCreatingCategory}
                        >
                          Tambah Kategori Baru
                        </Button>
                      </div>
                    )
                  )
                }
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

          <Form.Item
            name="description"
            label={<Text strong>Deskripsi Produk</Text>}
            validateStatus={serverErrors?.description ? 'error' : undefined}
            help={serverErrors?.description?.[0]}
          >
            <TextArea rows={4} placeholder="Masukkan deskripsi produk..." />
          </Form.Item>

          <Form.Item
            label={<Text strong>Gambar Produk (Biarkan kosong jika tidak ingin mengubah)</Text>}
            validateStatus={serverErrors?.image ? 'error' : undefined}
            help={serverErrors?.image?.[0]}
          >
            {product.image && fileList.length === 0 && (
              <div className="mb-3">
                <Image
                  width={80}
                  height={80}
                  src={`${product.image}`}
                  className="rounded-lg object-cover border border-slate-200 dark:border-[#232323]"
                />
              </div>
            )}
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Pilih Gambar Pengganti (Max: 2MB)</Button>
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-[#202020]">
            <Button size="large" onClick={() => navigate('/super-admin/product')}>
              Batal
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={isPending}
              className="bg-[#ff6a00] hover:bg-[#e55e00] border-none"
            >
              Perbarui Produk
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
