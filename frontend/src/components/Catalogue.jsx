import React, { useState } from 'react';
import { Search, Filter, RotateCcw, Sparkles, ChevronDown, Check } from 'lucide-react';
import ProductCard from './ProductCard';

export default function Catalogue({
  products,
  total,
  totalPages,
  currentPage,
  categories,
  searchTerm,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  availability,
  onAvailabilityChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  onPageChange,
  onResetFilters,
  onSelectProduct,
  isLoading,
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const priceOptions = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹1,500', value: '500-1500' },
    { label: '₹1,500 - ₹3,000', value: '1500-3000' },
    { label: 'Above ₹3,000', value: '3000-999999' },
  ];

  const availabilityOptions = [
    { label: 'All Availability', value: 'all' },
    { label: 'In Stock Only', value: 'in_stock' },
    { label: 'Coming Soon', value: 'coming_soon' },
    { label: 'Include Unavailable', value: 'out_of_stock' },
  ];

  const sortOptions = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Product Name (A-Z)', value: 'name_asc' },
    { label: 'Product Name (Z-A)', value: 'name_desc' },
  ];

  const hasActiveFilters =
    searchTerm !== '' ||
    activeCategory !== 'all' ||
    availability !== 'all' ||
    priceRange !== 'all';

  return (
    <section id="catalogue" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-rosegold-500 text-xs font-semibold uppercase tracking-wider mb-3 border border-white/85 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>Complete Boutique Catalogue</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950 tracking-tight">
            Explore All Creations
          </h2>
          <p className="text-chocolate-600 text-sm sm:text-base mt-2">
            Every piece is displayed with real in-store availability and pricing.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel rounded-3xl p-5 sm:p-7 mb-8 border border-white/80 shadow-lg">
          {/* Top Row: Search and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 text-chocolate-600 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search accessories by name, code (e.g. #HA-PRL), or style..."
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-chocolate-900 placeholder:text-chocolate-600 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-chocolate-600 hover:text-chocolate-900"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4 flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-semibold text-chocolate-600 whitespace-nowrap">
                Sort By:
              </label>
              <div className="relative w-full">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full appearance-none pl-3.5 pr-8 py-3 rounded-xl glass-input text-sm text-chocolate-900 font-medium focus:outline-none focus:ring-2 focus:ring-gold-400 cursor-pointer shadow-xs"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-chocolate-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-4 pt-4 border-t border-champagne-200/60 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-chocolate-600 mr-1 hidden sm:inline">
                Categories:
              </span>
              <button
                type="button"
                onClick={() => onCategoryChange('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === 'all'
                    ? 'bg-chocolate-900 text-champagne-100 shadow-sm'
                    : 'glass-pill hover:bg-white text-chocolate-800 border border-white/80'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.slug;
                return (
                  <button
                    key={cat._id || cat.slug}
                    type="button"
                    onClick={() => onCategoryChange(cat.slug)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-chocolate-900 text-champagne-100 shadow-sm'
                        : 'glass-pill hover:bg-white text-chocolate-800 border border-white/80'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="flex sm:hidden w-full pt-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="w-full py-2 px-3 rounded-lg glass-pill text-chocolate-900 text-xs font-semibold flex items-center justify-center gap-2 border border-white/80"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{mobileFiltersOpen ? 'Hide Price & Stock Filters' : 'More Filters (Price & Stock)'}</span>
              </button>
            </div>
          </div>

          {/* Secondary Filter Row: Price and Availability */}
          <div className={`mt-4 pt-4 border-t border-champagne-200/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center ${mobileFiltersOpen ? 'block' : 'hidden sm:grid'}`}>
            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-chocolate-600 whitespace-nowrap">Price:</span>
              <div className="relative w-full">
                <select
                  value={priceRange}
                  onChange={(e) => onPriceRangeChange(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg glass-input text-xs text-chocolate-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-400 cursor-pointer"
                >
                  {priceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-chocolate-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Availability Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-chocolate-600 whitespace-nowrap">Availability:</span>
              <div className="relative w-full">
                <select
                  value={availability}
                  onChange={(e) => onAvailabilityChange(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg glass-input text-xs text-chocolate-900 font-medium focus:outline-none focus:ring-1 focus:ring-gold-400 cursor-pointer"
                >
                  {availabilityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-chocolate-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Reset Filters Action */}
            <div className="flex justify-end">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-xs font-semibold text-rosegold-600 hover:text-chocolate-900 flex items-center gap-1 py-1 px-2.5 rounded hover:bg-champagne-200/50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs sm:text-sm text-chocolate-600 font-medium">
            Showing <span className="font-bold text-chocolate-900">{products.length}</span> of{' '}
            <span className="font-bold text-chocolate-900">{total}</span> items in catalogue
          </p>
        </div>

        {/* Product Grid / Loading / Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden glass-card h-80 shimmer-bg border border-champagne-200/60"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 glass-panel rounded-3xl max-w-lg mx-auto border border-champagne-300">
            <div className="w-16 h-16 rounded-full bg-champagne-200 text-rosegold-500 mx-auto flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-chocolate-900 mb-2">
              No Pieces Found
            </h3>
            <p className="text-chocolate-600 text-sm mb-6 max-w-md mx-auto">
              We couldn't find any products matching your selected search or filters. Try adjusting your criteria or reset all filters.
            </p>
            <button
              onClick={onResetFilters}
              className="px-6 py-2.5 rounded-full bg-chocolate-900 text-champagne-100 text-sm font-semibold hover:bg-chocolate-800 transition-colors shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 rounded-xl text-xs font-semibold glass-btn-light text-chocolate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-chocolate-900 text-champagne-100 shadow-sm'
                      : 'glass-btn-light text-chocolate-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 rounded-xl text-xs font-semibold glass-btn-light text-chocolate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
