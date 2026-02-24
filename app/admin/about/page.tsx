'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import API from '@/lib/api';
import AdminSidebar from '@/components/AdminSidebar';
import { FaSave, FaPlus, FaTrash, FaUpload } from 'react-icons/fa';

interface Achievement {
  _id?: string;
  title: string;
  description: string;
  year: string;
}

interface AboutUsData {
  title: string;
  description: string;
  story: string;
  mission: string;
  vision: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  specialties: string[];
  achievements: Achievement[];
  teamSize: number;
  yearsOfService: number;
  customersServed: number;
  images: string[];
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export default function AdminAboutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState<AboutUsData>({
    title: '',
    description: '',
    story: '',
    mission: '',
    vision: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    specialties: [],
    achievements: [],
    teamSize: 0,
    yearsOfService: 0,
    customersServed: 0,
    images: [],
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    title: '',
    description: '',
    year: new Date().getFullYear().toString()
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    } else {
      setAuthChecked(true);
      fetchAboutUs();
    }
  }, [user, router]);

  const fetchAboutUs = async () => {
    try {
      const response = await API.get('/about');
      setFormData(response.data.data);
    } catch (error) {
      showMessage('error', 'Error fetching About Us data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleInputChange = (field: keyof AboutUsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform: 'facebook' | 'instagram' | 'twitter', value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = async () => {
    if (!newAchievement.title || !newAchievement.description) {
      showMessage('error', 'Please fill in achievement title and description');
      return;
    }

    try {
      const response = await API.post('/about/achievement', newAchievement);
      setFormData(prev => ({
        ...prev,
        achievements: response.data.data.achievements
      }));
      setNewAchievement({ title: '', description: '', year: new Date().getFullYear().toString() });
      showMessage('success', 'Achievement added successfully');
    } catch (error: any) {
      showMessage('error', error.response?.data?.message || 'Error adding achievement');
    }
  };

  const removeAchievement = async (achievementId: string) => {
    try {
      const response = await API.delete(`/about/achievement/${achievementId}`);
      setFormData(prev => ({
        ...prev,
        achievements: response.data.data.achievements
      }));
      showMessage('success', 'Achievement removed successfully');
    } catch (error: any) {
      showMessage('error', error.response?.data?.message || 'Error removing achievement');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Phone validation for Nepal
    const phoneRegex = /^\+977[- ]?[9][6-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      showMessage('error', 'Phone must be in format +977-9XXXXXXXX (10 digits starting with 9)');
      return;
    }

    setSaving(true);
    try {
      const response = await API.put('/about', formData);
      setFormData(response.data.data);
      showMessage('success', 'About Us page updated successfully');
    } catch (error: any) {
      showMessage('error', error.response?.data?.message || 'Error updating About Us');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <AdminSidebar />
      
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Manage About Us Page</h1>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <p className="text-white font-semibold">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Our Story</label>
                  <textarea
                    value={formData.story}
                    onChange={(e) => handleInputChange('story', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Mission</label>
                    <textarea
                      value={formData.mission}
                      onChange={(e) => handleInputChange('mission', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Vision</label>
                    <textarea
                      value={formData.vision}
                      onChange={(e) => handleInputChange('vision', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Phone (Nepal: +977-9XXXXXXXX)</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+977-9812345678"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Opening Hours</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => handleInputChange('openingHours', e.target.value)}
                    placeholder="e.g., Mon-Sun: 10:00 AM - 10:00 PM"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Team Size</label>
                  <input
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Years of Service</label>
                  <input
                    type="number"
                    value={formData.yearsOfService}
                    onChange={(e) => handleInputChange('yearsOfService', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Customers Served</label>
                  <input
                    type="number"
                    value={formData.customersServed}
                    onChange={(e) => handleInputChange('customersServed', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Our Specialties</h2>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="e.g., Dal Bhat, Momo, Newari Khaja"
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                />
                <button
                  type="button"
                  onClick={addSpecialty}
                  className="px-6 py-2 bg-primary hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition"
                >
                  <FaPlus /> Add
                </button>
              </div>

              <div className="space-y-2">
                {formData.specialties.map((specialty, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg">
                    <span className="text-white">{specialty}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                      className="text-red-500 hover:text-red-400 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Achievements</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">Achievement Title</label>
                  <input
                    type="text"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Best Restaurant Award 2023"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the achievement..."
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-300 mb-2">Year</label>
                    <input
                      type="text"
                      value={newAchievement.year}
                      onChange={(e) => setNewAchievement(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="2023"
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="px-6 py-2 bg-primary hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition"
                    >
                      <FaPlus /> Add Achievement
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {formData.achievements.map((achievement) => (
                  <div key={achievement._id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-bold text-black">
                          {achievement.year}
                        </span>
                        <button
                          type="button"
                          onClick={() => achievement._id && removeAchievement(achievement._id)}
                          className="text-red-500 hover:text-red-400 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Social Media</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Facebook URL</label>
                  <input
                    type="url"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/jhasharestro"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/jhasharestro"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Twitter URL</label>
                  <input
                    type="url"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/jhasharestro"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-primary hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50"
              >
                <FaSave />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
