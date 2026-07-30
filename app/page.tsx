'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';
// import FoodCard from '@/components/FoodCard';
import type { FoodItem } from '@/lib/types';
import { toast } from 'react-toastify';
import { FaSearch, FaFire } from 'react-icons/fa';

export default function Home() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string; emoji: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      const categoryList = response.data?.data?.categories ?? [];
      const mappedCategories = categoryList.map((category: { name: string; slug?: string }) => ({
        id: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
        label: category.name,
        emoji: '🍽️',
      }));
      setCategories(mappedCategories);
    } catch (error) {
      setCategories([
        { id: 'starter', label: '🥘 Starter', emoji: '🥘' },
        { id: 'main_course', label: '🍛 Main Course', emoji: '🍛' },
        { id: 'dessert', label: '🍰 Dessert', emoji: '🍰' },
        { id: 'beverage', label: '🥤 Beverage', emoji: '🥤' },
        { id: 'side_dish', label: '🥗 Side Dish', emoji: '🥗' },
      ]);
    }
  };

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await API.get(`/products?${params.toString()}`);
      const products = response.data?.data?.products ?? [];
      setFoods(products);
    } catch (error) {
      toast.error('Failed to fetch foods');
    } finally {
      setLoading(false);
    }
  };

  const _categoryEmojis: { [key: string]: string } = {
    starter: '🥘',
    main_course: '🍛',
    dessert: '🍰',
    beverage: '🥤',
    side_dish: '🥗',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-red-600 to-orange-500 text-white pt-16 pb-12 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 text-6xl animate-pulse">🍽️</div>
          <div className="absolute top-20 right-20 text-5xl animate-bounce">🍔</div>
          <div className="absolute bottom-4 left-1/3 text-5xl animate-pulse">🌮</div>
        </div>
        <div className="container relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-3 leading-tight animate-slideInUp">
            Welcome to <span className="text-yellow-300">Jhasha</span> Restaurant
          </h1>
          <p className="text-xl md:text-2xl mb-6 opacity-95 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            🚀 Experience authentic flavors delivered to your doorstep
          </p>
          <div className="flex flex-wrap gap-4 text-sm animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <span className="bg-white/20 px-4 py-2 rounded-full">⚡ Fast Delivery</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">🔥 Hot & Fresh</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">⭐ Quality Assured</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Search Bar */}
        <div className="mb-8 relative animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <div className="relative">
            <FaSearch className="absolute left-4 top-4 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search for your favorite dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition text-lg shadow-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-10 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
          <h2 className="section-title mb-4 flex items-center gap-2">
            <FaFire className="text-primary" /> Filter by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-5 py-2 rounded-full font-semibold transition transform hover:scale-105 ${
                selectedCategory === ''
                  ? 'bg-gradient-to-r from-primary to-red-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary'
              }`}
            >
              🍽️ All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-semibold transition transform hover:scale-105 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-primary to-red-600 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card h-96 bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-xl text-gray-600">No dishes found. Try a different search!</p>
          </div>
        ) : (
          <div>
            <h2 className="section-title mb-8">
              🔥 {foods.length} Delicious Option{foods.length !== 1 ? 's' : ''} Available
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {foods.map((food, index) => (
                <div key={food._id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slideInUp">
                  {/* <FoodCard food={food} /> */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
