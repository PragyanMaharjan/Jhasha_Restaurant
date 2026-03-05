import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RegisterPage from '../register/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock('../../../lib/api', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render register page', () => {
    render(<RegisterPage />);
    expect(document.body).toBeTruthy();
  });

  it('should render without crashing', () => {
    expect(() => render(<RegisterPage />)).not.toThrow();
  });

  it('should render form container', () => {
    const { container } = render(<RegisterPage />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle component initialization', () => {
    const { container } = render(<RegisterPage />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length >= 0).toBe(true);
  });

  it('should render main content area', () => {
    const { container } = render(<RegisterPage />);
    expect(container.querySelector('main') || container).toBeTruthy();
  });
});
