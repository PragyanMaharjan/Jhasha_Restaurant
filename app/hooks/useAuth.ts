import { useAuthStore } from '@/lib/store';
import type { AuthState } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Custom hook for authentication and authorization
 * Provides methods to check auth status and redirect if needed
 * @returns {Object} Authentication utilities and user data
 */
export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore as unknown as () => AuthState;
  const { isAuthenticated, user, logout } = authStore();

  /**
   * Require user to be authenticated
   * Redirects to login page if not authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      router.push('/login');
      return false;
    }
    return true;
  };

  /**
   * Require user to be admin
   * Redirects to home if not admin or not authenticated
   * @returns {boolean} True if user is admin, false otherwise
   */
  const requireAdmin = (): boolean => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return false;
    }
    return true;
  };

  /**
   * Check if current user is admin
   * @returns {boolean} True if user is admin
   */
  const isAdmin = (): boolean => {
    return isAuthenticated && user?.role === 'admin';
  };

  return {
    isAuthenticated,
    user,
    requireAuth,
    requireAdmin,
    isAdmin,
    logout
  };
}

/**
 * Hook to protect routes that require authentication
 * Automatically redirects if not authenticated
 * @param {boolean} adminOnly - If true, requires admin role
 */
export function useProtectedRoute(adminOnly: boolean = false) {
  const { requireAuth, requireAdmin } = useAuth();

  useEffect(() => {
    if (adminOnly) {
      requireAdmin();
    } else {
      requireAuth();
    }
  }, [adminOnly, requireAuth, requireAdmin]);
}
