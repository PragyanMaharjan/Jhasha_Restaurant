'use client';

import { useState } from 'react';
import API from '@/lib/api';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { getErrorMessage } from '@/lib/errorHandler';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('Sending forgot password request for:', email);
      console.log('API endpoint:', '/auth/forgot-password');
      
      const response = await API.post('/auth/forgot-password', { email });
      
      console.log('Forgot password response:', response.data);
      
      setEmailSent(true);
      toast.success('✅ Password reset email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Forgot password error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`
      });
      
      toast.error(getErrorMessage(error, '❌ Unable to send reset email. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <div className="card bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {emailSent ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 mb-4">
              Check your email for password reset instructions. The link will expire in 30 minutes.
            </p>
            <Link href="/login" className="btn-primary">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="your@email.com"
              />
              <p className="text-sm text-gray-600 mt-2">
                Enter your registered email and we'll send you a link to reset your password
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mb-4"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center text-sm text-gray-600">
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
