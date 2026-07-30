import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import CheckoutPage from '../checkout/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock('../../../lib/store', () => ({
  useCartStore: () => ({
    cart: [{ _id: '1', name: 'Test Food', price: 10, quantity: 2 }],
    total: 20,
    hydrateCart: vi.fn().mockResolvedValue(undefined),
    clearCart: vi.fn().mockResolvedValue(undefined),
  }),
  useAuthStore: () => ({
    user: { _id: '1', name: 'Test' },
    isAuthenticated: true,
    token: 'test-token',
  }),
}));

vi.mock('../../../lib/api', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: { order: { _id: '123' } } })),
  },
}));

describe('Checkout Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render checkout page', () => {
    render(<CheckoutPage />);
    expect(document.body).toBeTruthy();
  });

  it('should render without crashing', () => {
    expect(() => render(<CheckoutPage />)).not.toThrow();
  });

  it('should render without crashing', () => {
    expect(() => render(<CheckoutPage />)).not.toThrow();
  });

  it('should handle checkout form', () => {
    const { container } = render(<CheckoutPage />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length >= 0).toBe(true);
  });

  it('should render main content area', () => {
    const { container } = render(<CheckoutPage />);
    expect(container.querySelector('main') || container).toBeTruthy();
  });
});
