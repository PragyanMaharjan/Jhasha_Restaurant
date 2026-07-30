import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading payment status...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
