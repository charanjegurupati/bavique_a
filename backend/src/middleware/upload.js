const multer = require('multer');

// Store files temporarily in memory for Sharp security & format validation
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Strict allowed MIME types
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Unsupported file type. Only JPEG, PNG, and WebP images are allowed.'),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per image maximum
    files: 8, // Max 8 files per upload batch
  },
  fileFilter,
});

module.exports = upload;
