import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCart } from '../useCart';
import { useCartStore } from '@/lib/store';
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('@/lib/store');
vi.mock('react-toastify');

describe('useCart Hook', () => {
  const mockAddToCart = vi.fn();
  const mockRemoveFromCart = vi.fn();
  const mockUpdateQuantity = vi.fn();
  const mockClearCart = vi.fn();

  const mockCart = [
    { _id: '1', name: 'Food 1', price: 100, quantity: 2 },
    { _id: '2', name: 'Food 2', price: 200, quantity: 1 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useCartStore as any).mockReturnValue({
      cart: mockCart,
      total: 400,
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart,
    });
  });

  it('returns cart state', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.cart).toEqual(mockCart);
    expect(result.current.total).toBe(400);
  });

  it('adds item to cart with success notification', () => {
    const { result } = renderHook(() => useCart());
    const food = { _id: '3', name: 'Food 3', price: 150, image: '', description: '', category: 'main' };

    act(() => {
      result.current.addToCart(food);
    });

    expect(mockAddToCart).toHaveBeenCalledWith(food);
    expect(toast.success).toHaveBeenCalledWith('Food 3 added to cart!');
  });

  it('removes item from cart with notification', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.removeFromCart('1', 'Food 1');
    });

    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
    expect(toast.info).toHaveBeenCalledWith('Food 1 removed from cart');
  });

  it('updates quantity within valid range', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.updateQuantity('1', 5);
    });

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 5);
  });

  it('shows error when quantity is less than 1', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.updateQuantity('1', 0);
    });

    expect(toast.error).toHaveBeenCalledWith('Quantity must be at least 1');
    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  it('shows error when quantity exceeds 50', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.updateQuantity('1', 51);
    });

    expect(toast.error).toHaveBeenCalledWith('Maximum quantity is 50');
    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  it('clears cart with confirmation', () => {
    global.confirm = vi.fn(() => true);
    const { result } = renderHook(() => useCart());

    act(() => {
      const cleared = result.current.clearCart();
      expect(cleared).toBe(true);
    });

    expect(mockClearCart).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Cart cleared');
  });

  it('does not clear cart when confirmation is cancelled', () => {
    global.confirm = vi.fn(() => false);
    const { result } = renderHook(() => useCart());

    act(() => {
      const cleared = result.current.clearCart();
      expect(cleared).toBe(false);
    });

    expect(mockClearCart).not.toHaveBeenCalled();
  });

  it('calculates total items correctly', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.getTotalItems()).toBe(3); // 2 + 1
  });

  it('checks if cart is empty', () => {
    (useCartStore as any).mockReturnValue({
      cart: [],
      total: 0,
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart,
    });

    const { result } = renderHook(() => useCart());

    expect(result.current.isEmpty()).toBe(true);
  });
});
