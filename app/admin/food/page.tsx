'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import AdminSidebar from '@/components/AdminSidebar';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

interface Food {
  _id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
  image: string;
}

export default function AdminFood() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'starter',
    price: '',
    isVegetarian: false,
    spiceLevel: 'medium',
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchFoods();
  }, [isAuthenticated, user, router]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await API.get('/food');
      setFoods(response.data.foods);
    } catch (error) {
      toast.error('Failed to fetch foods');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('isVegetarian', String(formData.isVegetarian));
      formDataToSend.append('spiceLevel', formData.spiceLevel);
      if (image) formDataToSend.append('image', image);

      if (editingFood) {
        await API.put(`/food/${editingFood._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Food updated successfully');
      } else {
        await API.post('/food', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Food added successfully');
      }

      setFormData({
        name: '',
        description: '',
        category: 'starter',
        price: '',
        isVegetarian: false,
        spiceLevel: 'medium',
      });
      setImage(null);
      setEditingFood(null);
      setShowForm(false);
      fetchFoods();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save food');
    }
  };

  const handleDelete = async (foodId: string) => {
    if (confirm('Are you sure you want to delete this food?')) {
      try {
        await API.delete(`/food/${foodId}`);
        toast.success('Food deleted successfully');
        fetchFoods();
      } catch (error) {
        toast.error('Failed to delete food');
      }
    }
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: '',
      category: food.category,
      price: food.price.toString(),
      isVegetarian: false,
      spiceLevel: 'medium',
    });
    setShowForm(true);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Food Menu Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> Add Food
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card bg-white mb-6 p-6">
            <h2 className="text-xl font-bold mb-4">{editingFood ? 'Edit Food' : 'Add New Food'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Food Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="input-field"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="starter">Starter</option>
                  <option value="main_course">Main Course</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                  <option value="side_dish">Side Dish</option>
                </select>
                <select
                  value={formData.spiceLevel}
                  onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                  className="input-field"
                >
                  <option value="mild">Mild</option>
                  <option value="medium">Medium</option>
                  <option value="hot">Hot</option>
                </select>
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="input-field w-full mb-4"
                rows={3}
              />

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="input-field"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isVegetarian}
                    onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                  />
                  <span>Vegetarian</span>
                </label>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {editingFood ? 'Update' : 'Add'} Food
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFood(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Foods Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card bg-white overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Available</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-3">
                      {food.image && (
                        <img
                          src={`http://localhost:5000/uploads/${food.image}`}
                          alt={food.name}
                          className="w-8 h-8 rounded"
                        />
                      )}
                      {food.name}
                    </td>
                    <td className="p-3 capitalize">{food.category.replace('_', ' ')}</td>
                    <td className="p-3">Rs.{food.price}</td>
                    <td className="p-3">
                      <span className={food.isAvailable ? 'text-green-600' : 'text-red-600'}>
                        {food.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(food)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
