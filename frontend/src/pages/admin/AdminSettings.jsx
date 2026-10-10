import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  Settings,
  Store,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import InstagramIcon from '../../components/InstagramIcon';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [storeName, setStoreName] = useState('BAVIQUE');
  const [tagline, setTagline] = useState("More than just a store… it's a vibe.");
  const [subTagline, setSubTagline] = useState('Fancy, Beauty, Fashion');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [whatsapp, setWhatsapp] = useState('+919876543210');
  const [email, setEmail] = useState('hello@bavique.com');
  const [address, setAddress] = useState('Bavique Boutique, Main High Street, Fashion Galleria, India');
  const [openingHours, setOpeningHours] = useState('Mon - Sun: 10:30 AM - 9:30 PM');
  const [instagramHandle, setInstagramHandle] = useState('bavique_ff_');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/bavique_ff_');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('https://maps.google.com');
  const [announcementText, setAnnouncementText] = useState('✨ Welcome to BAVIQUE! Visit our boutique store to explore our exclusive new sparkle collection.');
  const [announcementActive, setAnnouncementActive] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.getStoreSettings();
        if (res.success && res.data) {
          const d = res.data;
          setStoreName(d.storeName || 'BAVIQUE');
          setTagline(d.tagline || '');
          setSubTagline(d.subTagline || '');
          setPhone(d.phone || '');
          setWhatsapp(d.whatsapp || '');
          setEmail(d.email || '');
          setAddress(d.address || '');
          setOpeningHours(d.openingHours || '');
          setInstagramHandle(d.instagramHandle || 'bavique_ff_');
          setInstagramUrl(d.instagramUrl || '');
          setGoogleMapsUrl(d.googleMapsUrl || '');
          setAnnouncementText(d.announcementText || '');
          setAnnouncementActive(d.announcementActive !== false);
        }
      } catch (err) {
        console.error('Failed to load store settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setSaving(true);

    try {
      const payload = {
        storeName: storeName.trim(),
        tagline: tagline.trim(),
        subTagline: subTagline.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        address: address.trim(),
        openingHours: openingHours.trim(),
        instagramHandle: instagramHandle.trim().replace(/^@/, ''),
        instagramUrl: instagramUrl.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        announcementText: announcementText.trim(),
        announcementActive,
      };

      const res = await api.updateStoreSettings(payload);
      if (res.success) {
        setSuccessMessage('Store settings updated successfully! Changes are live on your boutique website.');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update store settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs font-semibold text-chocolate-600 space-y-2">
        <div className="w-6 h-6 border-2 border-chocolate-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <span>Loading store settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
          Store Information & Settings
        </h1>
        <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
          Update the boutique contact details, address, Instagram profile, and opening timings displayed to customers.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 animate-fadeIn font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2.5 animate-fadeIn font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card: Settings Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/85 shadow-md space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-champagne-200">
            <Store className="w-5 h-5 text-gold-600" />
            <h2 className="font-serif text-lg font-bold text-chocolate-950">
              Brand Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                Store Brand Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                Sub-Tagline
              </label>
              <input
                type="text"
                value={subTagline}
                onChange={(e) => setSubTagline(e.target.value)}
                placeholder="Fancy, Beauty, Fashion"
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
              Official Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="More than just a store… it's a vibe."
              className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
        </div>

        {/* Card 2: Contact & Social */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/85 shadow-md space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-champagne-200">
            <InstagramIcon className="w-5 h-5 text-rosegold-500" />
            <h2 className="font-serif text-lg font-bold text-chocolate-950">
              Contact & Social Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                Calling Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-chocolate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                WhatsApp Inquiry Number
              </label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+919876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                Contact Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-chocolate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@bavique.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                Instagram Handle (From Brand Logo)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-chocolate-500 font-bold text-xs">
                  @
                </span>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="bavique_ff_"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Physical Address & Timings */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/85 shadow-md space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-champagne-200">
            <MapPin className="w-5 h-5 text-gold-600" />
            <h2 className="font-serif text-lg font-bold text-chocolate-950">
              Location & Visiting Hours
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
              Physical Boutique Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Store street, landmark, city, state"
              className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                Opening Hours
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Mon - Sun: 10:30 AM - 9:30 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                Google Maps Navigation Link
              </label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-full bg-chocolate-900 hover:bg-chocolate-800 text-champagne-100 text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
