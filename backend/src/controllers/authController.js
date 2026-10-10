const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'bavique_jwt_secret_dev_389274298174981273981273',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('bavique_token', token, cookieOptions);

  const safeUser = user.toSafeObject();
  res.status(statusCode).json({
    success: true,
    token,
    user: safeUser,
    data: safeUser,
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public (Rate limited)
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Admin logout
// @route   POST /api/admin/logout
// @access  Private
exports.logout = async (req, res) => {
  res.cookie('bavique_token', 'none', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// @desc    Get currently logged in admin
// @route   GET /api/admin/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found.',
      });
    }
    const safeUser = user.toSafeObject();
    res.status(200).json({
      success: true,
      user: safeUser,
      data: safeUser,
    });
  } catch (err) {
    next(err);
  }
};
