'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';
import { useCartStore } from '@/lib/store';
import type { FoodItem } from '@/lib/types';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { FaHeart, FaPlus, FaMinus, FaStar } from 'react-icons/fa';

export default function FoodCard({ food }: { food: FoodItem }) {
  const cartStore = useCartStore as unknown as () => import('@/lib/types').CartState;
  const { addToCart, cart, updateQuantity } = cartStore();
  const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const item = cart.find((item) => item._id === food._id);
    setQuantity(item?.quantity || 0);
  }, [cart, food._id]);

  const handleAddToCart = () => {
    addToCart(food);
    toast.success('Added to cart! 🎉');
  };

  const handleIncrement = () => {
    updateQuantity(food._id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(food._id, quantity - 1);
    }
  };

  const categoryLabels: { [key: string]: string } = {
    starter: '🥘 Starter',
    main_course: '🍛 Main Course',
    dessert: '🍰 Dessert',
    beverage: '🥤 Beverage',
    side_dish: '🥗 Side Dish',
  };

  const spiceLevelColors: { [key: string]: string } = {
    mild: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    hot: 'text-red-600 bg-red-50',
  };

  return (
    <div className="card h-full flex flex-col group animate-slideInUp hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative w-full h-56 mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
        <img
          src={`http://localhost:5000/uploads/${food.image}`}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
          Rs.{food.price}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 left-3 bg-white/90 hover:bg-white p-2 rounded-full transition transform hover:scale-110"
        >
          <FaHeart size={16} className={isFavorite ? 'text-primary' : 'text-gray-400'} />
        </button>

        {/* Rating */}
        {(food.rating ?? 0) > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <FaStar size={12} className="text-yellow-400" />
            {food.rating}
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition">{food.name}</h3>

      <p className="text-sm text-gray-600 mb-3 flex-grow line-clamp-2">{food.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {food.spiceLevel && (
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${spiceLevelColors[food.spiceLevel]}`}>
            {food.spiceLevel === 'mild' && '🌶️ Mild'}
            {food.spiceLevel === 'medium' && '🌶️🌶️ Medium'}
            {food.spiceLevel === 'hot' && '🌶️🌶️🌶️ Hot'}
          </span>
        )}
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
            food.isVegetarian ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
          }`}
        >
          {food.isVegetarian ? '🌱 Veg' : '🍗 Non-Veg'}
        </span>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
          {categoryLabels[food.category] || food.category}
        </span>
      </div>

      {/* Add to Cart / Quantity Controls */}
      {quantity === 0 ? (
        <button onClick={handleAddToCart} className="btn-primary w-full flex items-center justify-center gap-2">
          <FaPlus /> Add to Cart
        </button>
      ) : (
        <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl px-3 py-2 border-2 border-primary/20">
          <button
            onClick={handleDecrement}
            className="text-primary hover:bg-primary hover:text-white p-2 rounded-lg transition"
          >
            <FaMinus />
          </button>
          <span className="font-bold text-lg px-2">{quantity}</span>
          <button
            onClick={handleIncrement}
            className="text-primary hover:bg-primary hover:text-white p-2 rounded-lg transition"
          >
            <FaPlus />
          </button>
        </div>
      )}
    </div>
  );
}
