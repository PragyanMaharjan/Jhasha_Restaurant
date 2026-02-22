import { create } from 'zustand';
import Cookies from 'js-cookie';

const initializeAuthStore = () => {
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

export const useAuthStore = create((set) => ({
  ...initializeAuthStore(),

  setUser: (user) => set({ user }),
  setToken: (token) => {
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

export const useCartStore = create((set, get) => ({
  cart: typeof window === 'undefined' ? [] : (JSON.parse(localStorage.getItem('cart') || '[]')),
  total: 0,

  addToCart: (food) => {
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

  removeFromCart: (foodId) => {
    const cart = get().cart.filter((item) => item._id !== foodId);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    set({ cart, total });
  },

  updateQuantity: (foodId, quantity) => {
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
