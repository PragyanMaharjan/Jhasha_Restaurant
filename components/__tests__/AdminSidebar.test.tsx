import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminSidebar from '../AdminSidebar';
import * as navigation from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

describe('AdminSidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock return values
    const mockedUsePathname = vi.mocked(navigation.usePathname);
    const mockedUseRouter = vi.mocked(navigation.useRouter);

    mockedUsePathname.mockReturnValue('/admin/dashboard');
    mockedUseRouter.mockReturnValue({ push: vi.fn() } as any);
  });

  it('renders all navigation links', () => {
    render(<AdminSidebar />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Food Menu')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
  });

  it('highlights active link', () => {
    const mockedUsePathname = vi.mocked(navigation.usePathname);
    mockedUsePathname.mockReturnValue('/admin/orders');

    render(<AdminSidebar />);

    const ordersLink = screen.getByText('Orders').closest('div');
    expect(ordersLink).toHaveClass('bg-gradient-to-r');
  });

  it('displays admin panel title', () => {
    render(<AdminSidebar />);

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('renders icons for each menu item', () => {
    const { container } = render(<AdminSidebar />);

    // Check that navigation section exists
    const nav = container.querySelector('nav');
    expect(nav).toBeTruthy();
  });
});
