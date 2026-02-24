'use client';

import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter, FaUsers, FaTrophy, FaHeart } from 'react-icons/fa';
import Image from 'next/image';

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

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const response = await API.get('/about');
      setAboutData(response.data.data);
    } catch (error) {
      console.error('Error fetching About Us:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">About Us information not available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{aboutData.title}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            {aboutData.description}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition">
            <div className="text-5xl text-primary mb-4 flex justify-center">
              <FaHeart />
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-2">
              {aboutData.customersServed.toLocaleString()}+
            </h3>
            <p className="text-gray-600 font-semibold">Happy Customers</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition">
            <div className="text-5xl text-primary mb-4 flex justify-center">
              <FaUsers />
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-2">{aboutData.teamSize}+</h3>
            <p className="text-gray-600 font-semibold">Team Members</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition">
            <div className="text-5xl text-primary mb-4 flex justify-center">
              <FaTrophy />
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-2">{aboutData.yearsOfService}+</h3>
            <p className="text-gray-600 font-semibold">Years of Excellence</p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed text-justify whitespace-pre-line">
            {aboutData.story}
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-primary to-red-600 text-white rounded-2xl shadow-xl p-8">
            <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg leading-relaxed">
              {aboutData.mission}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-xl p-8">
            <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
            <p className="text-lg leading-relaxed">
              {aboutData.vision}
            </p>
          </div>
        </div>
      </div>

      {/* Our Specialties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.specialties.map((specialty, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-l-4 border-primary hover:shadow-lg transition"
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-4">🍽️</span>
                  <p className="text-lg font-semibold text-gray-800">{specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      {aboutData.achievements && aboutData.achievements.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Achievements</h2>
            <div className="space-y-6">
              {aboutData.achievements.map((achievement, index) => (
                <div
                  key={achievement._id || index}
                  className="flex items-start bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-l-4 border-yellow-500"
                >
                  <div className="text-4xl mr-6 text-yellow-600">
                    <FaTrophy />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{achievement.title}</h3>
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {achievement.year}
                      </span>
                    </div>
                    <p className="text-gray-700">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-4xl font-bold mb-8 text-center">Visit Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="text-3xl text-primary mr-4">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Address</h3>
                  <p className="text-gray-300">{aboutData.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-3xl text-primary mr-4">
                  <FaPhone />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Phone</h3>
                  <a href={`tel:${aboutData.phone}`} className="text-gray-300 hover:text-primary transition">
                    {aboutData.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-3xl text-primary mr-4">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <a href={`mailto:${aboutData.email}`} className="text-gray-300 hover:text-primary transition">
                    {aboutData.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="text-3xl text-primary mr-4">
                  <FaClock />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Opening Hours</h3>
                  <p className="text-gray-300">{aboutData.openingHours}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {aboutData.socialMedia.facebook && (
                    <a
                      href={aboutData.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-4xl text-blue-500 hover:text-blue-400 transition"
                    >
                      <FaFacebook />
                    </a>
                  )}
                  {aboutData.socialMedia.instagram && (
                    <a
                      href={aboutData.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-4xl text-pink-500 hover:text-pink-400 transition"
                    >
                      <FaInstagram />
                    </a>
                  )}
                  {aboutData.socialMedia.twitter && (
                    <a
                      href={aboutData.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-4xl text-blue-400 hover:text-blue-300 transition"
                    >
                      <FaTwitter />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nepal Pride Section */}
      <div className="bg-gradient-to-r from-red-700 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">🇳🇵 Proudly Serving Nepal 🇳🇵</h2>
          <p className="text-xl max-w-3xl mx-auto">
            From the heart of Kathmandu to homes across Nepal, we bring authentic flavors with love and dedication. 
            Jhasha Restaurant - A taste of home, delivered with pride.
          </p>
        </div>
      </div>
    </div>
  );
}
