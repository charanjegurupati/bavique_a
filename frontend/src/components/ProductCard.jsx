import React from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { getAssetUrl } from '../api/client';

export default function ProductCard({ product, onSelectProduct }) {
  // Format price in Indian Rupees (₹)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Primary image fallback
  const rawImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.isPrimary)?.url || product.images[0].url
      : 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&auto=format&fit=crop&q=80';
  const primaryImage = getAssetUrl(rawImage);

  // Availability badge configuration
  const getAvailabilityBadge = () => {
    switch (product.availability) {
      case 'in_stock':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold tracking-wide flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            In Stock
          </span>
        );
      case 'coming_soon':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-semibold tracking-wide flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Coming Soon
          </span>
        );
      case 'out_of_stock':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-[11px] font-semibold tracking-wide shadow-xs">
            Currently Unavailable
          </span>
        );
    }
  };

  const categoryName = product.category?.name || 'Accessories';

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group cursor-pointer rounded-2xl overflow-hidden glass-card flex flex-col justify-between transition-all duration-300 relative border border-white/80"
    >
      {/* Image Thumbnail with Overlay */}
      <div className="relative aspect-square overflow-hidden bg-champagne-100">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured Tag */}
        {product.featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-gold-500 to-rosegold-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-champagne-100" />
            <span>Featured</span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-chocolate-950/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            type="button"
            className="px-4 py-2 rounded-full glass-modal text-chocolate-950 text-xs font-bold shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all hover:scale-105 border border-white/90"
          >
            <Eye className="w-3.5 h-3.5 text-rosegold-500" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rosegold-600 truncate">
              {categoryName}
            </span>
            {getAvailabilityBadge()}
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-950 group-hover:text-rosegold-500 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description if provided */}
          {product.shortDescription && (
            <p className="text-xs text-chocolate-600 line-clamp-2 mt-1 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price & Code Footer */}
        <div className="mt-4 pt-3 border-t border-champagne-200/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-chocolate-600 uppercase tracking-widest block font-medium">
              In-Store Price
            </span>
            <span className="font-serif text-lg sm:text-xl font-bold text-chocolate-950">
              {formatPrice(product.price)}
            </span>
          </div>

          {product.productCode ? (
            <span className="text-[10px] font-mono text-chocolate-700 glass-pill px-2.5 py-0.5 rounded-full border border-champagne-300/80">
              #{product.productCode}
            </span>
          ) : (
            <span className="text-xs font-semibold text-rosegold-500 group-hover:underline">
              View
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
