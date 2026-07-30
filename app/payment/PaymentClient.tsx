'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore } from '@/lib/store';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/lib/errorHandler';
import { initiateEsewaPayment } from '@/lib/payments';

interface PaymentClientProps {
  orderId: string;
}

function PaymentForm({ orderId }: { orderId: string }) {
  const _router = useRouter();
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await initiateEsewaPayment(orderId);
      const esewaUrl = response?.esewaUrl || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
      const formData = response?.formData || {};

      if (!response?.formData) {
        throw new Error('The payment gateway did not return a form payload.');
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = esewaUrl;
      form.target = '_self';

      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value ?? '');
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      clearCart();
      toast.success('Redirecting to eSewa...');
    } catch (error: unknown) {
      const message = getErrorMessage(error, '❌ Unable to start eSewa payment. Please try again.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
      <p className="text-sm text-gray-600 mb-6">
        You will be redirected to eSewa to complete the payment for your order.
      </p>
      {error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Redirecting...' : 'Pay with eSewa'}
      </button>
    </form>
  );
}

export default function PaymentClient({ orderId }: PaymentClientProps) {
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

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!orderId) {
    return (
      <div className="container py-12">
        <div className="card bg-white max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Missing Order</h2>
          <p className="text-gray-600">
            Your order id was not found. Please return to checkout and try again.
          </p>
        </div>
      </div>
    );
  }

  return <PaymentForm orderId={orderId} />;
}
