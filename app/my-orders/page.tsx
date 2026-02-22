'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaBox, FaClock, FaCheckCircle, FaTruck, FaTimesCircle, FaArrowRight } from 'react-icons/fa';

interface Order {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  items: any[];
}

export default function MyOrders() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders');
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-600" />;
      case 'pending':
        return <FaClock className="text-blue-600" />;
      case 'shipped':
        return <FaTruck className="text-purple-600" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaBox className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'pending':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'shipped':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'cancelled':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
            <FaBox className="text-primary" /> My Orders
          </h1>
          <p className="text-gray-600">Track your delicious food deliveries</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card bg-gray-200 h-32 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 animate-slideInUp">
            <div className="text-7xl mb-4">📦</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</p>
            <p className="text-gray-600 mb-6 text-lg">Start ordering your favorite dishes today!</p>
            <Link href="/">
              <button className="btn-primary inline-block">
                Explore Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <Link
                key={order._id}
                href={`/order-confirmation/${order._id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-slideInUp"
              >
                <div
                  className="card bg-white hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Section - Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <p className="font-black text-lg text-gray-900">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                          <p className="text-gray-600 font-semibold mb-1">📅 Order Date</p>
                          <p className="font-bold text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold mb-1">🍽️ Items</p>
                          <p className="font-bold text-gray-900">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold mb-1">💵 Amount</p>
                          <p className="font-black text-primary text-lg">Rs.{order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item) => (
                          <span key={item._id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {item.foodId?.name || 'Item'} x{item.quantity}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-semibold">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Section - CTA */}
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-primary/10 to-red-600/10 rounded-lg p-4 text-center border-2 border-primary/20 group-hover:border-primary transition">
                        <p className="text-xs text-gray-600 mb-2 font-bold">View Details</p>
                        <div className="text-2xl group-hover:translate-x-1 transition transform">
                          <FaArrowRight className="text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {!loading && orders.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-gray-200 animate-slideInUp" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600">
                <p className="text-xs text-blue-700 font-bold mb-1">Total Orders</p>
                <p className="text-3xl font-black text-blue-600">{orders.length}</p>
              </div>
              <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600">
                <p className="text-xs text-green-700 font-bold mb-1">Delivered</p>
                <p className="text-3xl font-black text-green-600">{orders.filter((o) => o.orderStatus === 'delivered').length}</p>
              </div>
              <div className="card bg-gradient-to-br from-primary/10 to-red-600/10 border-l-4 border-primary">
                <p className="text-xs text-primary font-bold mb-1">Total Spent</p>
                <p className="text-3xl font-black text-primary">
                  Rs.{orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)}
                </p>
              </div>
              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-600">
                <p className="text-xs text-purple-700 font-bold mb-1">Pending</p>
                <p className="text-3xl font-black text-purple-600">
                  {orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
