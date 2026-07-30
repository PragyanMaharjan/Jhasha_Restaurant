'use client';

import { useSearchParams } from 'next/navigation';
import PaymentFailureClient from './client';

export default function FailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';

  return <PaymentFailureClient orderId={orderId} />;
}
