import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { AuthState, CartState, User, FoodItem, CartItem } from './types';

const initializeAuthStore = (): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> => {
  if (typeof window === 'undefined') {
    // Server-side: return empty state
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
  // Client-side: read from cookies
  return {
    user: null,
    token: Cookies.get('token') || null,
    isAuthenticated: !!Cookies.get('token'),
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initializeAuthStore(),

  setUser: (user: User | null) => set({ user }),
  setToken: (token: string | null) => {
    if (token) {
      Cookies.set('token', token, { expires: 7 });
    } else {
      Cookies.remove('token');
    }
    set({ token, isAuthenticated: !!token });
  },
  logout: () => {
    Cookies.remove('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export const useCartStore = create<CartState>((set, get) => ({
  cart: typeof window === 'undefined' ? [] : (JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]),
  total: 0,

  addToCart: (food: FoodItem) => {
    const cart = get().cart;
    const existingItem = cart.find((item) => item._id === food._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...food, quantity: 1 });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    set({ cart: [...cart], total });
  },

  removeFromCart: (foodId: string) => {
    const cart = get().cart.filter((item) => item._id !== foodId);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    set({ cart, total });
  },

  updateQuantity: (foodId: string, quantity: number) => {
    const cart = get().cart.map((item) =>
      item._id === foodId ? { ...item, quantity } : item
    );
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    set({ cart, total });
  },

  clearCart: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
    set({ cart: [], total: 0 });
  },
}));
