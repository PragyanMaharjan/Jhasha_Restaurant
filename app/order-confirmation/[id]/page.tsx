'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getOrderById } from '@/lib/orders';
import Link from 'next/link';
import { FaCheckCircle, FaMapMarkerAlt, FaPhone, FaBox, FaClock } from 'react-icons/fa';

export default function OrderConfirmation() {
  const params = useParams();
  const _router = useRouter();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && orderId) {
      fetchOrder();
    }
  }, [mounted, orderId]);

  const fetchOrder = async () => {
    try {
      const orderResponse = await getOrderById(orderId);
      setOrder(orderResponse);
    } catch (error) {
      console.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl font-bold text-gray-700">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4">😔</div>
          <p className="text-2xl font-bold text-gray-800 mb-4">Order not found</p>
          <Link href="/" className="btn-primary inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container max-w-3xl">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-slideInUp">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            <FaCheckCircle size={80} className="relative mx-auto mb-4 text-green-600 animate-fadeIn" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">🎉 Order Confirmed!</h1>
          <p className="text-xl text-gray-600">Thank you for ordering from Jhasha Restaurant</p>
        </div>

        {/* Order Details Card */}
        <div className="card bg-white animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          {/* Order ID Banner */}
          <div className="bg-gradient-to-r from-primary to-red-600 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-xl">
            <p className="text-white/80 text-sm font-semibold mb-1">Order ID</p>
            <p className="text-white text-2xl font-black tracking-wide">#{order._id.slice(-8).toUpperCase()}</p>
          </div>

          {/* Order Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
              <p className="text-green-700 text-sm font-bold mb-2 flex items-center gap-2">
                <FaBox /> Total Amount
              </p>
              <p className="text-3xl font-black text-green-600">Rs.{order.totalAmount.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
              <p className="text-blue-700 text-sm font-bold mb-2 flex items-center gap-2">
                <FaClock /> Status
              </p>
              <p className="text-xl font-black text-blue-600 capitalize">{order.orderStatus}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200">
              <p className="text-purple-700 text-sm font-bold mb-2">Payment</p>
              <p className="text-xl font-black text-purple-600 capitalize">
                {order.paymentMethod === 'cash_on_delivery' ? '💵 COD' : '💳 Online'}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              🍽️ Ordered Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-4">
                    {item.foodId?.image && (
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={`http://localhost:5000/uploads/${item.foodId.image}`}
                          alt={item.foodId?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{item.foodId?.name || 'Item'}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-primary text-lg">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-6 border-2 border-gray-200">
            <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> Delivery Address
            </h3>
            <div className="space-y-2">
              <p className="text-gray-900 font-semibold">{order.deliveryAddress}</p>
              <p className="text-gray-700">{order.deliveryCity}, {order.deliveryZipCode}</p>
              <p className="text-gray-700 flex items-center gap-2 mt-3">
                <FaPhone className="text-primary" /> {order.phoneNumber}
              </p>
            </div>
          </div>

          {/* Special Instructions */}
          {order.notes && (
            <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl mb-6">
              <p className="text-yellow-800 font-bold mb-1">📝 Special Instructions</p>
              <p className="text-yellow-700">{order.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href="/">
              <button className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold py-3 rounded-lg transition transform hover:scale-105">
                🍽️ Continue Shopping
              </button>
            </Link>
            <Link href="/my-orders">
              <button className="w-full border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary/5 transition">
                📦 View All Orders
              </button>
            </Link>
          </div>

          {/* Footer Info */}
          <div className="text-center pt-6 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              📧 You&apos;ll receive a confirmation email shortly.
            </p>
            <p className="text-xs text-gray-500">
              Estimated delivery: 30-45 minutes
            </p>
          </div>
        </div>

        {/* Thank You Note */}
        <div className="text-center mt-8 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-md">
            <p className="text-lg font-bold text-gray-900">Thank you for choosing Jhasha! 🙏</p>
            <p className="text-sm text-gray-600">We&apos;re preparing your delicious meal with love ❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
}
