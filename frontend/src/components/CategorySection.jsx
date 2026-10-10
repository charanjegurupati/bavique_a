import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CategorySection({ categories, onSelectCategory, activeCategory }) {
  // Default visual cards matching the 5 core brand categories if API is loading
  const defaultCategories = [
    {
      _id: '1',
      name: 'Hair Accessories',
      slug: 'hair-accessories',
      description: 'Handcrafted clips, crystal hairpins, silk scrunchies & pearl headbands.',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop&q=80',
    },
    {
      _id: '2',
      name: 'Makeup & Skincare',
      slug: 'makeup-and-skincare',
      description: 'Luminous tints, rose mists, velvet lipsticks & beauty essentials.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    },
    {
      _id: '3',
      name: 'Jewellery',
      slug: 'jewellery',
      description: 'Rose-gold necklaces, cubic zirconia hoops & delicate statement bracelets.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    },
    {
      _id: '4',
      name: 'Bags & Fancy Items',
      slug: 'bags-and-fancy-items',
      description: 'Chic chain clutches, mini cosmetic totes & cute vanity collectibles.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    },
    {
      _id: '5',
      name: 'Dresses & Fashion',
      slug: 'dresses-and-fashion',
      description: 'Graceful slip midi dresses, flutter sleeve wraps & boutique partywear.',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const list = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <section id="categories" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-rosegold-500 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs border border-white/80">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>Curated Boutique Aisles</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950 tracking-tight">
            Browse By Category
          </h2>
          <p className="text-chocolate-600 text-sm sm:text-base mt-2">
            Click any collection to instantly view the items available at our physical store.
          </p>
        </div>

        {/* 5 Cards Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {list.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            return (
              <div
                key={cat._id || cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group cursor-pointer rounded-2xl overflow-hidden glass-card flex flex-col transition-all duration-300 relative border border-white/80 ${
                  isSelected
                    ? 'ring-2 ring-gold-500 shadow-lg -translate-y-1 bg-white/90'
                    : 'hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                {/* Image Container with Zoom */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-champagne-100">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/70 via-chocolate-950/20 to-transparent" />
                  
                  {isSelected && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gold-500 text-chocolate-950 text-[10px] font-bold uppercase tracking-wider shadow">
                      Active Filter
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif text-lg font-bold leading-snug drop-shadow-sm">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white/40 backdrop-blur-md">
                  <p className="text-xs text-chocolate-600 line-clamp-2 leading-relaxed">
                    {cat.description || `Explore ${cat.name} in boutique.`}
                  </p>
                  <div className="mt-3 pt-3 border-t border-champagne-200/60 flex items-center justify-between text-xs font-semibold text-rosegold-500 group-hover:text-chocolate-900 transition-colors">
                    <span>Explore Products</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
