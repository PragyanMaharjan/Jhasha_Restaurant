'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

interface Category {
  _id: string;
  name: string;
  slug?: string;
  createdAt?: string;
}

export default function AdminCategories() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState('');
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchCategories();
  }, [isAuthenticated, user, router]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/categories');
      setCategories(res.data.categories || res.data || []);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/admin/categories', { name: newName });
      setNewName('');
      setShowCreate(false);
      fetchCategories();
      toast.success('✅ Category created');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create category');
    }
  };

  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setShowEdit(true);
  };

  const updateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory) return;

    try {
      await API.put(`/admin/categories/${editCategory._id}`, { name: editCategory.name });
      setShowEdit(false);
      setEditCategory(null);
      fetchCategories();
      toast.success('✅ Category updated');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update category');
    }
  };

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/admin/categories/${id}`);
      fetchCategories();
      toast.success('🗑️ Category deleted');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AdminSidebar />

      <div className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Categories</h1>
              <p className="text-gray-600">Manage product categories</p>
            </div>
            <div>
              <button onClick={() => setShowCreate(true)} className="btn btn-primary flex items-center gap-2">
                <FaPlus /> New Category
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-white p-4">
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No categories yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left font-bold">Name</th>
                    <th className="p-3 text-left font-bold">Slug</th>
                    <th className="p-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c._id} className="border-b">
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">{c.slug || '-'}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(c)} className="btn bg-yellow-50 text-yellow-700 px-3 py-2 rounded">
                            <FaEdit />
                          </button>
                          <button onClick={() => deleteCategory(c._id, c.name)} className="btn bg-red-50 text-red-700 px-3 py-2 rounded">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">New Category</h3>
              <form onSubmit={createCategory} className="space-y-4">
                <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-3 border rounded" placeholder="Category name" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary text-white">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEdit && editCategory && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Edit Category</h3>
              <form onSubmit={updateCategory} className="space-y-4">
                <input value={editCategory.name} onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })} className="w-full p-3 border rounded" placeholder="Category name" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => { setShowEdit(false); setEditCategory(null); }} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary text-white">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
