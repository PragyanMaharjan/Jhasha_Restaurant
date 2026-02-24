'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getErrorMessage } from '@/lib/errorHandler';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    try {
      setLoading(true);

      const clientSecret = localStorage.getItem('clientSecret');
      const orderId = localStorage.getItem('orderId');

      if (!clientSecret) {
        toast.error('❌ Payment session expired. Please try again.');
        return;
      }

      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
        },
      });

      if (error) {
        toast.error(`❌ ${error.message || 'Payment was declined. Please check your card details.'}`);
      } else if (paymentIntent?.status === 'succeeded') {
        // Update order status
        await API.put(`/orders/${orderId}/status`, {
          orderStatus: 'confirmed',
          paymentStatus: 'completed',
        });

        clearCart();
        localStorage.removeItem('clientSecret');
        localStorage.removeItem('orderId');

        toast.success('Payment successful!');
        router.push(`/order-confirmation/${orderId}`);
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error, '❌ Payment processing failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

      <div className="mb-6 p-4 border border-gray-300 rounded">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      <button type="submit" disabled={!stripe || loading} className="btn-primary w-full">
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function Payment() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-12">
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
}
