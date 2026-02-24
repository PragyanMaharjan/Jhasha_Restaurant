'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/lib/store';
import Link from 'next/link';
import API from '@/lib/api';
import { toast } from 'react-toastify';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';

export default function Cart() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    router.push('/checkout');
  };

  const deliveryFee = 50;
  const tax = (total * 0.05).toFixed(2);
  const grandTotal = (total + deliveryFee + parseFloat(tax)).toFixed(2);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-primary font-semibold mb-4 hover:text-red-600 transition"
          >
            <FaArrowLeft /> Back to Menu
          </button>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
            <FaShoppingBag className="text-primary" />
            Your Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 animate-slideInUp">
            <div className="text-7xl mb-4">🛒</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</p>
            <p className="text-gray-600 mb-6 text-lg">Add some delicious items to get started!</p>
            <Link href="/">
              <button className="btn-primary inline-block">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 animate-slideInUp">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {cart.length} Item{cart.length !== 1 ? 's' : ''} in Cart
              </h2>

              {cart.map((item, index) => (
                <div
                  key={item._id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="card bg-white hover:shadow-lg transition animate-slideInUp"
                >
                  <div className="flex items-center gap-4">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      <p className="font-bold text-primary text-lg">Rs.{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity === 1}
                          className="text-primary p-2 hover:bg-primary hover:text-white disabled:opacity-50 transition"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="px-4 font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="text-primary p-2 hover:bg-primary hover:text-white transition"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-24">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-black text-lg text-gray-900">
                          Rs.{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          removeFromCart(item._id);
                          toast.info('Item removed from cart');
                        }}
                        className="text-red-600 hover:bg-red-50 p-3 rounded-lg transition"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={() => {
                  clearCart();
                  toast.info('Cart cleared');
                }}
                className="text-red-600 font-semibold hover:text-red-700 transition mt-4"
              >
                Clear All Items
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
              <div className="card bg-white sticky top-24">
                <h3 className="text-2xl font-black mb-6 text-gray-900">Order Summary</h3>

                {/* Summary Details */}
                <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Subtotal</span>
                    <span className="font-black text-gray-900">Rs.{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Delivery Fee</span>
                    <span className="font-black text-gray-900">Rs.{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Tax (5%)</span>
                    <span className="font-black text-gray-900">Rs.{tax}</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="bg-gradient-to-r from-primary/10 to-red-600/10 rounded-xl p-4 mb-6 border-2 border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-lg text-gray-900">Grand Total</span>
                    <span className="font-black text-3xl bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                      Rs.{grandTotal}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold py-4 rounded-lg transition transform hover:scale-105 mb-3 flex items-center justify-center gap-2 text-lg"
                >
                  🚀 Proceed to Checkout
                </button>

                {/* Continue Shopping Button */}
                <button
                  onClick={() => router.push('/')}
                  className="w-full border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:border-primary hover:text-primary transition"
                >
                  Continue Shopping
                </button>

                {/* Info */}
                <div className="mt-6 text-xs text-gray-600 text-center space-y-1">
                  <p>✅ Free item on orders above Rs.1000</p>
                  <p>🚚 Lightning fast delivery available</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
