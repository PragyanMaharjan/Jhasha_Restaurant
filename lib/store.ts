import { create } from 'zustand';
import Cookies from 'js-cookie';
import API from './api';
import type { AuthState, CartState, User, FoodItem, CartItem } from './types';

const initializeAuthStore = (): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }

  return {
    user: null,
    token: Cookies.get('token') || null,
    isAuthenticated: !!Cookies.get('token'),
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initializeAuthStore(),

  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
  setToken: (token: string | null) => {
    if (token) {
      Cookies.set('token', token, { expires: 7 });
      set({ token, isAuthenticated: true });
    } else {
      Cookies.remove('token');
      set({ token: null, isAuthenticated: false });
    }
  },
  logout: () => {
    Cookies.remove('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

const getStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
  } catch {
    return [];
  }
};

const calculateCartTotal = (items: CartItem[]) => items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

const normalizeCartItems = (payload: any): CartItem[] => {
  const rawItems = payload?.data?.cart?.items ?? payload?.cart?.items ?? payload?.items ?? [];

  return rawItems.map((item: any) => {
    const product = item.product || item.food || item;
    const normalizedProduct = product && typeof product === 'object' ? product : {};

    return {
      ...normalizedProduct,
      _id: normalizedProduct._id || product?._id || item._id || '',
      cartItemId: item._id || item.cartItemId || '',
      quantity: item.quantity || 1,
      price: normalizedProduct.price ?? item.price ?? 0,
      image: normalizedProduct.image ?? item.image ?? '',
      name: normalizedProduct.name ?? item.name ?? '',
      description: normalizedProduct.description ?? item.description ?? '',
    } as CartItem;
  });
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: getStoredCart(),
  total: calculateCartTotal(getStoredCart()),

  hydrateCart: async () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!useAuthStore.getState().isAuthenticated) {
      const fallbackCart = getStoredCart();
      set({ cart: fallbackCart, total: calculateCartTotal(fallbackCart) });
      return;
    }

    try {
      const response = await API.get('/cart');
      const normalizedCart = normalizeCartItems(response.data);
      const total = calculateCartTotal(normalizedCart);
      localStorage.setItem('cart', JSON.stringify(normalizedCart));
      set({ cart: normalizedCart, total });
    } catch {
      const fallbackCart = getStoredCart();
      set({ cart: fallbackCart, total: calculateCartTotal(fallbackCart) });
    }
  },

  addToCart: async (food: FoodItem) => {
    const existingCart = get().cart;
    const existingItem = existingCart.find((item) => item._id === food._id);

    if (!useAuthStore.getState().isAuthenticated) {
      const nextCart = existingItem
        ? existingCart.map((item) => item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...existingCart, { ...food, quantity: 1 }];
      const total = calculateCartTotal(nextCart);
      localStorage.setItem('cart', JSON.stringify(nextCart));
      set({ cart: nextCart, total });
      return;
    }

    try {
      const response = await API.post('/cart', { productId: food._id, quantity: 1 });
      const normalizedCart = normalizeCartItems(response.data);
      const total = calculateCartTotal(normalizedCart);
      localStorage.setItem('cart', JSON.stringify(normalizedCart));
      set({ cart: normalizedCart, total });
    } catch {
      const nextCart = existingItem
        ? existingCart.map((item) => item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...existingCart, { ...food, quantity: 1 }];
      const total = calculateCartTotal(nextCart);
      localStorage.setItem('cart', JSON.stringify(nextCart));
      set({ cart: nextCart, total });
    }
  },

  removeFromCart: async (foodId: string) => {
    const target = get().cart.find((item) => item._id === foodId);

    if (!useAuthStore.getState().isAuthenticated) {
      const nextCart = get().cart.filter((item) => item._id !== foodId);
      const total = calculateCartTotal(nextCart);
      localStorage.setItem('cart', JSON.stringify(nextCart));
      set({ cart: nextCart, total });
      return;
    }

    if (!target?.cartItemId) {
      const nextCart = get().cart.filter((item) => item._id !== foodId);
      const total = calculateCartTotal(nextCart);
      localStorage.setItem('cart', JSON.stringify(nextCart));
      set({ cart: nextCart, total });
      return;
    }

    try {
      await API.delete(`/cart/${target.cartItemId}`);
      await get().hydrateCart();
    } catch {
      const nextCart = get().cart.filter((item) => item._id !== foodId);
      const total = calculateCartTotal(nextCart);
      localStorage.setItem('cart', JSON.stringify(nextCart));
      set({ cart: nextCart, total });
    }
  },

  updateQuantity: async (foodId: string, quantity: number) => {
    const target = get().cart.find((item) => item._id === foodId);

    if (!useAuthStore.getState().isAuthenticated) {
      const nextCart = get().cart.map((item) => item._id === foodId ? { ...item, quantity: Math.max(quantity, 0) } : item).filter((item) => item.quantity > 0);
      const total = calculateCartTotal(nextCart);
      localStorage.setItem('cart', JSON.stringify(nextCart));
      set({ cart: nextCart, total });
      return;
    }

    if (!target?.cartItemId) {
      const nextCart = get().cart.map((item) => item._id === foodId ? { ...item, quantity: Math.max(quantity, 0) } : item).filter((item) => item.quantity > 0);
      const total = calculateCartTotal(nextCart);
      localStorage.setItem('cart', JSON.stringify(nextCart));
      set({ cart: nextCart, total });
      return;
    }

    if (quantity <= 0) {
      await get().removeFromCart(foodId);
      return;
    }

    try {
      await API.put(`/cart/${target.cartItemId}`, { quantity });
      await get().hydrateCart();
    } catch {
      const nextCart = get().cart.map((item) => item._id === foodId ? { ...item, quantity } : item);
      const total = calculateCartTotal(nextCart);
      localStorage.setItem('cart', JSON.stringify(nextCart));
      set({ cart: nextCart, total });
    }
  },

  clearCart: async () => {
    if (!useAuthStore.getState().isAuthenticated) {
      localStorage.removeItem('cart');
      set({ cart: [], total: 0 });
      return;
    }

    try {
      await API.delete('/cart');
      localStorage.removeItem('cart');
      set({ cart: [], total: 0 });
    } catch {
      localStorage.removeItem('cart');
      set({ cart: [], total: 0 });
    }
  },
}));
