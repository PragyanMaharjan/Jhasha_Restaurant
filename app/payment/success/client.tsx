'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { verifyPaymentStatus } from '@/lib/payments';

interface PaymentSuccessClientProps {
  orderId: string;
}

export default function PaymentSuccessClient({ orderId }: PaymentSuccessClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  const verify = useMemo(
    () => async () => {
      if (!orderId) {
        setStatus('error');
        setMessage('No order was provided for payment verification.');
        return;
      }

      try {
        const result = await verifyPaymentStatus(orderId);
        if (result?.paymentStatus === 'completed' || result?.orderStatus === 'confirmed') {
          setStatus('success');
          setMessage('Your payment was confirmed and your order is now being prepared.');
          return;
        }

        setStatus('pending');
        setMessage('Your payment is still being processed. Please wait a moment and try again.');
      } catch (error) {
        setStatus('error');
        setMessage('We could not verify your payment status right now.');
        toast.error('Payment verification failed.');
      }
    },
    [orderId]
  );

  useEffect(() => {
    void verify();
  }, [verify]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container max-w-xl">
        <div className="card bg-white text-center">
          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Successful</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link href={`/order-confirmation/${orderId}`} className="btn-primary inline-block">
                View Order Details
              </Link>
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="text-6xl mb-4">⏳</div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Still Verifying</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <button onClick={() => void verify()} className="btn-primary">
                Check Again
              </button>
            </>
          )}

          {(status === 'loading' || status === 'error') && (
            <>
              <div className="text-6xl mb-4">{status === 'loading' ? '⏳' : '⚠️'}</div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">
                {status === 'loading' ? 'Confirming Payment' : 'Verification Issue'}
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => void verify()} className="btn-primary">
                  Try Again
                </button>
                <button onClick={() => router.push('/my-orders')} className="border border-primary text-primary px-4 py-2 rounded-lg">
                  View Orders
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
