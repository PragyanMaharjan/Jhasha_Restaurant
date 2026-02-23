'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { AuthState } from '@/lib/types';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaClock, FaMapMarkerAlt, FaPhone, FaCheckCircle } from 'react-icons/fa';

interface OrderItem {
  foodId: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

interface TimelineItem {
  status: string;
  icon: string;
  label: string;
  completed: boolean;
  timestamp: string | null;
  notes: string | null;
}

interface Tracking {
  currentStatus: string;
  estimatedDelivery: {
    minutes: number;
    time: string;
  } | string;
  timeline: TimelineItem[];
  driver: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  } | null;
  statusPercentage: number;
}

export default function OrderTracking() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id ?? '') as string;
  const authStore = useAuthStore as unknown as () => AuthState;
  const { isAuthenticated } = authStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchOrderTracking();

    // Set up auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchOrderTracking, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, orderId, router]);

  const fetchOrderTracking = async () => {
    try {
      const response = await API.get(`/tracking/order/${orderId}`);
      setOrder(response.data.order);
      setTracking(response.data.tracking);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch order tracking');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!order || !tracking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <Link href="/orders">
            <button className="flex items-center gap-2 text-primary hover:text-red-600 font-semibold mb-4 transition">
              <FaArrowLeft /> Back to My Orders
            </button>
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-2">🚴 Order Tracking</h1>
          <p className="text-gray-600">Order {order.orderNumber}</p>
        </div>

        {/* Status Overview Card */}
        <div className="card bg-gradient-to-br from-primary/10 to-red-600/10 mb-8 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                {tracking.currentStatus}
              </h2>
              {typeof tracking.estimatedDelivery !== 'string' && (
                <div className="flex items-center gap-2 text-lg text-gray-700">
                  <FaClock className="text-primary" />
                  <span>Estimated arrival: <strong>{tracking.estimatedDelivery.time}</strong> ({tracking.estimatedDelivery.minutes} mins)</span>
                </div>
              )}
              {typeof tracking.estimatedDelivery === 'string' && (
                <p className="text-lg text-primary font-bold">{tracking.estimatedDelivery}</p>
              )}
            </div>
            <div className="text-5xl">
              {tracking.currentStatus === 'Delivered' ? '🎉' : 
               tracking.currentStatus === 'Out for Delivery' ? '🚴' : 
               tracking.currentStatus === 'Preparing' ? '👨‍🍳' : 
               tracking.currentStatus === 'Confirmed' ? '✅' : '📝'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-red-600 rounded-full transition-all duration-1000"
              style={{ width: `${tracking.statusPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-right">{tracking.statusPercentage}% Complete</p>
        </div>

        {/* Driver Info Card */}
        {tracking.driver && (
          <div className="card mb-8 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-black text-gray-900 mb-4">🚴 Your Delivery Partner</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-red-600/20 rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900">{tracking.driver.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>⭐ {tracking.driver.rating}/5</span>
                  <span>🏍️ {tracking.driver.vehicle}</span>
                </div>
              </div>
              <a href={`tel:${tracking.driver.phone}`} className="btn-secondary flex items-center gap-2">
                <FaPhone /> Call Driver
              </a>
            </div>
          </div>
        )}

        {/* Order Timeline */}
        <div className="card mb-8 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-black text-gray-900 mb-6">📍 Order Timeline</h3>
          <div className="space-y-6">
            {tracking.timeline.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    item.completed 
                      ? 'bg-gradient-to-br from-primary to-red-600 text-white shadow-lg' 
                      : 'bg-gray-200'
                  }`}>
                    {item.completed ? <FaCheckCircle /> : item.icon}
                  </div>
                  {index < tracking.timeline.length - 1 && (
                    <div className={`absolute top-12 left-6 w-0.5 h-12 ${
                      item.completed ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h4 className={`font-bold text-lg ${item.completed ? 'text-primary' : 'text-gray-400'}`}>
                    {item.label}
                  </h4>
                  {item.timestamp && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatTime(item.timestamp)} • {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-sm text-gray-700 mt-2 italic">"{item.notes}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="card mb-8 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-black text-gray-900 mb-6">🍽️ Order Items</h3>
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={`http://localhost:5000/${item.foodId.image}`}
                  alt={item.foodId.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{item.foodId.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold text-primary">Rs. {item.price}</p>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-gray-200 pt-4">
            <div className="flex justify-between text-xl font-black">
              <span>Total Amount</span>
              <span className="text-primary">Rs. {order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="card animate-slideInUp" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-xl font-black text-gray-900 mb-6">📦 Delivery Details</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-primary text-xl mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                <p className="font-bold text-gray-900">{order.deliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaPhone className="text-primary text-xl mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Contact Number</p>
                <p className="font-bold text-gray-900">{order.customer.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <p className="text-center text-sm text-gray-500 mt-6">
          🔄 Auto-refreshing every 30 seconds for live updates
        </p>
      </div>
    </div>
  );
}
