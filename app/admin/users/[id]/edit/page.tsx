'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import AdminSidebar from '@/components/AdminSidebar';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaMailBulk, FaSave } from 'react-icons/fa';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export default function EditUser() {
  const router = useRouter();
  const params = useParams();
  const userId = (params?.id as string) || '';
  const { isAuthenticated, user: authUser } = useAuthStore();
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || authUser?.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchUserDetails();
  }, [isAuthenticated, authUser, router, userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/admin/users/${userId}`);
      const user = response.data.user;
      
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
      });

      if (user.profileImage) {
        setImagePreview(`http://localhost:5000/${user.profileImage}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch user details');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
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

    try {
      setSubmitting(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('zipCode', formData.zipCode);
      
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      await API.put(`/admin/users/${userId}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('✅ User updated successfully');
      router.push(`/admin/users/${userId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || authUser?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <AdminSidebar />
        <div className="ml-64 flex-1 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AdminSidebar />

      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <Link href={`/admin/users/${userId}`}>
            <button className="flex items-center gap-2 text-primary hover:text-red-600 font-semibold mb-4 transition">
              <FaArrowLeft /> Back to User Details
            </button>
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Edit User</h1>
          <p className="text-gray-600">Update user information and profile</p>
        </div>

        {/* Form */}
        <div className="max-w-3xl animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="card bg-white">
            {/* Profile Image */}
            <div className="mb-8 pb-8 border-b-2 border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4">📸 Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-red-600/20 flex items-center justify-center overflow-hidden border-4 border-primary/20">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block mb-2">
                    <span className="btn-secondary cursor-pointer inline-block">
                      📷 Choose New Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </span>
                  </label>
                  <p className="text-sm text-gray-600">Recommended: Square image, at least 200x200px</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-8 pb-8 border-b-2 border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4">👤 Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Full Name *</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-4 text-primary" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Phone Number *</label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-4 text-primary" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8 pb-8 border-b-2 border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4">📧 Contact Information</h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Email Address *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-4 text-primary" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-8">
              <h3 className="text-xl font-black text-gray-900 mb-4">📍 Address Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Street Address</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-4 text-primary" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">City</label>
                    <div className="relative">
                      <FaCity className="absolute left-4 top-4 text-primary" />
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                        placeholder="New York"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Zip Code</label>
                    <div className="relative">
                      <FaMailBulk className="absolute left-4 top-4 text-primary" />
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold py-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaSave />
                {submitting ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
              <Link href={`/admin/users/${userId}`} className="flex-1">
                <button
                  type="button"
                  className="w-full border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-lg hover:border-primary hover:text-primary transition"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
