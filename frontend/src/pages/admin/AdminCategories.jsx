import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  Upload,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit Category
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminCategories();
      if (res.success) setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setImageUrl(cat.image || '');
    setDisplayOrder(cat.displayOrder || 0);
    setIsActive(cat.isActive !== false);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        image: imageUrl.trim() || undefined,
        displayOrder: Number(displayOrder) || 0,
        isActive,
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory._id, payload);
      } else {
        await api.createCategory(payload);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setDeleteError('');
    setIsDeleting(true);
    try {
      await api.deleteCategory(deleteCandidate._id);
      setDeleteCandidate(null);
      fetchCategories();
    } catch (err) {
      setDeleteError(err.message || 'Cannot delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
            Store Categories
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
            Organize and manage the core aisles of your boutique catalogue.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-chocolate-900 hover:bg-chocolate-800 text-champagne-100 text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs font-semibold text-chocolate-600 space-y-2">
          <div className="w-6 h-6 border-2 border-chocolate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <span>Loading categories...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="glass-card rounded-3xl overflow-hidden border border-white/80 shadow-md flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              {/* Image banner */}
              <div className="relative aspect-[16/9] bg-champagne-100 overflow-hidden">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      cat.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-serif text-lg font-bold text-chocolate-950">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-semibold text-rosegold-600 bg-champagne-100 px-2 py-0.5 rounded-md">
                      {cat.productCount ?? 0} Products
                    </span>
                  </div>
                  <p className="text-xs text-chocolate-600 line-clamp-2 leading-relaxed">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-champagne-200 flex items-center justify-between">
                  <span className="text-[11px] text-chocolate-600">
                    Display Order: #{cat.displayOrder ?? 0}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 rounded-lg text-chocolate-700 hover:text-chocolate-950 hover:bg-champagne-200"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteCandidate(cat);
                        setDeleteError('');
                      }}
                      className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chocolate-950/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-modal rounded-3xl shadow-2xl border border-white/90 overflow-hidden"
          >
            <div className="px-6 py-4 bg-champagne-100/40 backdrop-blur-md border-b border-champagne-200/80 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-chocolate-950">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full glass-pill text-chocolate-700 hover:bg-white border border-white/80 shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Silk Scarves & Belts"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for category card..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                  Category Banner Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-chocolate-900 focus:ring-gold-400"
                    />
                    <span className="text-xs font-bold text-chocolate-900">
                      Active In Store
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-champagne-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-champagne-300 text-chocolate-800 text-xs font-bold hover:bg-champagne-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-champagne-100 text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Dialog */}
      {deleteCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chocolate-950/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setDeleteCandidate(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass-modal rounded-3xl p-6 shadow-2xl border border-white/90 space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-serif text-lg font-bold text-chocolate-950">
                Delete Category?
              </h3>
              <p className="text-xs text-chocolate-600 mt-1">
                Are you sure you want to delete <span className="font-bold text-chocolate-900">"{deleteCandidate.name}"</span>?
              </p>
              {deleteCandidate.productCount > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold text-left">
                  ⚠️ Notice: This category currently contains {deleteCandidate.productCount} product(s). You must reassign or remove those products before this category can be safely deleted.
                </div>
              )}
              {deleteError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium text-left">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-5 py-2.5 rounded-xl border border-champagne-300 text-chocolate-800 text-xs font-bold hover:bg-champagne-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || deleteCandidate.productCount > 0}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
