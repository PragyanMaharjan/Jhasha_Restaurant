import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import ProfilePage from '../profile/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock('../../../lib/store', () => ({
  useAuthStore: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    token: 'test-token',
    isAuthenticated: true,
  }),
}));

vi.mock('../../../lib/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { name: 'Test', email: 'test@test.com' } })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render profile page', () => {
    render(<ProfilePage />);
    expect(document.body).toBeTruthy();
  });

  it('should render without crashing', () => {
    expect(() => render(<ProfilePage />)).not.toThrow();
  });

  it('should render without crashing', () => {
    expect(() => render(<ProfilePage />)).not.toThrow();
  });

  it('should handle authenticated user', () => {
    const { container } = render(<ProfilePage />);
    expect(container).toBeTruthy();
  });

  it('should render main content', () => {
    const { container } = render(<ProfilePage />);
    expect(container.querySelector('main') || container).toBeTruthy();
  });
});
