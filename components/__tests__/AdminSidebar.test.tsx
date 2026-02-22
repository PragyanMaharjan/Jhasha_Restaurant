import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminSidebar from '../AdminSidebar';

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('AdminSidebar Component', () => {
  beforeEach(() => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/admin/dashboard');
  });

  it('renders all navigation links', () => {
    render(<AdminSidebar />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Food Items')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Active Deliveries')).toBeInTheDocument();
  });

  it('highlights active link', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/admin/orders');
    
    render(<AdminSidebar />);
    
    const ordersLink = screen.getByText('Orders').closest('a');
    expect(ordersLink).toHaveClass('bg-primary');
  });

  it('displays admin panel title', () => {
    render(<AdminSidebar />);
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('renders icons for each menu item', () => {
    const { container } = render(<AdminSidebar />);
    
    // Check that SVG icons are present
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});
