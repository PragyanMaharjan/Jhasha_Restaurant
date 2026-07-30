'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }

      try {
        const response = await API.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
        setStatus('success');
        setMessage(response.data?.message || 'Email verified successfully. You can now log in.');
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error?.response?.data?.message ||
            'Verification failed. The link may be expired or invalid.'
        );
      }
    };

    void verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary/20 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-red-600 p-8 text-center">
          <h1 className="text-3xl font-black text-white mb-2">Email Verification</h1>
          <p className="text-white/90">NepDeals account activation</p>
        </div>

        <div className="p-8 text-center space-y-4">
          {status === 'loading' && (
            <div className="text-gray-700">Please wait while we verify your email.</div>
          )}

          {status !== 'loading' && (
            <div
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                status === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          {status === 'success' ? (
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary to-red-600 text-white font-bold py-3 rounded-lg hover:from-primary/90 hover:to-red-600/90 transition"
            >
              Go to Login
            </Link>
          ) : status === 'error' ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary to-red-600 text-white font-bold py-3 rounded-lg hover:from-primary/90 hover:to-red-600/90 transition"
              >
                Back to Register
              </button>
              <Link href="/login" className="inline-block text-primary font-semibold hover:text-red-600">
                Already verified? Login
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}