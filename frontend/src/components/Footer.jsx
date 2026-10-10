import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Lock, Heart, ShieldCheck } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Footer({ onSelectCategory, onScrollToSection, storeSettings }) {
  const instagramHandle = storeSettings?.instagramHandle || 'bavique_ff_';
  const instagramUrl = storeSettings?.instagramUrl || `https://instagram.com/${instagramHandle}`;

  const navCategories = [
    { name: 'Hair Accessories', slug: 'hair-accessories' },
    { name: 'Makeup & Skincare', slug: 'makeup-and-skincare' },
    { name: 'Jewellery', slug: 'jewellery' },
    { name: 'Bags & Fancy Items', slug: 'bags-and-fancy-items' },
    { name: 'Dresses & Fashion', slug: 'dresses-and-fashion' },
  ];

  return (
    <footer className="bg-chocolate-950 text-champagne-100 pt-16 pb-12 relative overflow-hidden border-t border-chocolate-800">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gold-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-chocolate-800">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl p-0.5 bg-gradient-to-tr from-champagne-300 via-blush-200 to-gold-400 shadow overflow-hidden flex-shrink-0">
                <img
                  src="/logo-nav.webp"
                  alt="BAVIQUE"
                  className="w-full h-full object-cover rounded-[10px] bg-white"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-champagne-50">
                  BAVIQUE
                </span>
                <span className="block text-[10px] tracking-widest text-champagne-400 uppercase font-medium">
                  Fancy · Beauty · Fashion
                </span>
              </div>
            </div>

            <p className="font-serif italic text-rosegold-400 text-sm">
              “More than just a store… it's a vibe.”
            </p>

            <p className="text-xs sm:text-sm text-champagne-300 leading-relaxed max-w-sm">
              Your destination for handcrafted hair clips, luminous cosmetics, luxury jewellery, and chic boutique fashion. Explore our catalogue online and visit our physical boutique store in person.
            </p>

            <div className="pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chocolate-900 hover:bg-chocolate-800 text-xs text-champagne-100 font-semibold border border-chocolate-700 transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-rosegold-400" />
                <span>Follow @{instagramHandle}</span>
              </a>
            </div>
          </div>

          {/* Quick Categories Navigation */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">
              Boutique Collections
            </h4>
            <ul className="space-y-2">
              {navCategories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.slug);
                      onScrollToSection('catalogue');
                    }}
                    className="text-xs sm:text-sm text-champagne-300 hover:text-champagne-50 transition-colors hover:translate-x-1 transform inline-block"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit & Inquiries */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">
              In-Store Experience
            </h4>
            <p className="text-xs text-champagne-300 leading-relaxed">
              Open 7 days a week for in-person shopping, styling advice, and bridal accessories consultation.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onScrollToSection('store-info')}
                className="text-xs text-rosegold-400 hover:text-champagne-100 font-semibold underline underline-offset-4"
              >
                View Directions & Timings
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Discreet Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-champagne-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} BAVIQUE. All rights reserved.</span>
            <span>·</span>
            <span className="italic text-champagne-400">Physical store catalogue only</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Discreet Admin Login Link */}
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-champagne-400 hover:text-champagne-200 transition-colors text-[11px] font-medium"
              title="Store Owner & Staff Login"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
