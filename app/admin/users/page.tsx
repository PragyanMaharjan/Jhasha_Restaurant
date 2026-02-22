'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import AdminSidebar from '@/components/AdminSidebar';
import { toast } from 'react-toastify';
import { FaSearch, FaToggleOn, FaToggleOff, FaTrash, FaEye, FaUserPlus, FaTimes, FaPhone, FaEnvelope, FaCalendarAlt, FaUsers, FaEdit } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [editUser, setEditUser] = useState({ _id: '', name: '', email: '', phone: '' });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchUsers();
  }, [isAuthenticated, user, router, searchTerm, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '5');
      if (searchTerm) params.append('search', searchTerm);

      const response = await API.get(`/admin/users?${params.toString()}`);
      setUsers(response.data.users);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await API.put('/admin/users/status', {
        userId,
        isActive: !isActive,
      });
      fetchUsers();
      toast.success('✅ User status updated');
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await API.delete(`/admin/users/${userId}`);
      fetchUsers();
      toast.success('🗑️ User deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
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

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUser.password !== newUser.confirmPassword) {
      toast.error('❌ Passwords do not match');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('name', newUser.name);
      formData.append('email', newUser.email);
      formData.append('phone', newUser.phone);
      formData.append('password', newUser.password);
      formData.append('confirmPassword', newUser.confirmPassword);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      await API.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      fetchUsers();
      setShowCreateModal(false);
      setNewUser({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
      setProfileImage(null);
      setImagePreview('');
      toast.success('✅ User created successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const viewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const openEditModal = (user: User) => {
    setEditUser({ _id: user._id, name: user.name, email: user.email, phone: user.phone });
    setImagePreview(user.profileImage ? `http://localhost:5000/${user.profileImage}` : '');
    setShowEditModal(true);
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', editUser.name);
      formData.append('email', editUser.email);
      formData.append('phone', editUser.phone);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      await API.put(`/admin/users/${editUser._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      fetchUsers();
      setShowEditModal(false);
      setEditUser({ _id: '', name: '', email: '', phone: '' });
      setProfileImage(null);
      setImagePreview('');
      toast.success('✅ User updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AdminSidebar />

      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
                <FaUsers className="text-primary" /> Users Management
              </h1>
              <p className="text-gray-600">Manage customer accounts and permissions</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold px-6 py-3 rounded-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <FaUserPlus /> Add New User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600">
            <p className="text-blue-700 font-bold text-sm mb-1">Total Users</p>
            <p className="text-3xl font-black text-blue-600">{users.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600">
            <p className="text-green-700 font-bold text-sm mb-1">Active Users</p>
            <p className="text-3xl font-black text-green-600">{users.filter(u => u.isActive).length}</p>
          </div>
          <div className="card bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-600">
            <p className="text-red-700 font-bold text-sm mb-1">Inactive Users</p>
            <p className="text-3xl font-black text-red-600">{users.filter(u => !u.isActive).length}</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-600">
            <p className="text-purple-700 font-bold text-sm mb-1">New Today</p>
            <p className="text-3xl font-black text-purple-600">
              {users.filter(u => new Date(u.createdAt).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <FaSearch className="absolute left-4 top-4 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition text-lg shadow-sm"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card bg-gray-200 h-24 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 animate-slideInUp">
            <div className="text-7xl mb-4">👥</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">No users found</p>
            <p className="text-gray-600">Try adjusting your search or add a new user</p>
          </div>
        ) : (
          <div className="card bg-white overflow-hidden animate-slideInUp" style={{ animationDelay: '0.3s' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary/10 to-red-600/10">
                  <tr>
                    <th className="p-4 text-left font-black text-gray-900">User</th>
                    <th className="p-4 text-left font-black text-gray-900">Contact</th>
                    <th className="p-4 text-left font-black text-gray-900">Joined</th>
                    <th className="p-4 text-left font-black text-gray-900">Status</th>
                    <th className="p-4 text-center font-black text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr key={u._id} className="border-b hover:bg-gray-50 transition" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-red-600/20 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                            {u.profileImage ? (
                              <img
                                src={`http://localhost:5000/${u.profileImage}`}
                                alt={u.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xl font-bold text-primary">👤</span>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-600">ID: {u._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-2">
                            <FaEnvelope className="text-primary" /> {u.email}
                          </p>
                          <p className="text-sm flex items-center gap-2">
                            <FaPhone className="text-primary" /> {u.phone}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm flex items-center gap-2">
                          <FaCalendarAlt className="text-primary" />
                          {new Date(u.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleUserStatus(u._id, u.isActive)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition transform hover:scale-105 ${
                            u.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {u.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                          {u.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => viewUser(u)}
                            className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-lg transition"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => openEditModal(u)}
                            className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 p-2 rounded-lg transition"
                            title="Edit User"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteUser(u._id, u.name)}
                            className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-lg transition"
                            title="Delete User"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6 pb-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-6 py-3 rounded-lg font-bold transition transform hover:scale-105 ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-red-600 text-white hover:shadow-lg'
                    }`}
                  >
                    ← Previous
                  </button>
                  <span className="text-gray-700 font-bold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-6 py-3 rounded-lg font-bold transition transform hover:scale-105 ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-red-600 text-white hover:shadow-lg'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideInUp">
            <div className="bg-gradient-to-r from-primary to-red-600 p-6 text-white relative">
              <button
                onClick={() => setShowViewModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition"
              >
                <FaTimes size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                  {selectedUser.profileImage ? (
                    <img
                      src={`http://localhost:5000/${selectedUser.profileImage}`}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-1">{selectedUser.name}</h2>
                  <p className="text-white/80">Customer Details</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Email Address</p>
                  <p className="text-gray-900 font-semibold break-all flex items-center gap-2">
                    <FaEnvelope className="text-primary" /> {selectedUser.email}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Phone Number</p>
                  <p className="text-gray-900 font-semibold flex items-center gap-2">
                    <FaPhone className="text-primary" /> {selectedUser.phone}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">User ID</p>
                  <p className="text-gray-900 font-semibold">{selectedUser._id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Account Status</p>
                  <p className={`font-bold ${
                    selectedUser.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedUser.isActive ? '✅ Active' : '❌ Inactive'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Member Since</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(selectedUser.createdAt).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full animate-slideInUp">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 text-white relative">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setProfileImage(null);
                  setImagePreview('');
                }}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-black mb-1">✏️ Edit User</h2>
              <p className="text-white/80">Update customer information</p>
            </div>
            <form onSubmit={updateUser} className="p-6 space-y-4">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-3">Profile Picture</label>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-yellow-500/20 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-2xl">👤</span>
                    )}
                  </div>
                  <label
                    htmlFor="editProfileImage"
                    className="absolute bottom-0 right-0 bg-yellow-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-orange-600 transition shadow-lg text-xs"
                  >
                    📷
                    <input
                      type="file"
                      id="editProfileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={editUser.phone}
                  onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="text-xs text-blue-700">💡 Password cannot be changed from here for security reasons.</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
                >
                  ✅ Update User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setProfileImage(null);
                    setImagePreview('');
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:border-yellow-500 hover:text-yellow-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full animate-slideInUp">
            <div className="bg-gradient-to-r from-primary to-red-600 p-6 text-white relative">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-black mb-1">👤 Add New User</h2>
              <p className="text-white/80">Create a customer account</p>
            </div>
            <form onSubmit={createUser} className="p-6 space-y-4">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-3">Profile Picture (Optional)</label>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/20 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-2xl">👤</span>
                    )}
                  </div>
                  <label
                    htmlFor="userProfileImage"
                    className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:bg-red-600 transition shadow-lg text-xs"
                  >
                    📷
                    <input
                      type="file"
                      id="userProfileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
                >
                  ✅ Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:border-primary hover:text-primary transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
