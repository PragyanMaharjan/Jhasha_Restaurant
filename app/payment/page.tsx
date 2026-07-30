import { Suspense } from 'react';
import PaymentContent from './PaymentContent';

export default function PaymentPage() {
  return (
    <div className="container py-12">
      <Suspense
        fallback={
          <div className="container py-12">
            <div className="card bg-white max-w-md mx-auto text-center">Loading payment...</div>
          </div>
        }
      >
        <PaymentContent />
      </Suspense>
    </div>
  );
}
