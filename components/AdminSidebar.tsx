'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { FaBox, FaUsers, FaClipboardList, FaHome, FaUserTie, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('👋 Logged out successfully');
      router.push('/login');
    }
  };

  const menuItems = [
    { href: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
    { href: '/admin/users', icon: FaUsers, label: 'Users' },
    { href: '/admin/employees', icon: FaUserTie, label: 'Employees' },
    { href: '/admin/food', icon: FaBox, label: 'Food Menu' },
    { href: '/admin/orders', icon: FaClipboardList, label: 'Orders' },
    { href: '/admin/about', icon: FaInfoCircle, label: 'About Us' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/admin/dashboard">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-4xl group-hover:scale-110 transition">🍽️</div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                Jhasha
              </h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-red-600 text-white shadow-lg'
                    : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                <Icon className={`text-xl ${isActive ? 'animate-pulse' : 'group-hover:scale-110 transition'}`} />
                <span className="font-bold">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-all font-bold group border-2 border-red-600/50 hover:border-red-600"
        >
          <FaSignOutAlt className="text-xl group-hover:translate-x-1 transition" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
