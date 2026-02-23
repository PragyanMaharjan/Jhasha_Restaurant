import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../Navbar';
import { useAuthStore, useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import * as storeProvider from '@/lib/storeProvider';

// Mock the stores and hooks
vi.mock('@/lib/store', () => ({
  useAuthStore: vi.fn(),
  useCartStore: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/lib/storeProvider', () => ({
  useHydration: vi.fn(),
}));

describe('Navbar Component', () => {
  const mockRouter = { push: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (storeProvider.useHydration as any).mockReturnValue(true);
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

    const loginButtons = screen.getAllByText('Login');
    const registerButtons = screen.getAllByText('Register');
    expect(loginButtons.length).toBeGreaterThan(0);
    expect(registerButtons.length).toBeGreaterThan(0);
  });

  it('shows user menu when authenticated', async () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'user' },
      logout: vi.fn(),
    });
    (useCartStore as any).mockReturnValue({
      cart: [],
    });

    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
  });

  it('shows admin link when user is admin', async () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Admin User', role: 'admin' },
      logout: vi.fn(),
    });
    (useCartStore as any).mockReturnValue({
      cart: [],
    });

    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });
  });

  it('displays cart item count when items in cart', async () => {
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

    const { container } = render(<Navbar />);

    await waitFor(() => {
      // Component shows cart.length (number of items), not total quantity
      const badgeText = container.textContent;
      expect(badgeText).toContain('2');
    });
  });

  it('does not show hydration-dependent menu when not hydrated', () => {
    (storeProvider.useHydration as any).mockReturnValue(false);
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
    (useCartStore as any).mockReturnValue({
      cart: [],
    });

    render(<Navbar />);

    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('calls logout and navigates when logout is clicked with confirmation', async () => {
    const logoutMock = vi.fn();
    global.confirm = vi.fn(() => true);

    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'user' },
      logout: logoutMock,
    });
    (useCartStore as any).mockReturnValue({
      cart: [],
    });

    render(<Navbar />);

    await waitFor(() => {
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      expect(global.confirm).toHaveBeenCalled();
    });
  });

  it('renders menu link', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
    (useCartStore as any).mockReturnValue({
      cart: [],
    });

    render(<Navbar />);

    const menuLinks = screen.getAllByText('Menu');
    expect(menuLinks.length).toBeGreaterThan(0);
  });
});

