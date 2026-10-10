import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, getAssetUrl } from '../../api/client';
import AdminProductModal from './AdminProductModal';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Products and Categories data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Deletion confirmation state
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getAdminCategories();
        if (res.success) setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load admin categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 15,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedAvailability !== 'all') params.availability = selectedAvailability;

      const res = await api.getAdminProducts(params);
      if (res.success) {
        setProducts(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch admin products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, selectedAvailability]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle URL query parameters (e.g. ?action=new or ?edit=id)
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setProductToEdit(null);
      setIsModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
    const editId = searchParams.get('edit');
    if (editId) {
      api.getAdminProductById(editId).then((res) => {
        if (res.success && res.data) {
          setProductToEdit(res.data);
          setIsModalOpen(true);
        }
      }).catch(console.error);
      searchParams.delete('edit');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Fast inline availability toggle
  const handleToggleAvailability = async (product, nextStatus) => {
    try {
      await api.updateProduct(product._id, { availability: nextStatus });
      fetchProducts();
    } catch (err) {
      console.error('Failed to update availability:', err);
    }
  };

  // Fast inline visibility toggle
  const handleToggleVisibility = async (product) => {
    try {
      await api.updateProduct(product._id, { visibility: !product.visibility });
      fetchProducts();
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  // Delete product action
  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await api.deleteProduct(deleteCandidate._id);
      setDeleteCandidate(null);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
            Manage Products
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
            Total {total} items registered in boutique catalogue.
          </p>
        </div>

        <button
          onClick={() => {
            setProductToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-chocolate-900 hover:bg-chocolate-800 text-champagne-100 text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/80 shadow-md grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-chocolate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, tag, or code..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-gold-400"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-gold-400"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedAvailability}
            onChange={(e) => {
              setSelectedAvailability(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-gold-400"
          >
            <option value="all">All Availability</option>
            <option value="in_stock">In Stock</option>
            <option value="coming_soon">Coming Soon</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-3xl border border-white/85 shadow-md overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-chocolate-600 space-y-2">
            <div className="w-6 h-6 border-2 border-chocolate-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <span>Loading boutique products...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-chocolate-900">
              <thead className="bg-champagne-100/50 backdrop-blur-md border-b border-champagne-200/80 text-chocolate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-champagne-100">
                {products.map((p) => {
                  const rawThumb = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=200&auto=format&fit=crop&q=80';
                  const thumb = getAssetUrl(rawThumb);
                  return (
                    <tr key={p._id} className="hover:bg-champagne-50/50 transition-colors">
                      {/* Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumb}
                            alt=""
                            className="w-11 h-11 rounded-lg object-cover bg-champagne-100 border border-champagne-200 flex-shrink-0"
                          />
                          <div>
                            <div className="font-serif font-bold text-sm text-chocolate-950 flex items-center gap-1.5">
                              <span>{p.name}</span>
                              {p.featured && (
                                <Sparkles className="w-3 h-3 text-gold-500 fill-gold-500" title="Featured" />
                              )}
                            </div>
                            {p.productCode && (
                              <div className="text-[10px] font-mono text-chocolate-600">
                                #{p.productCode}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-medium text-chocolate-700">
                        {p.category?.name || '—'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-chocolate-900">
                        {formatPrice(p.price)}
                      </td>

                      {/* Availability Dropdown */}
                      <td className="py-3 px-4">
                        <select
                          value={p.availability}
                          onChange={(e) => handleToggleAvailability(p, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-lg border cursor-pointer focus:outline-none ${
                            p.availability === 'in_stock'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : p.availability === 'coming_soon'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <option value="in_stock">In Stock</option>
                          <option value="coming_soon">Coming Soon</option>
                          <option value="out_of_stock">Unavailable</option>
                        </select>
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleVisibility(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                            p.visibility
                              ? 'bg-champagne-200 text-chocolate-900'
                              : 'bg-gray-100 text-gray-500 line-through'
                          }`}
                          title={p.visibility ? 'Visible to public' : 'Hidden from public'}
                        >
                          {p.visibility ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3" />}
                          <span>{p.visibility ? 'Public' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setProductToEdit(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-chocolate-700 hover:text-chocolate-950 hover:bg-champagne-200"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidate(p)}
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-chocolate-600">
            No products match the selected criteria.
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-champagne-200 bg-champagne-50/50 flex items-center justify-between">
            <span className="text-[11px] text-chocolate-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded-lg border border-champagne-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded-lg border border-champagne-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        categories={categories}
        onSuccess={fetchProducts}
      />

      {/* Delete Confirmation Dialog */}
      {deleteCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chocolate-950/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setDeleteCandidate(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-champagne-300 space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-lg font-bold text-chocolate-950">
                Delete Product?
              </h3>
              <p className="text-xs text-chocolate-600 mt-1">
                Are you sure you want to remove <span className="font-bold text-chocolate-900">"{deleteCandidate.name}"</span>? This will remove the piece from the store catalogue.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl border border-champagne-300 text-chocolate-800 text-xs font-bold hover:bg-champagne-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
