import React from 'react';
import { MapPin, Clock, Phone, Navigation, Sparkles } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function StoreInfo({ storeSettings }) {
  const address = storeSettings?.address || 'Bavique Boutique, Main High Street, Fashion Galleria, India';
  const hours = storeSettings?.openingHours || 'Mon - Sun: 10:30 AM - 9:30 PM';
  const phone = storeSettings?.phone || '+91 98765 43210';
  const email = storeSettings?.email || 'hello@bavique.com';
  const instagramHandle = storeSettings?.instagramHandle || 'bavique_ff_';
  const instagramUrl = storeSettings?.instagramUrl || `https://instagram.com/${instagramHandle}`;
  const mapsUrl = storeSettings?.googleMapsUrl || 'https://maps.google.com';

  return (
    <section id="store-info" className="py-16 sm:py-24 relative overflow-hidden border-t border-champagne-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-chocolate-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-white/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>Physical Store Boutique</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950 tracking-tight">
            Visit Our Boutique Store
          </h2>
          <p className="text-chocolate-600 text-sm sm:text-base mt-2">
            Step into our warm, curated boutique and experience every accessory, beauty formula, and fashion piece up close.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Address */}
          <div className="glass-card p-6 rounded-3xl border border-white/80 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl glass-pill text-chocolate-900 flex items-center justify-center border border-white/80 shadow-xs">
                <MapPin className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-chocolate-900">Store Location</h3>
              <p className="text-xs sm:text-sm text-chocolate-700 leading-relaxed">
                {address}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-champagne-200/80">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rosegold-600 hover:text-chocolate-950 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Card 2: Hours */}
          <div className="glass-card p-6 rounded-3xl border border-white/80 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl glass-pill text-chocolate-900 flex items-center justify-center border border-white/80 shadow-xs">
                <Clock className="w-5 h-5 text-rosegold-500" />
              </div>
              <h3 className="font-serif text-lg font-bold text-chocolate-900">Opening Hours</h3>
              <p className="text-xs sm:text-sm text-chocolate-700 leading-relaxed whitespace-pre-line">
                {hours}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-champagne-200/80">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open Every Day
              </span>
            </div>
          </div>

          {/* Card 3: Phone & Contact */}
          <div className="glass-card p-6 rounded-3xl border border-white/80 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl glass-pill text-chocolate-900 flex items-center justify-center border border-white/80 shadow-xs">
                <Phone className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-chocolate-900">Direct Inquiries</h3>
              <p className="text-xs sm:text-sm text-chocolate-700 leading-relaxed">
                Call: <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-semibold text-chocolate-900 hover:underline">{phone}</a><br />
                Email: <a href={`mailto:${email}`} className="font-semibold text-chocolate-900 hover:underline">{email}</a>
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-champagne-200/80">
              <span className="text-[11px] text-chocolate-600 italic">
                Store assistance during opening hours
              </span>
            </div>
          </div>

          {/* Card 4: Official Instagram */}
          <div className="glass-card p-6 rounded-3xl border border-white/80 flex flex-col justify-between glass-blush">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl glass-pill text-rosegold-500 shadow-sm flex items-center justify-center border border-white/80">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-chocolate-900">Follow Our Vibe</h3>
              <p className="text-xs sm:text-sm text-chocolate-700 leading-relaxed">
                Stay updated with daily in-store arrivals, unboxings, and styling reels.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-champagne-200/80">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass-btn-dark text-champagne-100 text-xs font-semibold hover:scale-105 transition-all"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@{instagramHandle}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
