import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getAssetUrl } from '../../api/client';
import {
  Package,
  CheckCircle,
  AlertCircle,
  Layers,
  Plus,
  ArrowRight,
  Eye,
} from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.getAdminStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  if (loading) {
    return (
      <div className="py-12 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-chocolate-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-chocolate-600">Loading store metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
            Catalogue Overview
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
            Real-time status of your in-store accessories, beauty inventory, and categories.
          </p>
        </div>

        <Link
          to="/admin/products?action=new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-chocolate-900 hover:bg-chocolate-800 text-champagne-100 text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-chocolate-600">
              Total Products
            </span>
            <div className="w-9 h-9 rounded-xl glass-pill text-chocolate-900 flex items-center justify-center border border-white/80 shadow-xs">
              <Package className="w-4 h-4 text-chocolate-800" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-chocolate-950 mt-3">
            {stats?.totalProducts ?? 0}
          </div>
          <div className="text-[11px] text-chocolate-600 mt-1">
            Registered in database
          </div>
        </div>

        {/* In Stock Products */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              In Stock
            </span>
            <div className="w-9 h-9 rounded-xl glass-pill text-emerald-800 flex items-center justify-center border border-white/80 shadow-xs">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-950 mt-3">
            {stats?.availableProducts ?? 0}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            Available for purchase in store
          </div>
        </div>

        {/* Unavailable Products */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Unavailable
            </span>
            <div className="w-9 h-9 rounded-xl glass-pill text-rose-800 flex items-center justify-center border border-white/80 shadow-xs">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-rose-950 mt-3">
            {stats?.unavailableProducts ?? 0}
          </div>
          <div className="text-[11px] text-rose-700 mt-1">
            Marked out of stock
          </div>
        </div>

        {/* Total Categories */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rosegold-700">
              Categories
            </span>
            <div className="w-9 h-9 rounded-xl glass-pill text-rosegold-700 flex items-center justify-center border border-white/80 shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-chocolate-950 mt-3">
            {stats?.totalCategories ?? 0}
          </div>
          <div className="text-[11px] text-chocolate-600 mt-1">
            Active store collections
          </div>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/85 shadow-md space-y-4">
        <h3 className="font-serif text-lg font-bold text-chocolate-950">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/products"
            className="p-4 rounded-2xl glass-panel hover:bg-white border border-champagne-200/80 transition-all group flex items-center justify-between shadow-xs"
          >
            <div>
              <div className="text-xs font-bold text-chocolate-900 group-hover:text-rosegold-600 transition-colors">
                Manage Products
              </div>
              <div className="text-[11px] text-chocolate-600 mt-0.5">
                Edit prices, change stock & photos
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-chocolate-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/admin/categories"
            className="p-4 rounded-2xl glass-panel hover:bg-white border border-champagne-200/80 transition-all group flex items-center justify-between shadow-xs"
          >
            <div>
              <div className="text-xs font-bold text-chocolate-900 group-hover:text-rosegold-600 transition-colors">
                Store Categories
              </div>
              <div className="text-[11px] text-chocolate-600 mt-0.5">
                Organize hair, beauty & jewellery
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-chocolate-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/admin/settings"
            className="p-4 rounded-2xl glass-panel hover:bg-white border border-champagne-200/80 transition-all group flex items-center justify-between shadow-xs"
          >
            <div>
              <div className="text-xs font-bold text-chocolate-900 group-hover:text-rosegold-600 transition-colors">
                Store Settings
              </div>
              <div className="text-[11px] text-chocolate-600 mt-0.5">
                Update address, hours & Instagram
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-chocolate-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Recently Updated Products */}
      {stats?.recentProducts && stats.recentProducts.length > 0 && (
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/85 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-chocolate-950">
              Recently Updated In Boutique
            </h3>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-rosegold-600 hover:text-chocolate-950 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-champagne-200/70">
            {stats.recentProducts.map((p) => {
              const rawImg = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=200&auto=format&fit=crop&q=80';
              const img = getAssetUrl(rawImg);
              return (
                <div key={p._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={img}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover bg-champagne-100 border border-champagne-200 shadow-xs"
                    />
                    <div>
                      <div className="font-serif text-sm font-bold text-chocolate-900">
                        {p.name}
                      </div>
                      <div className="text-xs text-chocolate-600 mt-0.5">
                        {p.category?.name || 'Accessories'} · {formatPrice(p.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.availability === 'in_stock'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.availability === 'coming_soon'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {p.availability.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => navigate(`/admin/products?edit=${p._id}`)}
                      className="p-1.5 rounded-lg text-chocolate-600 hover:text-chocolate-900 hover:bg-champagne-100/80 transition-colors"
                      title="Edit this product"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
