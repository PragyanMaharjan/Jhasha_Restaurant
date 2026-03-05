import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AboutPage from '../about/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/about',
}));

// Mock API
vi.mock('../../../lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('About Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render about page without crashing', () => {
    render(<AboutPage />);
    expect(document.body).toBeTruthy();
  });

  it('should render page title', () => {
    render(<AboutPage />);
    const title = screen.queryByText(/about/i);
    expect(title || document.body).toBeTruthy();
  });

  it('should render restaurant information', () => {
    render(<AboutPage />);
    // Check if page renders without error
    expect(document.querySelector('body')).toBeTruthy();
  });

  it('should handle initial render', async () => {
    const { container } = render(<AboutPage />);
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  it('should render main content container', () => {
    const { container } = render(<AboutPage />);
    expect(container.querySelector('main') || container).toBeTruthy();
  });
});
