'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import AdminSidebar from '@/components/AdminSidebar';
import { FaUsers, FaShoppingCart, FaBox, FaDollarSign, FaClock, FaTruck, FaUserTie, FaChartLine, FaArrowUp } from 'react-icons/fa';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders?: number;
  totalFoodItems?: number;
  totalEmployees?: number;
  todayRevenue?: number;
}

interface RecentOrder {
  _id: string;
  userId?: { name: string };
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const authStore = useAuthStore as unknown as () => import('@/lib/types').AuthState;
  const { isAuthenticated, user } = authStore();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalFoodItems: 0,
    totalEmployees: 3,
    todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get('/admin/stats');
      setStats({
        ...response.data,
        totalEmployees: 3,
        todayRevenue: response.data.totalRevenue * 0.15, // Mock today's revenue
      });

      // Fetch recent orders
      try {
        const ordersRes = await API.get('/admin/orders?limit=5');
        setRecentOrders(ordersRes.data.orders || []);
      } catch (err) {
        console.error('Failed to fetch recent orders');
      }

      // Fetch recent users
      try {
        const usersRes = await API.get('/admin/users?limit=5');
        setRecentUsers(usersRes.data.users || []);
      } catch (err) {
        console.error('Failed to fetch recent users');
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AdminSidebar />

      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
            <FaChartLine className="text-primary" /> Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Here&apos;s what&apos;s happening today.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="card bg-gray-200 h-32 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slideInUp">
              {/* Total Revenue */}
              <div className="card bg-gradient-to-br from-primary/10 to-red-600/10 border-l-4 border-primary hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-red-600 flex items-center justify-center">
                    <FaDollarSign size={24} className="text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                    <FaArrowUp size={12} /> 12%
                  </span>
                </div>
                <p className="text-gray-600 font-semibold text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-black text-gray-900">Rs.{stats.totalRevenue.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-2">Today: Rs.{stats.todayRevenue?.toFixed(0)}</p>
              </div>

              {/* Total Orders */}
              <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600 hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                    <FaShoppingCart size={24} className="text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                    <FaArrowUp size={12} /> 8%
                  </span>
                </div>
                <p className="text-gray-600 font-semibold text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-black text-green-600">{stats.totalOrders}</p>
                <p className="text-xs text-gray-500 mt-2">Delivered: {stats.deliveredOrders || 0}</p>
              </div>

              {/* Total Users */}
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600 hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <FaUsers size={24} className="text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                    <FaArrowUp size={12} /> 15%
                  </span>
                </div>
                <p className="text-gray-600 font-semibold text-sm mb-1">Total Users</p>
                <p className="text-3xl font-black text-blue-600">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-2">Active customers</p>
              </div>

              {/* Pending Orders */}
              <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-600 hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                    <FaClock size={24} className="text-white" />
                  </div>
                  {stats.pendingOrders > 5 && (
                    <span className="text-orange-600 text-sm font-bold animate-pulse">⚠️ High</span>
                  )}
                </div>
                <p className="text-gray-600 font-semibold text-sm mb-1">Pending Orders</p>
                <p className="text-3xl font-black text-orange-600">{stats.pendingOrders}</p>
                <p className="text-xs text-gray-500 mt-2">Needs attention</p>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
              {/* Food Items */}
              <div className="card bg-white hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FaBox size={28} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Food Items</p>
                    <p className="text-2xl font-black text-gray-900">{stats.totalFoodItems || 0}</p>
                  </div>
                </div>
              </div>

              {/* Employees */}
              <div className="card bg-white hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <FaUserTie size={28} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Employees</p>
                    <p className="text-2xl font-black text-gray-900">{stats.totalEmployees}</p>
                  </div>
                </div>
              </div>

              {/* Delivered */}
              <div className="card bg-white hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-green-100 flex items-center justify-center">
                    <FaTruck size={28} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Delivered</p>
                    <p className="text-2xl font-black text-gray-900">{stats.deliveredOrders || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="card bg-white animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <FaShoppingCart className="text-primary" /> Recent Orders
                  </h2>
                  <Link href="/admin/orders" className="text-primary font-semibold hover:text-red-600 text-sm">
                    View All →
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-4xl mb-2">📦</p>
                    <p>No recent orders</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">Order #{order._id.slice(-6)}</p>
                          <p className="text-xs text-gray-600">{order.userId?.name || 'Guest'}</p>
                        </div>
                        <div className="text-right mr-3">
                          <p className="font-black text-primary">Rs.{order.totalAmount.toFixed(0)}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString(
                              'en-IN',
                              { month: 'short', day: 'numeric' }
                            )}
                          </p>
                        </div>
                        <span
                          className={
                            `px-3 py-1 rounded-full text-xs font-bold ` +
                            getOrderStatusColor(order.orderStatus)
                          }>

                          {order.orderStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Users */}
              <div className="card bg-white animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <FaUsers className="text-primary" /> Recent Users
                  </h2>
                  <Link href="/admin/users" className="text-primary font-semibold hover:text-red-600 text-sm">
                    View All →
                  </Link>
                </div>

                {recentUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-4xl mb-2">👥</p>
                    <p>No recent users</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentUsers.slice(0, 5).map((user) => (
                      <div key={user._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-red-600/20 flex items-center justify-center border-2 border-primary/20">
                          <span className="text-lg">👤</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-xl font-black text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/admin/users">
                  <button className="w-full bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 text-blue-700 font-bold py-4 rounded-lg transition transform hover:scale-105 flex flex-col items-center gap-2">
                    <FaUsers size={24} />
                    <span>Manage Users</span>
                  </button>
                </Link>
                <Link href="/admin/orders">
                  <button className="w-full bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 text-green-700 font-bold py-4 rounded-lg transition transform hover:scale-105 flex flex-col items-center gap-2">
                    <FaShoppingCart size={24} />
                    <span>View Orders</span>
                  </button>
                </Link>
                <Link href="/admin/food">
                  <button className="w-full bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 text-purple-700 font-bold py-4 rounded-lg transition transform hover:scale-105 flex flex-col items-center gap-2">
                    <FaBox size={24} />
                    <span>Food Menu</span>
                  </button>
                </Link>
                <Link href="/admin/employees">
                  <button className="w-full bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-2 border-orange-200 text-orange-700 font-bold py-4 rounded-lg transition transform hover:scale-105 flex flex-col items-center gap-2">
                    <FaUserTie size={24} />
                    <span>Employees</span>
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
