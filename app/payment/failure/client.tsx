'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyPaymentStatus } from '@/lib/payments';
import { toast } from 'react-toastify';

interface PaymentFailureClientProps {
  orderId: string;
}

export default function PaymentFailureClient({ orderId }: PaymentFailureClientProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const handleCheck = async () => {
    if (!orderId) {
      toast.error('No order id was supplied for verification.');
      return;
    }

    try {
      setChecking(true);
      const result = await verifyPaymentStatus(orderId);
      if (result?.paymentStatus === 'completed' || result?.orderStatus === 'confirmed') {
        router.push(`/payment/success?orderId=${orderId}`);
      } else {
        toast.error('The payment could not be completed. Please try again.');
      }
    } catch (error) {
      toast.error('Could not verify the payment state.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container max-w-xl">
        <div className="card bg-white text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            Your payment could not be completed. You can try again or review the order status.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={handleCheck} disabled={checking} className="btn-primary">
              {checking ? 'Checking...' : 'Check Order Status'}
            </button>
            <Link href="/checkout" className="border border-primary text-primary px-4 py-2 rounded-lg">
              Return to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
