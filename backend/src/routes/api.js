const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');

// Controllers
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const settingsController = require('../controllers/settingsController');
const statsController = require('../controllers/statsController');
const uploadController = require('../controllers/uploadController');

// ==========================================
// PUBLIC BOUTIQUE CATALOGUE ENDPOINTS
// ==========================================

// Categories
router.get('/categories', categoryController.getCategories);
router.get('/categories/:slug', categoryController.getCategoryBySlug);

// Products
router.get('/products', productController.getProducts);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/:slug', productController.getProductBySlug);

// Store Settings
router.get('/store-settings', settingsController.getSettings);

// ==========================================
// PROTECTED ADMINISTRATOR ENDPOINTS
// ==========================================

// Auth
router.post('/admin/login', loginLimiter, authController.login);
router.post('/admin/logout', protect, authController.logout);
router.get('/admin/me', protect, authController.getMe);

// Admin Stats
router.get('/admin/stats', protect, statsController.getDashboardStats);

// Admin Products
router.get('/admin/products', protect, productController.getAllProductsAdmin);
router.get('/admin/products/:id', protect, productController.getProductByIdAdmin);
router.post('/admin/products', protect, productController.createProduct);
router.patch('/admin/products/:id', protect, productController.updateProduct);
router.delete('/admin/products/:id', protect, productController.deleteProduct);

// Admin Categories
router.get('/admin/categories', protect, categoryController.getAllCategoriesAdmin);
router.post('/admin/categories', protect, categoryController.createCategory);
router.patch('/admin/categories/:id', protect, categoryController.updateCategory);
router.delete('/admin/categories/:id', protect, categoryController.deleteCategory);

// Admin Settings
router.patch('/admin/settings', protect, settingsController.updateSettings);

// Image Uploads
router.post('/admin/upload', protect, upload.array('images', 8), uploadController.uploadImages);

module.exports = router;
