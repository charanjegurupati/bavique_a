const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('slugify');

// @desc    Get active categories for public boutique catalogue
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all categories for admin (including inactive, with product count)
// @route   GET /api/admin/categories
// @access  Private
exports.getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, createdAt: 1 }).lean();

    // Attach product counts
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat._id });
        return {
          ...cat,
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image, displayOrder, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      image: image || '',
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category
// @route   PATCH /api/admin/categories/:id
// @access  Private
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, displayOrder, isActive } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    if (name && name.trim()) {
      category.name = name.trim();
      category.slug = slugify(name.trim(), { lower: true, strict: true });
    }
    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image;
    if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    await category.save();

    res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category (Safe deletion: rejects if products belong to category)
// @route   DELETE /api/admin/categories/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete this category because it contains ${productCount} active product(s). Please reassign or delete the products first.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
