'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import AdminSidebar from '@/components/AdminSidebar';
import { toast } from 'react-toastify';
import {  FaArrowLeft, FaEnvelope, FaPhone, FaCalendarAlt, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaShoppingBag, FaCheckCircle, FaTimes
} from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  address: string;
  city: string;
  zipCode: string;
  isActive: boolean;
  createdAt: string;
  role: string;
}

export default function UserDetail() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const { isAuthenticated, user: authUser } = useAuthStore();
  
  const [user, setUser] = useState<User | null>(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      setUser(response.data.user);
      setOrdersCount(response.data.ordersCount);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch user details');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async () => {
    if (!user) return;

    try {
      await API.put('/admin/users/status', {
        userId: user._id,
        isActive: !user.isActive,
      });
      toast.success(`✅ User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUserDetails();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async () => {
    if (!user) return;

    try {
      await API.delete(`/admin/users/${user._id}`);
      toast.success('🗑️ User deleted successfully');
      router.push('/admin/users');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
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
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AdminSidebar />

      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <Link href="/admin/users">
            <button className="flex items-center gap-2 text-primary hover:text-red-600 font-semibold mb-4 transition">
              <FaArrowLeft /> Back to Users
            </button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">User Details</h1>
              <p className="text-gray-600">View and manage user information</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/users/${userId}/edit`}>
                <button className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 px-6 py-3 rounded-lg font-bold transition flex items-center gap-2">
                  <FaEdit /> Edit User
                </button>
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-100 text-red-600 hover:bg-red-200 px-6 py-3 rounded-lg font-bold transition flex items-center gap-2"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 card bg-white animate-slideInUp">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8 pb-6 border-b-2 border-gray-100">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-red-600/20 flex items-center justify-center overflow-hidden border-4 border-primary/20">
                {user.profileImage ? (
                  <img
                    src={`http://localhost:5000/${user.profileImage}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-primary">👤</span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-gray-900 mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-2">Customer ID: {user._id.slice(-8).toUpperCase()}</p>
                <button
                  onClick={toggleUserStatus}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition ${
                    user.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {user.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                  {user.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-xl font-black text-gray-900 mb-4">📧 Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-primary" /> Email
                  </p>
                  <p className="text-gray-900 font-semibold break-all">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2 flex items-center gap-2">
                    <FaPhone className="text-primary" /> Phone
                  </p>
                  <p className="text-gray-900 font-semibold">{user.phone}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-8">
              <h3 className="text-xl font-black text-gray-900 mb-4">📍 Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {user.address || user.city || user.zipCode ? (
                  <>
                    {user.address && <p className="text-gray-900 font-semibold mb-1">{user.address}</p>}
                    {user.city && user.zipCode && (
                      <p className="text-gray-600">{user.city}, {user.zipCode}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 italic">No address provided</p>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-4">ℹ️ Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2 flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" /> Member Since
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Account Status</p>
                  <p className={`font-bold ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {user.isActive ? '✅ Active' : '❌ Inactive'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            {/* Total Orders */}
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600">
              <div className="flex items-center justify-between mb-2">
                <FaShoppingBag className="text-blue-600 text-3xl" />
                <p className="text-4xl font-black text-blue-600">{ordersCount}</p>
              </div>
              <p className="text-blue-700 font-bold">Total Orders</p>
            </div>

            {/* Quick Actions */}
            <div className="card bg-white">
              <h3 className="text-lg font-black text-gray-900 mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                <Link href={`/admin/users/${userId}/edit`}>
                  <button className="w-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2">
                    <FaEdit /> Edit Information
                  </button>
                </Link>
                <button
                  onClick={toggleUserStatus}
                  className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                    user.isActive
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {user.isActive ? <FaTimes /> : <FaCheckCircle />}
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-100 text-red-600 hover:bg-red-200 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                >
                  <FaTrash /> Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full animate-slideInUp">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white relative rounded-t-2xl">
              <h2 className="text-2xl font-black mb-1">⚠️ Delete User</h2>
              <p className="text-white/80">This action cannot be undone</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{user.name}</strong>? All associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={deleteUser}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:border-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
