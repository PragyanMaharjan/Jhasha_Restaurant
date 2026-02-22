import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../useAuth';
import { useAuthStore } from '@/lib/store';

// Mock the store and router
vi.mock('@/lib/store');
vi.mock('next/navigation');

describe('useAuth Hook', () => {
  const mockPush = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const { useRouter } = require('next/navigation');
    useRouter.mockReturnValue({ push: mockPush });
  });

  it('returns authentication state', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'user' },
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ name: 'Test User', role: 'user' });
  });

  it('requireAuth returns true when authenticated', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'user' },
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.requireAuth()).toBe(true);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('requireAuth redirects to login when not authenticated', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.requireAuth()).toBe(false);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('requireAdmin returns true when user is admin', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Admin', role: 'admin' },
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.requireAdmin()).toBe(true);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('requireAdmin redirects when user is not admin', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'User', role: 'user' },
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.requireAdmin()).toBe(false);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('isAdmin returns correct value', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Admin', role: 'admin' },
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAdmin()).toBe(true);
  });

  it('exposes logout function', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'User', role: 'user' },
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(mockLogout).toHaveBeenCalled();
  });
});
