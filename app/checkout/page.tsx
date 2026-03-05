'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaPhone, FaCreditCard, FaStickyNote, FaCheckCircle, FaTruck, FaFileInvoice } from 'react-icons/fa';
import { getErrorMessage } from '@/lib/errorHandler';

export default function Checkout() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { cart, total, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    deliveryCity: '',
    deliveryZipCode: '',
    phoneNumber: '+977 ',
    paymentMethod: 'online',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Don't redirect to cart if order was just placed
    if (cart.length === 0 && !orderPlaced) {
      router.push('/cart');
      return;
    }

    // Pre-fill user data
    if (user) {
      let userPhone = user.phone || '';
      // Add country code if not present
      if (userPhone && !userPhone.startsWith('+')) {
        userPhone = '+977 ' + userPhone.replace(/^\+977\s*/, '');
      } else if (userPhone && !userPhone.includes(' ')) {
        userPhone = userPhone.slice(0, 4) + ' ' + userPhone.slice(4);
      }
      
      setFormData((prev) => ({
        ...prev,
        deliveryAddress: user.address || '',
        deliveryCity: user.city || '',
        deliveryZipCode: user.zipCode || '',
        phoneNumber: userPhone || '+977 ',
      }));
    }
  }, [mounted, isAuthenticated, cart.length, user, router, orderPlaced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (): boolean => {
    const { deliveryAddress, deliveryCity, deliveryZipCode, phoneNumber } = formData;

    // Validate address length
    if (!deliveryAddress || deliveryAddress.trim().length < 10) {
      toast.error('❌ Address must be at least 10 characters long');
      return false;
    }
    if (deliveryAddress.trim().length > 200) {
      toast.error('❌ Address must not exceed 200 characters');
      return false;
    }

    // Validate city
    if (!deliveryCity || deliveryCity.trim().length < 2) {
      toast.error('❌ City name must be at least 2 characters');
      return false;
    }
    if (deliveryCity.trim().length > 50) {
      toast.error('❌ City name must not exceed 50 characters');
      return false;
    }

    // Validate zip code (4-10 digits only)
    const zipCodeRegex = /^[0-9]{4,10}$/;
    if (!deliveryZipCode || !zipCodeRegex.test(deliveryZipCode.trim())) {
      toast.error('❌ Zip code must be 4-10 digits');
      return false;
    }

    // Validate phone number
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber.trim())) {
      toast.error('❌ Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cart.map((item) => ({
          foodId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: parseFloat(grandTotal),
        deliveryAddress: formData.deliveryAddress.trim(),
        deliveryCity: formData.deliveryCity.trim(),
        deliveryZipCode: formData.deliveryZipCode.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim(),
      };

      const response = await API.post('/orders', orderData);
      const orderId = response.data.order._id;

      // Mark order as placed to prevent cart redirect
      setOrderPlaced(true);
      
      // Clear cart before redirect
      clearCart();
      
      // Show success message and redirect
      toast.success('✅ Order placed successfully!');
      router.push(`/order-confirmation/${orderId}`);
    } catch (error: any) {
      toast.error(getErrorMessage(error, '❌ Unable to place your order. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 50;
  const tax = (total * 0.05).toFixed(2);
  const grandTotal = (total + deliveryFee + parseFloat(tax)).toFixed(2);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (!isAuthenticated || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
            <FaFileInvoice className="text-primary" /> Checkout
          </h1>
          <p className="text-gray-600">Complete your order in a few simple steps</p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8 animate-slideInUp">
          <div className="flex items-center justify-between max-w-md">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-red-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <p className="text-xs text-gray-600 mt-1">Delivery</p>
            </div>
            <div className="flex-1 h-1 bg-primary mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-red-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <p className="text-xs text-gray-600 mt-1">Payment</p>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold">
                3
              </div>
              <p className="text-xs text-gray-600 mt-1">Confirm</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 animate-slideInUp">
            <div className="card bg-white">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Delivery Information */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaTruck className="text-primary" /> Delivery Information
                  </h2>

                  {/* Address */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Delivery Address * <span className="text-xs text-gray-500">(min 10 characters)</span></label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-4 text-primary text-lg" />
                      <input
                        type="text"
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        required
                        minLength={10}
                        maxLength={200}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter your complete delivery address with street and building details</p>
                  </div>

                  {/* City and Zip Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">City * <span className="text-xs text-gray-500">(min 2 characters)</span></label>
                      <input
                        type="text"
                        name="deliveryCity"
                        value={formData.deliveryCity}
                        onChange={handleChange}
                        required
                        minLength={2}
                        maxLength={50}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Zip Code * <span className="text-xs text-gray-500">(4-10 digits)</span></label>
                      <input
                        type="text"
                        name="deliveryZipCode"
                        value={formData.deliveryZipCode}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{4,10}"
                        maxLength={10}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                        placeholder="10001"
                      />
                      <p className="text-xs text-gray-500 mt-1">Numbers only</p>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Phone Number * <span className="text-xs text-gray-500">(+977 auto-filled)</span></label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-4 text-primary text-lg" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                        placeholder="+977 98765 43210"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Country code +977 is pre-filled. Enter your 10-digit phone number</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="border-t-2 border-gray-200 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaCreditCard className="text-primary" /> Payment Method
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="ml-3">
                        <span className="font-bold text-gray-900">💳 Card/Online Payment</span>
                        <p className="text-sm text-gray-600">Safe and secure payment</p>
                      </span>
                    </label>
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={formData.paymentMethod === 'cash_on_delivery'}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="ml-3">
                        <span className="font-bold text-gray-900">💵 Cash on Delivery</span>
                        <p className="text-sm text-gray-600">Pay with cash when order arrives</p>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="border-t-2 border-gray-200 pt-8">
                  <label className="flex text-sm font-bold text-gray-700 mb-3 items-center gap-2">
                    <FaStickyNote className="text-primary" /> Special Instructions (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white resize-none"
                    rows={4}
                    placeholder="e.g., No onions, extra spicy, etc..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold py-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-8"
                >
                  <FaCheckCircle />
                  {loading ? '⏳ Processing...' : '🚀 ' + (formData.paymentMethod === 'online' ? 'Proceed to Payment' : 'Place Order')}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <div className="card bg-white sticky top-24">
              <h3 className="text-2xl font-black mb-6 text-gray-900">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-2 mb-6 pb-6 border-b-2 border-gray-200 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-start text-sm">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">x {item.quantity}</p>
                    </div>
                    <span className="font-bold text-primary">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Subtotal</span>
                  <span className="font-bold text-gray-900">Rs.{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">🚚 Delivery Fee</span>
                  <span className="font-bold text-gray-900">Rs.{deliveryFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Tax (5%)</span>
                  <span className="font-bold text-gray-900">Rs.{tax}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-gradient-to-r from-primary/10 to-red-600/10 rounded-xl p-4 border-2 border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-black text-lg text-gray-900">Grand Total</span>
                  <span className="font-black text-3xl bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                    Rs.{grandTotal}
                  </span>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                <p className="text-xs font-bold text-blue-900">ℹ️ Order Placed</p>
                <p className="text-xs text-blue-700 mt-1">You'll receive a confirmation email shortly.</p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex justify-center gap-3 text-xs text-gray-600">
                <span>✅ Secure</span>
                <span>|</span>
                <span>🔐 Encrypted</span>
                <span>|</span>
                <span>📦 Insured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
