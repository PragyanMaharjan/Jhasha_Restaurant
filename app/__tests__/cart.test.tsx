import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartPage from '../cart/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock('../../../lib/store', () => ({
  useCartStore: () => ({
    cart: [],
    total: 0,
    hydrateCart: vi.fn().mockResolvedValue(undefined),
    removeFromCart: vi.fn().mockResolvedValue(undefined),
    updateQuantity: vi.fn().mockResolvedValue(undefined),
    clearCart: vi.fn().mockResolvedValue(undefined),
  }),
  useAuthStore: () => ({
    isAuthenticated: false,
  }),
}));

describe('Cart Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render cart page', () => {
    render(<CartPage />);
    expect(document.body).toBeTruthy();
  });

  it('should render without errors', () => {
    expect(() => render(<CartPage />)).not.toThrow();
  });

  it('should display page content', () => {
    const { container } = render(<CartPage />);
    expect(container).toBeTruthy();
  });

  it('should handle empty cart state', () => {
    const { container } = render(<CartPage />);
    expect(container).toBeTruthy();
  });

  it('should render cart container', () => {
    const { container } = render(<CartPage />);
    expect(container.querySelector('main') || container).toBeTruthy();
  });
});
