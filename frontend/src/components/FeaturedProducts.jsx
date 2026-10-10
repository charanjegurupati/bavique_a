import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function FeaturedProducts({ products, onSelectProduct, onViewAll }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-rosegold-500 text-xs font-semibold uppercase tracking-wider mb-2 border border-white/85 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Boutique Highlights</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950 tracking-tight">
              Featured In Store
            </h2>
            <p className="text-chocolate-600 text-sm sm:text-base mt-1 max-w-xl">
              Curated by our boutique stylists — these statement pieces and essentials are drawing the most attention in-store this week.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="self-start md:self-auto px-5 py-2.5 rounded-full glass-btn-light text-chocolate-800 text-xs sm:text-sm font-semibold flex items-center gap-2 group"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-rosegold-500" />
          </button>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
