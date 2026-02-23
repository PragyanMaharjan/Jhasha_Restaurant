'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserShield, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await API.post('/auth/login', formData);
      
      setToken(response.data.token);
      setUser(response.data.user);
      toast.success('🎉 Login successful!');
      
      if (response.data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary/20 to-gray-900 flex items-center justify-center py-12 px-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md z-10 animate-slideInUp">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Gradient */}
          <div className="bg-gradient-to-r from-primary to-red-600 p-8 text-center">
            <div className="text-5xl mb-3">🍽️</div>
            <h1 className="text-3xl font-black text-white mb-2">Jhasha</h1>
            <p className="text-white/90">Welcome Back</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Login Type Toggle */}
            <div className="mb-8">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLoginType('user')}
                  className={`flex-1 py-2 px-4 rounded-md font-bold text-sm transition flex items-center justify-center gap-2 ${
                    loginType === 'user'
                      ? 'bg-gradient-to-r from-primary to-red-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaUser /> Customer Login
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('admin')}
                  className={`flex-1 py-2 px-4 rounded-md font-bold text-sm transition flex items-center justify-center gap-2 ${
                    loginType === 'admin'
                      ? 'bg-gradient-to-r from-primary to-red-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaUserShield /> Admin Login
                </button>
              </div>
            </div>

            <p className="text-center text-gray-600 mb-8 text-sm">
              {loginType === 'admin' ? '🔐 Admin Portal Access' : 'Sign in to order your favorite dishes'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-4 text-primary text-lg" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-4 text-primary text-lg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-primary text-lg hover:text-red-600 transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-gray-700">Remember me</span>
                </label>
                {loginType === 'user' && (
                  <Link href="/forgot-password" className="text-primary font-semibold hover:text-red-600 transition">
                    Forgot?
                  </Link>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaSignInAlt />
                {loading ? 'Logging in...' : 'Login to Account'}
              </button>
            </form>

            {/* Register Section - Only for Customer Login */}
            {loginType === 'user' && (
              <>
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm bg-white px-2">
                    <span className="text-gray-500">New to Jhasha?</span>
                  </div>
                </div>

                {/* Register Link */}
                <Link href="/register">
                  <button
                    type="button"
                    className="w-full border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary/5 transition"
                  >
                    Create Account
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-600">
            By signing in, you agree to our Terms & Conditions
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-white/80">
          <span>🔒 Secure</span>
          <span>⚡ Fast</span>
          <span>✨ Trusted</span>
        </div>
      </div>
    </div>
  );
}
