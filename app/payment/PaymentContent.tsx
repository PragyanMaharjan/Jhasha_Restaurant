'use client';

import { useSearchParams } from 'next/navigation';
import PaymentClient from './PaymentClient';

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';

  return <PaymentClient orderId={orderId} />;
}
