import React, { useState, useEffect } from 'react';
import { X, Sparkles, MapPin, Phone, MessageCircle, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { getAssetUrl } from '../api/client';

export default function ProductDetailModal({ product, onClose, storeSettings }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    // ESC key listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images.map((img) => ({ ...img, url: getAssetUrl(img.url) }))
    : [{ url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=1000&auto=format&fit=crop&q=80', alt: product.name }];

  const currentImage = images[activeImageIndex] || images[0];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // WhatsApp inquiry URL generator
  const getWhatsAppUrl = () => {
    const rawNumber = storeSettings?.whatsapp || '+919876543210';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hi BAVIQUE! ✨ I saw "${product.name}"${product.productCode ? ` (Code: #${product.productCode})` : ''} on your online catalogue. Is it currently available at the boutique for viewing/purchase?`
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  const getPhoneUrl = () => {
    const phone = storeSettings?.phone || '+919876543210';
    return `tel:${phone.replace(/\s+/g, '')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-chocolate-950/50 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl glass-modal rounded-3xl shadow-2xl border border-white/90 overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full glass-pill hover:bg-white text-chocolate-800 shadow-md border border-white/80 transition-transform hover:scale-110"
          aria-label="Close product details dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images Gallery */}
        <div className="md:w-1/2 bg-champagne-50/40 backdrop-blur-md p-5 sm:p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-champagne-200/80">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-inner border border-champagne-300/60">
            <img
              src={currentImage.url}
              alt={currentImage.alt || product.name}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-gold-500 to-rosegold-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                Featured Piece
              </div>
            )}
          </div>

          {/* Thumbnail Strip (if multiple photos) */}
          {images.length > 1 && (
            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-gold-500 shadow-sm scale-105'
                      : 'border-champagne-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & In-Store Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Category & Availability Pill */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-rosegold-500">
                {product.category?.name || 'Accessories'}
              </span>

              {product.availability === 'in_stock' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Available In Boutique
                </span>
              )}
              {product.availability === 'coming_soon' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Arriving Soon
                </span>
              )}
              {product.availability === 'out_of_stock' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Currently Unavailable
                </span>
              )}
            </div>

            {/* Product Title */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950 leading-snug">
              {product.name}
            </h2>

            {/* Product Code if available */}
            {product.productCode && (
              <div className="text-xs text-chocolate-600 font-mono">
                Store Article Code: <span className="font-bold text-chocolate-900">#{product.productCode}</span>
              </div>
            )}

            {/* In-Store Price */}
            <div className="p-4 rounded-2xl glass-panel border border-white/70 shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-chocolate-600 block">
                Boutique Price
              </span>
              <div className="font-serif text-3xl font-bold text-chocolate-950 mt-0.5">
                {formatPrice(product.price)}
              </div>
              <span className="text-[11px] text-chocolate-600 italic block mt-1">
                *Taxes included where applicable. Offline purchase in store.
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                About this piece
              </h4>
              <p className="text-sm text-chocolate-700 leading-relaxed whitespace-pre-line">
                {product.description || product.shortDescription || 'Experience the luxurious finish and texture of this piece in person at our physical store.'}
              </p>
            </div>
          </div>

          {/* Offline In-Store Purchase CTAs (Strictly no online shopping cart) */}
          <div className="mt-8 pt-6 border-t border-champagne-200 space-y-3">
            <div className="text-xs font-semibold text-chocolate-600 flex items-center gap-1.5 mb-1">
              <Info className="w-3.5 h-3.5 text-gold-600" />
              <span>Available for physical pickup & viewing:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Inquire on WhatsApp</span>
              </a>

              <a
                href={getPhoneUrl()}
                className="py-3 px-4 rounded-xl glass-btn-light text-chocolate-900 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-chocolate-700" />
                <span>Call Boutique</span>
              </a>
            </div>

            <a
              href={storeSettings?.googleMapsUrl || 'https://maps.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl glass-btn-light text-chocolate-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-chocolate-700" />
              <span>Visit Store to Purchase (Get Directions)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
