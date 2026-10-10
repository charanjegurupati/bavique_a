const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get dashboard summary statistics
// @route   GET /api/admin/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      availableProducts,
      unavailableProducts,
      comingSoonProducts,
      totalCategories,
      featuredProducts,
      hiddenProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ availability: 'in_stock' }),
      Product.countDocuments({ availability: 'out_of_stock' }),
      Product.countDocuments({ availability: 'coming_soon' }),
      Category.countDocuments(),
      Product.countDocuments({ featured: true }),
      Product.countDocuments({ visibility: false }),
    ]);

    // Fetch 5 most recently updated products for quick overview
    const recentProducts = await Product.find()
      .populate('category', 'name')
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('name price availability category images updatedAt')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        availableProducts,
        unavailableProducts,
        comingSoonProducts,
        totalCategories,
        featuredProducts,
        hiddenProducts,
        recentProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};
