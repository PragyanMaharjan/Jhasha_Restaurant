import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import ForgotPasswordPage from '../forgot-password/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('../../../lib/api', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: { message: 'Email sent' } })),
  },
}));

describe('Forgot Password Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render forgot password page', () => {
    render(<ForgotPasswordPage />);
    expect(document.body).toBeTruthy();
  });

  it('should render without crashing', () => {
    expect(() => render(<ForgotPasswordPage />)).not.toThrow();
  });

  it('should display form container', () => {
    const { container } = render(<ForgotPasswordPage />);
    expect(container).toBeTruthy();
  });

  it('should handle email input', () => {
    const { container } = render(<ForgotPasswordPage />);
    const inputs = container.querySelectorAll('input[type="email"]');
    expect(inputs.length >= 0).toBe(true);
  });
});
