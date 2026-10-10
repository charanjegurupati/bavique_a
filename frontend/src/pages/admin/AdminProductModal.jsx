import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  X,
  Upload,
  Trash2,
  Star,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export default function AdminProductModal({
  isOpen,
  onClose,
  productToEdit,
  categories,
  onSuccess,
}) {
  const isEditing = !!productToEdit;

  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [productCode, setProductCode] = useState('');
  const [availability, setAvailability] = useState('in_stock');
  const [featured, setFeatured] = useState(false);
  const [visibility, setVisibility] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  // Images state: existing array of { url, alt, isPrimary } + newly selected File objects
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgressText, setUploadProgressText] = useState('');

  // Populate form on edit
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setCategoryId(productToEdit.category?._id || productToEdit.category || '');
      setPrice(productToEdit.price !== undefined ? productToEdit.price.toString() : '');
      setShortDescription(productToEdit.shortDescription || '');
      setDescription(productToEdit.description || '');
      setProductCode(productToEdit.productCode || '');
      setAvailability(productToEdit.availability || 'in_stock');
      setFeatured(!!productToEdit.featured);
      setVisibility(productToEdit.visibility !== false);
      setDisplayOrder(productToEdit.displayOrder || 0);
      setExistingImages(productToEdit.images || []);
    } else {
      // Default new product values
      setName('');
      setCategoryId(categories.length > 0 ? categories[0]._id : '');
      setPrice('');
      setShortDescription('');
      setDescription('');
      setProductCode('');
      setAvailability('in_stock');
      setFeatured(false);
      setVisibility(true);
      setDisplayOrder(0);
      setExistingImages([]);
    }
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setErrorMessage('');
    setUploadProgressText('');
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const totalAllowed = 8 - (existingImages.length + newImageFiles.length);
    if (files.length > totalAllowed) {
      setErrorMessage(`You can add up to ${totalAllowed} more image(s) (Maximum 8 total).`);
      return;
    }

    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length < files.length) {
      setErrorMessage('Some selected files were skipped because they are not valid images.');
    }

    setNewImageFiles((prev) => [...prev, ...validFiles]);

    // Create local object URLs for preview
    const previews = validFiles.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const setPrimaryExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!name.trim()) {
      setErrorMessage('Product Name is required.');
      return;
    }
    if (!categoryId) {
      setErrorMessage('Please select a Category for this piece.');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMessage('Please enter a valid price in ₹ (non-negative number).');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImages = [...existingImages];

      // 1. Upload new images if any
      if (newImageFiles.length > 0) {
        setUploadProgressText('Optimizing & uploading images to boutique storage...');
        const uploadRes = await api.uploadImages(newImageFiles);
        if (uploadRes.success && uploadRes.images) {
          const uploadedFormatted = uploadRes.images.map((img, i) => ({
            url: img.url,
            alt: name.trim(),
            isPrimary: finalImages.length === 0 && i === 0,
          }));
          finalImages = [...finalImages, ...uploadedFormatted];
        }
      }

      // Ensure at least one image is marked isPrimary if images exist
      if (finalImages.length > 0 && !finalImages.some((img) => img.isPrimary)) {
        finalImages[0].isPrimary = true;
      }

      setUploadProgressText('Saving product record in database...');

      const payload = {
        name: name.trim(),
        category: categoryId,
        price: numPrice,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        productCode: productCode.trim().toUpperCase(),
        availability,
        featured,
        visibility,
        displayOrder: Number(displayOrder) || 0,
        images: finalImages,
      };

      if (isEditing) {
        await api.updateProduct(productToEdit._id, payload);
      } else {
        await api.createProduct(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save product error:', err);
      setErrorMessage(err.message || 'Failed to save product. Please review your input.');
    } finally {
      setIsSubmitting(false);
      setUploadProgressText('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-chocolate-950/50 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl glass-modal rounded-3xl shadow-2xl border border-white/90 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-champagne-100/40 backdrop-blur-md border-b border-champagne-200/80 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-950">
              {isEditing ? 'Edit Boutique Product' : 'Add New Boutique Piece'}
            </h2>
            <p className="text-xs text-chocolate-600 mt-0.5">
              Fill in product details to make this piece visible in your physical store catalogue.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full glass-pill hover:bg-white text-chocolate-700 transition-colors border border-white/80 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-fadeIn font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rosegold-600">
              Basic Product Information
            </h3>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Opulent Pearl & Crystal Headband"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  <option value="" disabled>Select category...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                  In-Store Price (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-chocolate-600 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="699"
                    required
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                Short Description (Shown on cards)
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g. Double-row lustrous pearl headband with crystal accents."
                maxLength={300}
                className="w-full px-4 py-2 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                Full Description (Shown on product details)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe material, styling ideas, dimensions, or handcrafted details..."
                rows={3}
                maxLength={3000}
                className="w-full px-4 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>

          {/* Section 2: Store Inventory & Identifiers */}
          <div className="pt-4 border-t border-champagne-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rosegold-600">
              Inventory & Display Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Product Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                  Product Code / Tag
                </label>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="e.g. HA-PRL-01"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                  Availability Status
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  <option value="in_stock">In Stock (Available)</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="out_of_stock">Currently Unavailable</option>
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            {/* Featured & Visibility Toggles */}
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-chocolate-900 focus:ring-gold-400 border-champagne-300"
                />
                <span className="text-xs font-semibold text-chocolate-900">
                  Feature on Homepage ("Boutique Highlights")
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibility}
                  onChange={(e) => setVisibility(e.target.checked)}
                  className="w-4 h-4 rounded text-chocolate-900 focus:ring-gold-400 border-champagne-300"
                />
                <span className="text-xs font-semibold text-chocolate-900">
                  Public Visibility (Visible on store catalogue)
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Product Photos */}
          <div className="pt-4 border-t border-champagne-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rosegold-600">
                Product Photographs (Max 8)
              </h3>
              <span className="text-xs text-chocolate-600">
                {existingImages.length + newImageFiles.length} / 8 photos
              </span>
            </div>

            {/* Dropzone */}
            <label className="block border-2 border-dashed border-champagne-300 hover:border-gold-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-champagne-50/50 hover:bg-champagne-100/50">
              <Upload className="w-8 h-8 text-chocolate-600 mx-auto mb-2" />
              <span className="text-xs font-bold text-chocolate-900 block">
                Click to upload photographs or drag & drop
              </span>
              <span className="text-[11px] text-chocolate-600 mt-1 block">
                PNG, JPG, or WebP. Automatically converted and compressed with Sharp.
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={existingImages.length + newImageFiles.length >= 8}
              />
            </label>

            {/* Previews Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Existing Images */}
              {existingImages.map((img, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative aspect-square rounded-xl overflow-hidden border border-champagne-300 group shadow-xs bg-white"
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPrimaryExistingImage(idx)}
                      className={`p-1.5 rounded-full ${
                        img.isPrimary ? 'bg-gold-500 text-chocolate-950' : 'bg-white/80 text-chocolate-800'
                      }`}
                      title={img.isPrimary ? 'Primary Image' : 'Set as Primary Image'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {img.isPrimary && (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-gold-500 text-chocolate-950 text-[9px] font-bold uppercase tracking-wider">
                      Primary
                    </div>
                  )}
                </div>
              ))}

              {/* Newly Selected Local Previews */}
              {newImagePreviews.map((preview, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gold-400 group shadow-xs bg-white"
                >
                  <img src={preview.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold uppercase">
                    New
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Progress / Status banner during upload */}
          {uploadProgressText && (
            <div className="p-3 rounded-xl bg-champagne-200/80 text-chocolate-900 text-xs font-semibold flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span>{uploadProgressText}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-champagne-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-champagne-300 text-chocolate-800 text-xs font-bold hover:bg-champagne-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-2.5 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-champagne-100 text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-champagne-200 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Update Product' : 'Save Product'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
