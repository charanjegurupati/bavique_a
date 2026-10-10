import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, MapPin } from 'lucide-react';

export default function Navbar({ onSelectCategory, onScrollToSection, activeCategory }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories = [
    { name: 'All Products', slug: 'all' },
    { name: 'Hair Accessories', slug: 'hair-accessories' },
    { name: 'Makeup & Skincare', slug: 'makeup-and-skincare' },
    { name: 'Jewellery', slug: 'jewellery' },
    { name: 'Bags & Fancy Items', slug: 'bags-and-fancy-items' },
    { name: 'Dresses & Fashion', slug: 'dresses-and-fashion' },
  ];

  const handleNavClick = (slug) => {
    onSelectCategory(slug);
    setMobileMenuOpen(false);
    onScrollToSection('catalogue');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-sm py-2.5'
          : 'bg-ivory-100/90 backdrop-blur-md py-4 border-b border-champagne-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-0.5 bg-gradient-to-tr from-champagne-300 via-blush-200 to-gold-400 shadow-sm overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/logo-nav.webp"
                alt="BAVIQUE"
                className="w-full h-full object-cover rounded-[10px] bg-white"
              />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-chocolate-900 group-hover:text-rosegold-500 transition-colors">
                BAVIQUE
              </span>
              <span className="hidden sm:block text-[11px] font-sans tracking-widest text-chocolate-600 uppercase font-medium">
                Fancy · Beauty · Fashion
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-chocolate-700 hover:text-chocolate-950 hover:bg-champagne-200/50 transition-all"
            >
              Home
            </button>
            {navCategories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleNavClick(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-chocolate-900 text-champagne-100 shadow-sm'
                      : 'text-chocolate-700 hover:text-chocolate-950 hover:bg-champagne-200/50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
            <button
              onClick={() => onScrollToSection('store-info')}
              className="ml-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-chocolate-900 border border-gold-400/40 hover:bg-gold-300/20 transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-gold-600" />
              <span>Store Info</span>
            </button>
          </nav>

          {/* Medium Screen Nav (Categories Button + Store Info) */}
          <div className="hidden md:flex xl:hidden items-center gap-3">
            <button
              onClick={() => onScrollToSection('catalogue')}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-chocolate-900 text-champagne-100 hover:bg-chocolate-800 transition-all shadow-sm"
            >
              Browse Catalogue
            </button>
            <button
              onClick={() => onScrollToSection('store-info')}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-chocolate-800 border border-champagne-300 hover:bg-champagne-200/60 transition-all flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-chocolate-600" />
              <span>Visit Us</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onScrollToSection('store-info')}
              className="p-2 rounded-lg text-chocolate-700 hover:bg-champagne-200/50 transition-colors"
              title="Store Information"
            >
              <MapPin className="w-5 h-5 text-gold-600" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-chocolate-800 hover:bg-champagne-200/50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-champagne-300/80 px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
          <div className="space-y-1 pt-1">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-chocolate-900 hover:bg-champagne-200/60 transition-colors"
            >
              Home
            </button>
            <div className="pt-2 pb-1 border-t border-champagne-300/40">
              <span className="px-4 text-[10px] font-bold uppercase tracking-wider text-chocolate-600">
                Catalogue Categories
              </span>
            </div>
            {navCategories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleNavClick(cat.slug)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-chocolate-900 text-champagne-100 font-semibold'
                      : 'text-chocolate-800 hover:bg-champagne-200/60'
                  }`}
                >
                  <span>{cat.name}</span>
                  {isActive && <Sparkles className="w-3.5 h-3.5 text-gold-400" />}
                </button>
              );
            })}

            <div className="pt-3 border-t border-champagne-300/60 flex flex-col gap-2">
              <button
                onClick={() => {
                  onScrollToSection('store-info');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-center bg-champagne-200 text-chocolate-900 hover:bg-champagne-300 transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-chocolate-700" />
                <span>Store Address & Timings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
