import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../Navbar';
import { useAuthStore, useCartStore } from '@/lib/store';

// Mock the stores
vi.mock('@/lib/store', () => ({
  useAuthStore: vi.fn(),
  useCartStore: vi.fn(),
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logo and brand name', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
    (useCartStore as any).mockReturnValue({
      cart: [],
    });

    render(<Navbar />);
    
    expect(screen.getByText('Jhasha')).toBeInTheDocument();
    expect(screen.getByText('Restro')).toBeInTheDocument();
  });

  it('shows login and register buttons when not authenticated', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
    (useCartStore as any).mockReturnValue({
      cart: [],
    });

    render(<Navbar />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('shows user menu when authenticated', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'user' },
      logout: vi.fn(),
    });
    (useCartStore as any).mockReturnValue({
      cart: [],
    });

    render(<Navbar />);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('shows admin link when user is admin', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Admin User', role: 'admin' },
      logout: vi.fn(),
    });
    (useCartStore as any).mockReturnValue({
      cart: [],
    });

    render(<Navbar />);
    
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('displays cart item count', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
    (useCartStore as any).mockReturnValue({
      cart: [
        { _id: '1', quantity: 2 },
        { _id: '2', quantity: 1 },
      ],
    });

    render(<Navbar />);
    
    const cartBadge = screen.getByText('3');
    expect(cartBadge).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    const mockLogout = vi.fn();
    global.confirm = vi.fn(() => true);

    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'user' },
      logout: mockLogout,
    });
    (useCartStore as any).mockReturnValue({
      cart: [],
    });

    render(<Navbar />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });
});
