import React from 'react';
import { Sparkles, ArrowDown, Play, Heart, Compass } from 'lucide-react';

export default function Hero({ onExploreCollection, onBrowseCategories, onWatchIntroVideo }) {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-champagne-300/40 blur-3xl" />
        <div className="absolute top-1/4 right-10 w-[450px] h-[450px] rounded-full bg-blush-200/35 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-gold-300/25 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-chocolate-800 border border-white/90 shadow-sm">
              <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-semibold text-chocolate-800">
                In-Store Boutique Collection
              </span>
            </div>

            {/* Main Editorial Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-chocolate-950 font-bold tracking-tight leading-[1.15]">
              Discover Your <br />
              <span className="italic font-normal font-serif rose-gradient-text">
                Everyday Sparkle
              </span>
            </h1>

            {/* Tagline & Supporting Copy */}
            <div className="space-y-2 max-w-2xl mx-auto lg:mx-0">
              <p className="font-serif italic text-lg sm:text-xl text-rosegold-500 font-medium">
                “More than just a store… it's a vibe.”
              </p>
              <p className="text-chocolate-700 text-base sm:text-lg leading-relaxed font-normal">
                From pretty little accessories and luxury hairpins to beauty essentials and timeless fashion favourites, explore our in-store catalogue and find what feels uniquely you.
              </p>
            </div>

            {/* Buttons & Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={onExploreCollection}
                className="px-7 py-3.5 rounded-full glass-btn-dark text-champagne-50 text-sm sm:text-base font-medium flex items-center gap-2.5 group"
              >
                <span>Explore Collection</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-gold-400" />
              </button>

              <button
                type="button"
                onClick={onBrowseCategories}
                className="px-7 py-3.5 rounded-full glass-btn-light text-chocolate-900 text-sm sm:text-base font-semibold flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-chocolate-700" />
                <span>Browse Categories</span>
              </button>

              <button
                type="button"
                onClick={onWatchIntroVideo}
                className="px-5 py-3 rounded-full glass-pill text-chocolate-800 hover:text-chocolate-950 text-sm font-semibold transition-all flex items-center gap-2 border border-white/80"
                title="Watch boutique brand introduction reel"
              >
                <div className="w-7 h-7 rounded-full bg-champagne-200/80 flex items-center justify-center text-chocolate-900">
                  <Play className="w-3.5 h-3.5 fill-current translate-x-0.5 text-gold-600" />
                </div>
                <span>Brand Reel</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
              <div className="glass-pill p-3 rounded-2xl text-center border border-white/85 shadow-xs">
                <div className="font-serif text-2xl font-bold text-chocolate-900">5+</div>
                <div className="text-[11px] text-chocolate-600 font-medium mt-0.5">Core Categories</div>
              </div>
              <div className="glass-pill p-3 rounded-2xl text-center border border-white/85 shadow-xs">
                <div className="font-serif text-2xl font-bold text-chocolate-900">100%</div>
                <div className="text-[11px] text-chocolate-600 font-medium mt-0.5">Curated Boutique</div>
              </div>
              <div className="glass-pill p-3 rounded-2xl text-center border border-white/85 shadow-xs">
                <div className="font-serif text-2xl font-bold text-chocolate-900">7 Days</div>
                <div className="text-[11px] text-chocolate-600 font-medium mt-0.5">Open For Visit</div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-champagne-300 via-blush-200 to-gold-400/40 opacity-70 blur-xl transform -rotate-2" />

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=1000&auto=format&fit=crop&q=80"
                  alt="BAVIQUE Luxury Accessories"
                  className="w-full h-[400px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Glass Floating Badge on Image */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 rounded-2xl border border-white/60 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-rosegold-500 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                        <span>Exclusive In-Store</span>
                      </div>
                      <div className="font-serif text-base sm:text-lg font-bold text-chocolate-900 mt-0.5">
                        Handpicked Jewellery & Hairpins
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-champagne-200/80 flex items-center justify-center flex-shrink-0 text-chocolate-900">
                      <Heart className="w-5 h-5 text-rosegold-500 fill-rosegold-500/20" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating aesthetic stamp */}
              <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full glass-panel border border-gold-400/40 flex flex-col items-center justify-center shadow-lg transform rotate-6 animate-float pointer-events-none">
                <span className="text-[10px] tracking-widest uppercase font-bold text-chocolate-700">BAVIQUE</span>
                <span className="font-serif italic text-xs font-semibold text-gold-600">Vibe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
