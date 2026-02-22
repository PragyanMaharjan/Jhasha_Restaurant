'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore } from '@/lib/store';
import { FaShoppingCart, FaSignOutAlt, FaUser, FaHome } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      setMobileMenuOpen(false);
      router.push('/');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-dark via-dark to-gray-900 text-white shadow-2xl border-b-4 border-primary">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-3xl transform group-hover:scale-110 transition duration-300">🍽️</div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Jhasha
              </span>
              <span className="text-xs font-semibold text-gray-400">Restro</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-8 items-center">
            <Link href="/" className="hover:text-primary transition duration-300 flex items-center gap-2 font-medium">
              <FaHome size={18} /> Menu
            </Link>

            {isHydrated && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="hover:text-primary transition duration-300 flex items-center gap-2 font-medium"
                    >
                      <FaUser /> Profile
                    </Link>
                    <Link href="/my-orders" className="hover:text-primary transition duration-300 font-medium">
                      Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link href="/admin/dashboard" className="hover:text-primary transition duration-300 font-medium">
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="hover:text-primary transition duration-300 flex items-center gap-2 font-medium"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn-primary">
                      Login
                    </Link>
                    <Link href="/register" className="btn-secondary">
                      Register
                    </Link>
                  </>
                )}
              </>
            )}

            <Link href="/cart" className="relative hover:scale-110 transition duration-300">
              <FaShoppingCart size={24} className="text-secondary" />
              {isHydrated && cart.length > 0 && (
                <span className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <Link href="/cart" className="relative">
              <FaShoppingCart size={24} className="text-secondary hover:scale-110 transition" />
              {isHydrated && cart.length > 0 && (
                <span className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl hover:text-primary transition"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isHydrated && (
          <div className="lg:hidden pb-4 border-t border-gray-700 pt-4 animate-slideInUp">
            <div className="flex flex-col gap-3">
              <Link href="/" className="hover:text-primary transition font-medium px-2">
                Menu
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="hover:text-primary transition font-medium px-2">
                    Profile
                  </Link>
                  <Link href="/my-orders" className="hover:text-primary transition font-medium px-2">
                    Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin/dashboard" className="hover:text-primary transition font-medium px-2">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="hover:text-primary transition font-medium px-2 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-primary text-center">
                    Login
                  </Link>
                  <Link href="/register" className="btn-secondary text-center">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
