import { useState } from 'react';
import { Input, Card, Tag, Badge, Empty, Skeleton, Select, App } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCartStore } from '../../store/useCartStore';
import type { Product } from '../../types/product';

export const ProductCatalog = () => {
  const { message } = App.useApp();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();

  const { data: productsData, isLoading } = useProducts({
    search: debouncedSearch || undefined,
    size: 50,
  });

  const { data: categoriesData } = useCategories();

  const cart = useCartStore((state) => state.cart);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    const res = addItem(product);
    if (!res.success && res.message) {
      message.error(res.message);
    } else if (res.success) {
      message.success(`${product.name} ditambahkan ke keranjang`);
    }
  };

  // Client-side category filtering if backend doesn't filter directly
  const filteredProducts = (productsData?.data || []).filter((product) => {
    if (!selectedCategory) return true;
    return product.categories?.some((c) => c.id === selectedCategory);
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Cari nama atau kode produk..."
          prefix={<SearchOutlined className="text-slate-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          size="large"
          className="flex-1"
        />
        <Select
          size="large"
          placeholder="Semua Kategori"
          allowClear
          className="w-full sm:w-48"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categoriesData?.data?.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))}
        />
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} size="small" className="rounded-xl border border-slate-200 dark:border-[#202020]">
                <Skeleton.Image className="w-full h-32! mb-3 rounded-lg" active />
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64 bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-[#202020]">
            <Empty description="Produk tidak ditemukan" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((item) => item.product_id === product.id);
              const inCartQty = cartItem?.quantity || 0;
              const isOutOfStock = (product.quantity ?? 0) <= 0;
              const isInactive = !product.active;
              const isDisabled = isOutOfStock || isInactive;

              return (
                <Badge.Ribbon
                  key={product.id}
                  text={isInactive ? 'Nonaktif' : (isOutOfStock ? 'Stok Habis' : undefined)}
                  color={isInactive ? 'default' : 'red'}
                  style={{ display: isDisabled ? 'block' : 'none' }}
                >
                  <Card
                    hoverable={!isDisabled}
                    onClick={() => !isDisabled && handleAddToCart(product)}
                    className={`rounded-xl overflow-hidden transition-all duration-200 select-none flex flex-col justify-between h-full dark:bg-[#141414] dark:border-[#202020] ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    } ${inCartQty > 0 ? 'border-primary ring-1 ring-primary' : ''}`}
                    cover={
                      <div className="relative w-full h-36 bg-slate-100 dark:bg-[#202020] overflow-hidden flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingCartOutlined className="text-4xl text-slate-300 dark:text-slate-600" />
                        )}
                        {inCartQty > 0 && (
                          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow">
                            <CheckCircleFilled /> {inCartQty} di keranjang
                          </div>
                        )}
                      </div>
                    }
                    styles={{ body: { padding: '12px' } }}
                  >
                    <div className="flex flex-col gap-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-2 leading-snug m-0">
                        {product.name}
                      </h4>

                      <div className="text-xs text-slate-500 font-medium">
                        Stok: <span className={isOutOfStock ? 'text-red-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>{product.quantity ?? 0}</span>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="font-bold text-primary text-sm sm:text-base">
                          Rp {(product.sale_price || 0).toLocaleString('id-ID')}
                        </span>
                        {isInactive ? (
                          <Tag color="default" className="m-0 text-xs">Nonaktif</Tag>
                        ) : isOutOfStock ? (
                          <Tag color="red" className="m-0 text-xs">Habis</Tag>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </Badge.Ribbon>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
