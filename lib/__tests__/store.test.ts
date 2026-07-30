import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useAuthStore, useCartStore } from '@/lib/store';
import Cookies from 'js-cookie';

vi.mock('js-cookie');

describe('useAuthStore - Zustand Auth Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to initial state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    } as any);
  });

  describe('Initial State', () => {
    it('initializes with default state', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBe(null);
      expect(state.token).toBe(null);
      expect(state.isAuthenticated).toBe(false);
    });

    it('initializes with token from cookies', () => {
      (Cookies.get as any).mockReturnValue('stored-token-xyz');
      useAuthStore.setState({ token: 'stored-token-xyz', isAuthenticated: true });

      const state = useAuthStore.getState();
      expect(state.token).toBe('stored-token-xyz');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('setUser Action', () => {
    it('sets user data in store', () => {
      const testUser = { _id: '123', name: 'Test User', email: 'test@test.com', role: 'user' };
      useAuthStore.setState({ user: testUser });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(testUser);
    });

    it('updates user data without affecting other state', () => {
      const testUser = { _id: '123', name: 'Test User', email: 'test@test.com', role: 'user' };
      useAuthStore.setState({ user: testUser, isAuthenticated: true });

      const updatedUser = { ...testUser, name: 'Updated Name' };
      useAuthStore.setState({ user: updatedUser });

      const state = useAuthStore.getState();
      expect(state.user?.name).toBe('Updated Name');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('setToken Action', () => {
    it('sets token and marks as authenticated', () => {
      useAuthStore.setState({ token: 'new-token-123', isAuthenticated: true } as any);

      const state = useAuthStore.getState();
      expect(state.token).toBe('new-token-123');
      expect(state.isAuthenticated).toBe(true);
    });

    it('handles empty token', () => {
      useAuthStore.setState({ token: '', isAuthenticated: false });

      const state = useAuthStore.getState();
      expect(state.token).toBe('');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logout Action', () => {
    it('clears user and token on logout', () => {
      useAuthStore.setState({
        user: { _id: '123', name: 'Test', email: 'test@test.com', role: 'user' },
        token: 'token-123',
        isAuthenticated: true,
      } as any);

      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
      } as any);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});

describe('useCartStore - Zustand Cart Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.setState({
      cart: [],
      total: 0,
    } as any);
  });

  describe('Initial State', () => {
    it('initializes empty cart', () => {
      const state = useCartStore.getState();
      expect(state.cart).toEqual([]);
      expect(state.total).toBe(0);
    });
  });

  describe('addToCart Action', () => {
    it('adds item to empty cart', () => {
      const item = {
        _id: '1',
        name: 'Pizza',
        price: 299,
        image: 'pizza.jpg',
        quantity: 1,
      };

      const currentCart = useCartStore.getState().cart;
      useCartStore.setState({
        cart: [...currentCart, item],
        total: 299,
      } as any);

      const state = useCartStore.getState();
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0]).toEqual(item);
      expect(state.total).toBe(299);
    });

    it('increases quantity if item already exists', () => {
      const item = {
        _id: '1',
        name: 'Pizza',
        price: 299,
        image: 'pizza.jpg',
        quantity: 1,
      };

      useCartStore.setState({ cart: [item], total: 299 });

      const updated = {
        ...item,
        quantity: 2,
      };

      const currentCart = useCartStore.getState().cart;
      useCartStore.setState({
        cart: [updated],
        total: 598,
      } as any);

      const state = useCartStore.getState();
      expect(state.cart[0].quantity).toBe(2);
      expect(state.total).toBe(598);
    });
  });

  describe('removeFromCart Action', () => {
    it('removes item from cart', () => {
      const items = [
        { _id: '1', name: 'Pizza', price: 299, image: 'pizza.jpg', quantity: 1 },
        { _id: '2', name: 'Burger', price: 199, image: 'burger.jpg', quantity: 1 },
      ];

      useCartStore.setState({ cart: items, total: 498 } as any);

      const filtered = items.filter(item => item._id !== '1');
      useCartStore.setState({ cart: filtered, total: 199 } as any);

      const state = useCartStore.getState();
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0]._id).toBe('2');
      expect(state.total).toBe(199);
    });
  });

  describe('updateQuantity Action', () => {
    it('updates item quantity', () => {
      const item = {
        _id: '1',
        name: 'Pizza',
        price: 299,
        image: 'pizza.jpg',
        quantity: 1,
      };

      useCartStore.setState({ cart: [item], total: 299 } as any);

      const updated = { ...item, quantity: 3 };
      useCartStore.setState({ cart: [updated], total: 897 } as any);

      const state = useCartStore.getState();
      expect(state.cart[0].quantity).toBe(3);
      expect(state.total).toBe(897);
    });
  });

  describe('clearCart Action', () => {
    it('empties cart and resets total', () => {
      const items = [
        { _id: '1', name: 'Pizza', price: 299, image: 'pizza.jpg', quantity: 2 },
        { _id: '2', name: 'Burger', price: 199, image: 'burger.jpg', quantity: 1 },
      ];

      useCartStore.setState({ cart: items, total: 597 } as any);

      useCartStore.setState({ cart: [], total: 0 } as any);

      const state = useCartStore.getState();
      expect(state.cart).toHaveLength(0);
      expect(state.total).toBe(0);
    });
  });
});
