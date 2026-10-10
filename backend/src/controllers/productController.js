const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// @desc    Get products for public boutique catalogue with filters & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      availability,
      minPrice,
      maxPrice,
      featured,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { visibility: true };

    // Search by name or description
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { shortDescription: regex },
        { description: regex },
        { productCode: regex },
      ];
    }

    // Category filter by ID or slug
    if (category && category !== 'all') {
      // Check if it's an ObjectId or slug
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category, isActive: true });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          // No matching category means 0 products
          return res.status(200).json({
            success: true,
            count: 0,
            totalPages: 0,
            currentPage: Number(page),
            data: [],
          });
        }
      }
    }

    // Availability filter
    if (availability && ['in_stock', 'out_of_stock', 'coming_soon'].includes(availability)) {
      query.availability = availability;
    }

    // Price range filters (in INR ₹)
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && !isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    switch (sort) {
      case 'price_asc':
        sortOptions = { price: 1, createdAt: -1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1, createdAt: -1 };
        break;
      case 'name_asc':
        sortOptions = { name: 1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'newest':
      default:
        sortOptions = { displayOrder: 1, createdAt: -1 };
        break;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true, visibility: true })
      .populate('category', 'name slug')
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(8)
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, visibility: true })
      .populate('category', 'name slug description image')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in catalogue.',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all products for administrator
// @route   GET /api/admin/products
// @access  Private
exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const {
      search,
      category,
      availability,
      visibility,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { productCode: regex },
        { shortDescription: regex },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (availability && ['in_stock', 'out_of_stock', 'coming_soon'].includes(availability)) {
      query.availability = availability;
    }

    if (visibility !== undefined && visibility !== 'all') {
      query.visibility = visibility === 'true';
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by ID (Admin)
// @route   GET /api/admin/products/:id
// @access  Private
exports.getProductByIdAdmin = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/admin/products
// @access  Private
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      shortDescription,
      description,
      price,
      category,
      images,
      productCode,
      availability,
      featured,
      visibility,
      displayOrder,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required.',
      });
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid non-negative price in ₹.',
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid category.',
      });
    }

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist.',
      });
    }

    const product = await Product.create({
      name: name.trim(),
      shortDescription: shortDescription ? shortDescription.trim() : '',
      description: description ? description.trim() : '',
      price: Number(price),
      category,
      images: Array.isArray(images) ? images : [],
      productCode: productCode ? productCode.trim().toUpperCase() : '',
      availability: availability || 'in_stock',
      featured: Boolean(featured),
      visibility: visibility !== undefined ? Boolean(visibility) : true,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      data: populatedProduct,
      message: 'Product added to catalogue successfully!',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product (Admin)
// @route   PATCH /api/admin/products/:id
// @access  Private
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const {
      name,
      shortDescription,
      description,
      price,
      category,
      images,
      productCode,
      availability,
      featured,
      visibility,
      displayOrder,
    } = req.body;

    if (name && name.trim()) {
      product.name = name.trim();
      if (product.isModified('name')) {
        product.slug = slugify(name.trim(), { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 6);
      }
    }

    if (shortDescription !== undefined) product.shortDescription = shortDescription.trim();
    if (description !== undefined) product.description = description.trim();

    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid non-negative number.',
        });
      }
      product.price = numPrice;
    }

    if (category) {
      const catDoc = await Category.findById(category);
      if (!catDoc) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist.',
        });
      }
      product.category = category;
    }

    if (images !== undefined && Array.isArray(images)) {
      product.images = images;
    }

    if (productCode !== undefined) {
      product.productCode = productCode.trim().toUpperCase();
    }

    if (availability && ['in_stock', 'out_of_stock', 'coming_soon'].includes(availability)) {
      product.availability = availability;
    }

    if (featured !== undefined) product.featured = Boolean(featured);
    if (visibility !== undefined) product.visibility = Boolean(visibility);
    if (displayOrder !== undefined) product.displayOrder = Number(displayOrder);

    await product.save();

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      data: populatedProduct,
      message: 'Product updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Safely delete associated local image files if any
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.url && img.url.startsWith('/uploads/')) {
          const filename = path.basename(img.url);
          const filePath = path.join(__dirname, '../../public/uploads', filename);
          // Check if any other product uses this image
          const otherUsing = await Product.countDocuments({
            _id: { $ne: product._id },
            'images.url': img.url,
          });
          if (otherUsing === 0 && fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (unlinkErr) {
              console.error('Error removing local file:', unlinkErr.message);
            }
          }
        }
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted from catalogue successfully.',
    });
  } catch (err) {
    next(err);
  }
};
