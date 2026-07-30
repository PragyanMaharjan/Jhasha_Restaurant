import { Suspense } from 'react';
import FailureContent from './FailureContent';

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading...</div>}>
      <FailureContent />
    </Suspense>
  );
}
