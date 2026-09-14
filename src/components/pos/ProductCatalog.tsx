import { useState, useMemo } from 'react';
import { AutoComplete, Input, Card, Empty, Select, App, Button, InputNumber, Popconfirm } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
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

  const { data: productsData } = useProducts({
    search: debouncedSearch || undefined,
    size: 50,
  });

  const { data: categoriesData } = useCategories();

  const cart = useCartStore((state) => state.cart);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleAddToCart = (product: Product) => {
    const res = addItem(product);
    if (!res.success && res.message) {
      message.error(res.message);
    } else if (res.success) {
      message.success(`${product.name} ditambahkan ke keranjang`);
    }
  };

  const handleUpdateQty = (productId: number, newQty: number) => {
    const res = updateQuantity(productId, newQty);
    if (!res.success && res.message) {
      message.error(res.message);
    }
  };

  const allProducts = productsData?.data || [];

  // Dropdown options with product image
  const searchOptions = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return allProducts
      .filter((p) => p.name.toLowerCase().includes(query) || p.code?.toLowerCase().includes(query))
      .map((p) => ({
        value: p.name,
        label: (
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 bg-slate-100 dark:bg-[#202020] rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-200 dark:border-[#303030]">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <ShoppingCartOutlined className="text-slate-400 text-lg" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{p.name}</div>
              <div className="text-xs text-slate-500">
                Stok: <span className={(p.quantity ?? 0) <= 0 ? 'text-red-500 font-bold' : ''}>{p.quantity ?? 0}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-primary text-sm">
                Rp {(p.sale_price || 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        ),
        product: p,
      }));
  }, [allProducts, search]);

  const handleSelectOption = (_: string, option: any) => {
    if (option?.product) {
      handleAddToCart(option.product);
      setSearch('');
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      const query = search.toLowerCase();
      const match = allProducts.find((p) =>
        p.name.toLowerCase().includes(query) ||
        p.code?.toLowerCase().includes(query)
      );
      if (match) {
        handleAddToCart(match);
        setSearch('');
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <AutoComplete
          options={searchOptions}
          onSelect={handleSelectOption}
          value={search}
          onChange={setSearch}
          placeholder="Cari nama atau kode produk... (Enter untuk tambah)"
          className="flex-1"
          size="large"
          onKeyDown={handleSearchKeyDown}
          prefix={<SearchOutlined className="text-slate-400" />}
          allowClear
        >
        </AutoComplete>
      </div>

      {/* Cart Grid Display */}
      <div className="flex-1 overflow-y-auto pr-1">
        {cart.length === 0 ? (
          <div className="flex justify-center items-center h-64 bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-[#202020]">
            <Empty description="Keranjang belanja kosong. Cari produk di atas untuk menambahkan item." />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {cart.map((item) => (
              <Card
                key={item.product_id}
                className="rounded-xl overflow-hidden transition-all duration-200 border-primary ring-1 ring-primary flex flex-col justify-between h-full dark:bg-[#141414] dark:border-[#202020]"
                cover={
                  <div className="relative w-full h-36 bg-slate-100 dark:bg-[#202020] overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingCartOutlined className="text-4xl text-slate-300 dark:text-slate-600" />
                    )}
                    <Popconfirm
                      title="Hapus item?"
                      onConfirm={() => removeItem(item.product_id)}
                      okText="Ya"
                      cancelText="Tidak"
                    >
                      <Button
                        type="primary"
                        danger
                        shape="circle"
                        icon={<DeleteOutlined />}
                        size="small"
                        className="absolute top-2 right-2 shadow"
                      />
                    </Popconfirm>
                  </div>
                }
                styles={{ body: { padding: '12px' } }}
              >
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-2 leading-snug m-0">
                    {item.name}
                  </h4>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary text-sm sm:text-base">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Subtotal: <strong className="text-slate-700 dark:text-slate-200">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</strong>
                    </span>
                  </div>

                  {/* Qty controller inside card */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#202020]">
                    <span className="text-xs text-slate-500">Jumlah:</span>
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
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
