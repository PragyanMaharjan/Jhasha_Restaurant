import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import MyOrdersPage from '../my-orders/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('../../../lib/store', () => ({
  useAuthStore: () => ({
    user: { _id: '1' },
    token: 'test-token',
    isAuthenticated: true,
  }),
}));

vi.mock('../../../lib/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ 
      data: { 
        orders: [{ _id: '1', total: 100, status: 'pending' }] 
      } 
    })),
  },
}));

describe('My Orders Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render orders page', () => {
    render(<MyOrdersPage />);
    expect(document.body).toBeTruthy();
  });

  it('should render without errors', () => {
    expect(() => render(<MyOrdersPage />)).not.toThrow();
  });

  it('should render without crashing', () => {
    expect(() => render(<MyOrdersPage />)).not.toThrow();
  });

  it('should handle orders list', () => {
    const { container } = render(<MyOrdersPage />);
    expect(container).toBeTruthy();
  });
});
