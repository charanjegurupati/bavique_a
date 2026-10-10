const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');

const app = express();

// Security Headers with Helmet (tailored for video streaming & static assets)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Allows rich media embedding in development
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === 'development' ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Not allowed by origin'));
    },
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Cookie and Body parsing
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// General Rate Limiting
app.use('/api', apiLimiter);

// Serve static uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Serve brand media assets (original logo & cinematic intro video)
app.use('/media', express.static(path.join(__dirname, '../public/media')));

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    brand: 'BAVIQUE',
    tagline: "More than just a store… it's a vibe.",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
