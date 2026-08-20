import { create } from 'zustand';
import type { CartItem, PaymentMethod } from '../types/checkout';
import type { Voucher } from '../types/voucher';
import type { Product } from '../types/product';

interface CartState {
  cart: CartItem[];
  selectedMemberId?: number;
  selectedVouchers: Voucher[];
  paymentMethod: PaymentMethod;
  paidAmount: number;

  // Actions
  addItem: (product: Product) => { success: boolean; message?: string };
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => { success: boolean; message?: string };
  setSelectedMemberId: (memberId?: number) => void;
  setSelectedVouchers: (vouchers: Voucher[]) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPaidAmount: (amount: number) => void;
  resetCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  selectedMemberId: undefined,
  selectedVouchers: [],
  paymentMethod: 'cash',
  paidAmount: 0,

  addItem: (product: Product) => {
    const { cart } = get();
    const existingIndex = cart.findIndex((item) => item.product_id === product.id);

    if (product.quantity <= 0) {
      return { success: false, message: `Stok produk "${product.name}" habis!` };
    }

    if (existingIndex > -1) {
      const existingItem = cart[existingIndex];
      if (existingItem.quantity + 1 > product.quantity) {
        return {
          success: false,
          message: `Stok produk "${product.name}" tidak mencukupi. Sisa stok: ${product.quantity}`,
        };
      }

      const updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      set({ cart: updatedCart });
      return { success: true };
    }

    const newItem: CartItem = {
      product_id: product.id,
      name: product.name,
      price: product.sale_price,
      stock: product.quantity,
      quantity: 1,
      image: product.image,
    };

    set({ cart: [...cart, newItem] });
    return { success: true };
  },

  removeItem: (productId: number) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product_id !== productId),
    }));
  },

  updateQuantity: (productId: number, quantity: number) => {
    const { cart } = get();
    const item = cart.find((i) => i.product_id === productId);

    if (!item) return { success: false };

    if (quantity > item.stock) {
      return {
        success: false,
        message: `Stok untuk produk "${item.name}" tidak mencukupi. Sisa stok: ${item.stock}`,
      };
    }

    if (quantity <= 0) {
      set((state) => ({
        cart: state.cart.filter((i) => i.product_id !== productId),
      }));
      return { success: true };
    }

    set((state) => ({
      cart: state.cart.map((i) =>
        i.product_id === productId ? { ...i, quantity } : i
      ),
    }));
    return { success: true };
  },

  setSelectedMemberId: (memberId?: number) => set({ selectedMemberId: memberId }),

  setSelectedVouchers: (vouchers: Voucher[]) => set({ selectedVouchers: vouchers }),

  setPaymentMethod: (method: PaymentMethod) => set({ paymentMethod: method }),

  setPaidAmount: (amount: number) => set({ paidAmount: amount }),

  resetCart: () =>
    set({
      cart: [],
      selectedMemberId: undefined,
      selectedVouchers: [],
      paymentMethod: 'cash',
      paidAmount: 0,
    }),
}));
