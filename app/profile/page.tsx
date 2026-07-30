'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FaCamera, FaUser, FaPhone, FaMapMarkerAlt, FaCity, FaMailBulk, FaEdit } from 'react-icons/fa';
import { getErrorMessage } from '@/lib/errorHandler';
import { getCurrentUser, updateProfile, changePassword, setup2FA, enable2FA, disable2FA } from '@/lib/profile';

export default function Profile() {
  const router = useRouter();
  const { isAuthenticated, user, setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [twoFAStatus, setTwoFAStatus] = useState({ enabled: user?.twoFactorEnabled || false, secret: '', qrCodeUrl: '', token: '' });
  const [_passwordLoading, setPasswordLoading] = useState(false);

  const buildImageUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';
    return path.startsWith('http') ? path : `${baseUrl}/${path}`;
  };

  const fetchProfile = async () => {
    try {
      const userData = await getCurrentUser();
      setFormData({
        name: userData.name,
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        zipCode: userData.zipCode || '',
      });
      if (userData.profileImage) {
        setImagePreview(buildImageUrl(userData.profileImage));
      }
      setUser(userData as any);
    } catch (error: any) {
      toast.error(getErrorMessage(error, '⚠️ Unable to load your profile. Please refresh the page.'));
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
      });

      setTwoFAStatus((prev) => ({
        ...prev,
        enabled: user.twoFactorEnabled || false,
      }));

      if (user.profileImage) {
        setImagePreview(buildImageUrl(user.profileImage));
      }
    }

    fetchProfile();
  }, [mounted, isAuthenticated, router, user]);

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

  const _handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('❌ New passwords do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('✅ Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(getErrorMessage(error, '❌ Unable to update your password. Please try again.'));
    } finally {
      setPasswordLoading(false);
    }
  };

  const _handle2FASetup = async () => {
    try {
      const result = await setup2FA();
      setTwoFAStatus((prev) => ({ ...prev, secret: result.secret, qrCodeUrl: result.qrCodeUrl }));
    } catch (error: any) {
      toast.error(getErrorMessage(error, '❌ Unable to start 2FA setup. Please try again.'));
    }
  };

  const _handle2FAEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enable2FA(twoFAStatus.token);
      setTwoFAStatus((prev) => ({ ...prev, enabled: true, token: '' }));
      setUser(user ? { ...user, twoFactorEnabled: true } : null);
      toast.success('✅ Two-factor authentication enabled!');
    } catch (error: any) {
      toast.error(getErrorMessage(error, '❌ Unable to enable 2FA. Please check the token and try again.'));
    }
  };

  const _handle2FADisable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await disable2FA(passwordData.currentPassword);
      setTwoFAStatus((prev) => ({ ...prev, enabled: false, token: '' }));
      setUser(user ? { ...user, twoFactorEnabled: false } : null);
      toast.success('✅ Two-factor authentication disabled!');
      setPasswordData((prev) => ({ ...prev, currentPassword: '' }));
    } catch (error: any) {
      toast.error(getErrorMessage(error, '❌ Unable to disable 2FA. Please check your password and try again.'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('zipCode', formData.zipCode);

      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const updatedUser = await updateProfile(formDataToSend);
      setUser(updatedUser as any);

      if (updatedUser.profileImage) {
        setImagePreview(buildImageUrl(updatedUser.profileImage));
      }

      setProfileImage(null);
      toast.success('✅ Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(getErrorMessage(error, '❌ Unable to update your profile. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
            <FaUser className="text-primary" /> My Profile
          </h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 animate-slideInUp">
            <div className="card bg-white">
              <form onSubmit={handleSubmit}>
                {/* Profile Image Section */}
                <div className="mb-8 text-center pb-8 border-b-2 border-gray-200">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center border-4 border-primary/20">
                      {imagePreview ? (
                        <img
                          key={imagePreview}
                          src={`${imagePreview}?t=${Date.now()}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl">👤</div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-gradient-to-r from-primary to-red-600 text-white p-3 rounded-full cursor-pointer hover:shadow-lg transition transform hover:scale-110">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <FaCamera size={20} />
                    </label>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">{formData.name}</h2>
                  <p className="text-gray-600 mb-3 flex items-center justify-center gap-2">
                    <FaMailBulk className="text-primary" /> {user?.email}
                  </p>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:text-red-600 transition"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  )}
                </div>

                {/* Form Fields */}
                {isEditing && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>

                    <div className="space-y-6 mb-8">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Full Name</label>
                        <div className="relative">
                          <FaUser className="absolute left-4 top-4 text-primary text-lg" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Phone Number</label>
                        <div className="relative">
                          <FaPhone className="absolute left-4 top-4 text-primary text-lg" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Street Address</label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-4 top-4 text-primary text-lg" />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                            placeholder="123 Main Street"
                          />
                        </div>
                      </div>

                      {/* City and Zip Code */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">City</label>
                          <div className="relative">
                            <FaCity className="absolute left-4 top-4 text-primary text-lg" />
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                              placeholder="New York"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">Zip Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition bg-gray-50 focus:bg-white"
                            placeholder="10001"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? '⏳ Updating...' : '✅ Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          fetchProfile();
                        }}
                        className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:border-primary hover:text-primary transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}

                {/* Display View */}
                {!isEditing && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-bold text-gray-600 uppercase mb-2">Name</p>
                        <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <FaUser className="text-primary" /> {formData.name}
                        </p>
                      </div>

                      {/* Phone */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-bold text-gray-600 uppercase mb-2">Phone</p>
                        <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <FaPhone className="text-primary" /> {formData.phone}
                        </p>
                      </div>

                      {/* Address */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-bold text-gray-600 uppercase mb-2">Address</p>
                        <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-primary" /> {formData.address || 'Not provided'}
                        </p>
                      </div>

                      {/* City */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-bold text-gray-600 uppercase mb-2">City</p>
                        <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <FaCity className="text-primary" /> {formData.city || 'Not provided'}
                        </p>
                      </div>

                      {/* Zip Code */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-bold text-gray-600 uppercase mb-2">Zip Code</p>
                        <p className="text-lg font-bold text-gray-900">{formData.zipCode || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <div className="card bg-gradient-to-br from-primary/10 to-red-600/10 border-2 border-primary/20">
              <h3 className="text-xl font-black text-gray-900 mb-6">Account Info</h3>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1">Email</p>
                  <p className="text-gray-900 font-semibold break-all">{user?.email}</p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1">Role</p>
                  <p className="text-gray-900 font-semibold">
                    {user?.role === 'admin' ? '👨‍💼 Admin' : '👤 User'}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1">Member Since</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(user?.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Security Note */}
              <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                <p className="text-xs font-bold text-yellow-800">🔒 Security Tip</p>
                <p className="text-xs text-yellow-700 mt-1">Never share your password with anyone. We will never ask for it.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
