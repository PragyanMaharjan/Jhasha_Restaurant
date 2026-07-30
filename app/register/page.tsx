'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getErrorMessage } from '@/lib/errorHandler';

export default function Register() {
  const router = useRouter();
  const { setUser: _setUser, setToken: _setToken } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [_profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('❌ Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      await API.post('/auth/register', payload);

      toast.success('🎉 Registration successful! Please login to continue.');
      router.push('/login');
    } catch (error: any) {
      toast.error(getErrorMessage(error, '❌ Unable to create your account. Please try again.'));
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
            <h1 className="text-3xl font-black text-white mb-2">Join Jhasha</h1>
            <p className="text-white/90">Create Your Account</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <p className="text-center text-gray-600 mb-8 text-sm">
              Get started to order delicious food today
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">Profile Picture (Optional)</label>
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-primary/20 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FaUser className="text-gray-400 text-3xl" />
                    )}
                  </div>
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-red-600 transition shadow-lg"
                  >
                    📷
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-4 text-primary text-lg" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
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

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-4 text-primary text-lg" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="+977-9812345678"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
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

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-4 text-primary text-lg" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-primary text-lg hover:text-red-600 transition"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input type="checkbox" required className="w-4 h-4 rounded border-gray-300" />
                <span>I agree to the <span className="font-semibold text-primary">Terms & Conditions</span></span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                <FaUserPlus />
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm bg-white px-2">
                <span className="text-gray-500">Already a member?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link href="/login">
              <button
                type="button"
                className="w-full border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary/5 transition"
              >
                Sign in Instead
              </button>
            </Link>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-600">
            Your data is safe and secure with us 🔒
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-white/80">
          <span>✅ Easy Setup</span>
          <span>🔒 Secure</span>
          <span>⚡ Instant Access</span>
        </div>
      </div>
    </div>
  );
}
