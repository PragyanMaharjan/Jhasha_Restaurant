'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import AdminSidebar from '@/components/AdminSidebar';
import { toast } from 'react-toastify';
import { FaClock, FaPhone, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import { getErrorMessage } from '@/lib/errorHandler';

interface Delivery {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  status: string;
  totalAmount: number;
  estimatedDelivery: {
    minutes: number;
    time: string;
  };
  createdAt: string;
}

export default function ActiveDeliveries() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchActiveDeliveries();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchActiveDeliveries, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, router]);

  const fetchActiveDeliveries = async () => {
    try {
      const response = await API.get('/tracking/active-deliveries');
      setDeliveries(response.data.deliveries);
    } catch (error: any) {
      toast.error(getErrorMessage(error, '❌ Unable to load active deliveries. Please refresh the page.'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Confirmed': 'bg-blue-100 text-blue-700',
      'Preparing': 'bg-yellow-100 text-yellow-700',
      'Out for Delivery': 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: string } = {
      'Confirmed': '✅',
      'Preparing': '👨‍🍳',
      'Out for Delivery': '🚴'
    };
    return icons[status] || '📝';
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await API.put(`/tracking/order/${orderId}/status`, { status: newStatus });
      toast.success('✅ Order status updated');
      fetchActiveDeliveries();
    } catch (error: any) {
      toast.error(getErrorMessage(error, '❌ Unable to update delivery status. Please try again.'));
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">🚴 Active Deliveries</h1>
              <p className="text-gray-600">Real-time monitoring of all active orders</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary/20 to-red-600/20 px-6 py-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Active</p>
                <p className="text-3xl font-black text-primary">{deliveries.length}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : deliveries.length === 0 ? (
          <div className="card text-center py-16 animate-slideInUp">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Deliveries</h3>
            <p className="text-gray-600">All orders have been delivered or are pending confirmation</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {deliveries.map((delivery, index) => (
              <div
                key={delivery.id}
                className="card hover:shadow-2xl transition-all duration-300 animate-slideInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  {/* Status Icon */}
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-red-600/20 flex items-center justify-center text-4xl flex-shrink-0">
                    {getStatusIcon(delivery.status)}
                  </div>

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">{delivery.orderNumber}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className={
                              `px-3 py-1 rounded-full text-sm font-bold ` +
                              getStatusColor(delivery.status)
                            }>

                            {delivery.status}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <FaClock className="text-primary" />
                            <span className="ml-1">ETA: {delivery.estimatedDelivery.time}</span>
                            <span className="ml-2">({delivery.estimatedDelivery.minutes} mins)</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-black text-primary">Rs. {delivery.totalAmount}</p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Customer Name</p>
                        <p className="font-bold text-gray-900">👤 {delivery.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                        <a href={`tel:${delivery.customer.phone}`} className="font-bold text-primary hover:text-red-600 flex items-center gap-2">
                          <FaPhone /> {delivery.customer.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Order Time</p>
                        <p className="font-bold text-gray-900">
                          🕐 {new Date(delivery.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                      <FaMapMarkerAlt className="text-primary text-xl mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Delivery Address</p>
                        <p className="font-bold text-gray-900">{delivery.customer.address}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link href={`/admin/orders/${delivery.id}`} className="flex-1">
                        <button className="w-full btn-secondary flex items-center justify-center gap-2">
                          <FaEye /> View Details
                        </button>
                      </Link>

                      {delivery.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(delivery.id, 'Preparing')}
                          className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition"
                        >
                          👨‍🍳 Mark as Preparing
                        </button>
                      )}

                      {delivery.status === 'Preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(delivery.id, 'Out for Delivery')}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition"
                        >
                          🚴 Mark Out for Delivery
                        </button>
                      )}

                      {delivery.status === 'Out for Delivery' && (
                        <button
                          onClick={() => handleUpdateStatus(delivery.id, 'Delivered')}
                          className="flex-1 bg-gradient-to-r from-primary to-red-600 text-white font-bold py-3 rounded-lg hover:from-primary/90 hover:to-red-600/90 transition"
                        >
                          🎉 Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auto-refresh indicator */}
        <p className="text-center text-sm text-gray-500 mt-6">
          🔄 Auto-refreshing every 30 seconds for live updates
        </p>
      </div>
    </div>
  );
}
