import React, { useState, useEffect, useCallback } from 'react';
import IntroVideo from '../components/IntroVideo';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import FeaturedProducts from '../components/FeaturedProducts';
import Catalogue from '../components/Catalogue';
import ProductDetailModal from '../components/ProductDetailModal';
import StoreInfo from '../components/StoreInfo';
import Footer from '../components/Footer';
import { api } from '../api/client';

export default function HomePage() {
  // Intro video display state
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('bavique_intro_seen');
      return !seen;
    }
    return false;
  });

  // Store data states
  const [storeSettings, setStoreSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Catalogue query states
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Initial load for settings, categories, featured products
  useEffect(() => {
    async function initData() {
      try {
        const [settingsRes, catsRes, featuredRes] = await Promise.all([
          api.getStoreSettings().catch(() => ({ data: null })),
          api.getCategories().catch(() => ({ data: [] })),
          api.getFeaturedProducts().catch(() => ({ data: [] })),
        ]);

        if (settingsRes?.data) setStoreSettings(settingsRes.data);
        if (catsRes?.data) setCategories(catsRes.data);
        if (featuredRes?.data) setFeaturedProducts(featuredRes.data);
      } catch (err) {
        console.error('Error initializing boutique store data:', err);
      }
    }
    initData();
  }, []);

  // Fetch catalogue products based on filter changes
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy,
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (activeCategory && activeCategory !== 'all') params.category = activeCategory;
      if (availability && availability !== 'all') params.availability = availability;

      if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-');
        if (min !== undefined) params.minPrice = min;
        if (max !== undefined) params.maxPrice = max;
      }

      const res = await api.getProducts(params);
      if (res.success) {
        setProducts(res.data || []);
        setTotalProducts(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load boutique catalogue:', err);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [currentPage, sortBy, searchTerm, activeCategory, availability, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handlers for scroll and navigation
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectCategory = (categorySlug) => {
    setActiveCategory(categorySlug);
    setCurrentPage(1);
    scrollToSection('catalogue');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategory('all');
    setAvailability('all');
    setPriceRange('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col selection:bg-blush-200 selection:text-chocolate-900 relative">
      {/* Ambient Glassmorphic Aurora Glow Spheres */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-champagne-300/45 to-blush-200/40 blur-[120px] animate-orb-1" />
        <div className="absolute top-1/3 -right-20 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-blush-200/40 to-rosegold-300/30 blur-[140px] animate-orb-2" />
        <div className="absolute top-2/3 -left-32 w-[560px] h-[560px] rounded-full bg-gradient-to-tr from-gold-300/30 to-champagne-200/40 blur-[130px] animate-orb-3" />
        <div className="absolute bottom-10 right-1/4 w-[480px] h-[480px] rounded-full bg-gradient-to-bl from-rosegold-300/30 to-blush-100/40 blur-[120px] animate-orb-1" />
      </div>

      {/* Cinematic Intro Video Sequence */}
      {showIntro && (
        <IntroVideo
          onComplete={() => setShowIntro(false)}
          forceOpen={false}
        />
      )}

      {/* Main Boutique Navbar */}
      <Navbar
        onSelectCategory={handleSelectCategory}
        onScrollToSection={scrollToSection}
        activeCategory={activeCategory}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          onExploreCollection={() => scrollToSection('catalogue')}
          onBrowseCategories={() => scrollToSection('categories')}
          onWatchIntroVideo={() => setShowIntro(true)}
        />

        {/* Categories Grid */}
        <CategorySection
          categories={categories}
          onSelectCategory={handleSelectCategory}
          activeCategory={activeCategory}
        />

        {/* Featured Products */}
        <FeaturedProducts
          products={featuredProducts}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onViewAll={() => scrollToSection('catalogue')}
        />

        {/* Complete Catalogue Section */}
        <Catalogue
          products={products}
          total={totalProducts}
          totalPages={totalPages}
          currentPage={currentPage}
          categories={categories}
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          activeCategory={activeCategory}
          onCategoryChange={(cat) => {
            setActiveCategory(cat);
            setCurrentPage(1);
          }}
          availability={availability}
          onAvailabilityChange={(avail) => {
            setAvailability(avail);
            setCurrentPage(1);
          }}
          priceRange={priceRange}
          onPriceRangeChange={(pr) => {
            setPriceRange(pr);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={(sort) => {
            setSortBy(sort);
            setCurrentPage(1);
          }}
          onPageChange={(page) => {
            setCurrentPage(page);
            scrollToSection('catalogue');
          }}
          onResetFilters={handleResetFilters}
          onSelectProduct={(p) => setSelectedProduct(p)}
          isLoading={isLoadingProducts}
        />

        {/* Physical Store & Directions */}
        <StoreInfo storeSettings={storeSettings} />
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          storeSettings={storeSettings}
        />
      )}

      {/* Boutique Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onScrollToSection={scrollToSection}
        storeSettings={storeSettings}
      />
    </div>
  );
}
