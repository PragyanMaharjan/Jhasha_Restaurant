'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';
import { toast } from 'react-toastify';
import { FaLock, FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || null;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('❌ Invalid reset link');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('❌ Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('❌ Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await API.post('/auth/reset-password', {
        resetToken: token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setResetSuccess(true);
      toast.success('✅ Password reset successful!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full animate-slideInUp">
          <div className="card bg-white text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-red-600 text-4xl" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Invalid Link</h2>
              <p className="text-gray-600">
                This password reset link is invalid or has expired.
              </p>
            </div>

            <Link href="/forgot-password">
              <button className="w-full btn-primary mb-3">
                Request New Link
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full btn-secondary flex items-center justify-center gap-2">
                <FaArrowLeft /> Back to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full animate-slideInUp">
          <div className="card bg-white text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <FaCheckCircle className="text-green-600 text-4xl" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Password Reset!</h2>
              <p className="text-gray-600 mb-4">
                Your password has been successfully reset.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </div>

            <Link href="/login">
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                Go to Login →
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full animate-slideInUp">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <div className="card bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-primary text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-primary transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-primary text-lg" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-primary transition"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className={`text-sm font-semibold ${
                formData.newPassword === formData.confirmPassword
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {formData.newPassword === formData.confirmPassword
                  ? '✓ Passwords match'
                  : '✗ Passwords do not match'}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? '⏳ Resetting...' : '🔐 Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login">
              <button className="text-primary hover:text-red-600 font-semibold flex items-center justify-center gap-2 mx-auto transition">
                <FaArrowLeft /> Back to Login
              </button>
            </Link>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <p className="text-xs font-bold text-blue-900 mb-1">🔒 Security Tips</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Use a strong, unique password</li>
            <li>• Don't reuse passwords from other sites</li>
            <li>• Consider using a password manager</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
