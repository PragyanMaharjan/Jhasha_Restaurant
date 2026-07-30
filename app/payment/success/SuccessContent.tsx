'use client';

import { useSearchParams } from 'next/navigation';
import PaymentSuccessClient from './client';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';

  return <PaymentSuccessClient orderId={orderId} />;
}
