const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'BAVIQUE',
  },
  tagline: {
    type: String,
    default: "More than just a store… it's a vibe.",
  },
  subTagline: {
    type: String,
    default: 'Fancy, Beauty, Fashion',
  },
  phone: {
    type: String,
    default: '+91 98765 43210',
    trim: true,
  },
  whatsapp: {
    type: String,
    default: '+919876543210',
    trim: true,
  },
  email: {
    type: String,
    default: 'hello@bavique.com',
    trim: true,
  },
  address: {
    type: String,
    default: 'Bavique Boutique, Main High Street, Fashion Galleria, India',
    trim: true,
  },
  openingHours: {
    type: String,
    default: 'Mon - Sun: 10:30 AM - 9:30 PM',
    trim: true,
  },
  instagramHandle: {
    type: String,
    default: 'bavique_ff_',
    trim: true,
  },
  instagramUrl: {
    type: String,
    default: 'https://instagram.com/bavique_ff_',
    trim: true,
  },
  googleMapsUrl: {
    type: String,
    default: 'https://maps.google.com',
    trim: true,
  },
  announcementText: {
    type: String,
    default: '✨ Welcome to BAVIQUE! Visit our boutique store to explore our exclusive new sparkle collection.',
    trim: true,
  },
  announcementActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
