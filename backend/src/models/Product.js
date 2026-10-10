const mongoose = require('mongoose');
const slugify = require('slugify');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  publicId: {
    type: String,
    default: '',
  },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [150, 'Product name cannot exceed 150 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters'],
    default: '',
  },
  description: {
    type: String,
    trim: true,
    maxlength: [3000, 'Description cannot exceed 3000 characters'],
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a non-negative number'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
    index: true,
  },
  images: {
    type: [imageSchema],
    default: [],
    validate: [
      (val) => val.length <= 8,
      'Maximum 8 images permitted per product',
    ],
  },
  productCode: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: [50, 'Product code cannot exceed 50 characters'],
    default: '',
  },
  availability: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'coming_soon'],
    default: 'in_stock',
    index: true,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  visibility: {
    type: Boolean,
    default: true,
    index: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Automatic unique slug generation
productSchema.pre('validate', function (next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    // Append small random suffix if regenerating to ensure uniqueness
    const suffix = this.isNew ? '-' + Math.random().toString(36).substring(2, 6) : '';
    this.slug = `${baseSlug}${suffix}`;
  }
  next();
});

// Full-text search index
productSchema.index({ name: 'text', shortDescription: 'text', description: 'text' });
productSchema.index({ visibility: 1, category: 1, availability: 1 });
productSchema.index({ featured: 1, visibility: 1 });

module.exports = mongoose.model('Product', productSchema);
