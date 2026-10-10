const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// @desc    Upload single or multiple images with sharp security verification & optimization
// @route   POST /api/admin/upload
// @access  Private
exports.uploadImages = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided for upload.',
      });
    }

    const processedImages = [];

    for (const file of files) {
      try {
        // Sharp validates the actual image binary structure, rejecting renamed binaries or active scripts
        const imageMetadata = await sharp(file.buffer).metadata();

        if (!imageMetadata.format) {
          throw new Error('Invalid image binary structure.');
        }

        const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
        const outputFilename = `bavique-${uniqueSuffix}.webp`;
        const outputPath = path.join(uploadsDir, outputFilename);

        // Resize if larger than 1600px width/height, strip metadata, convert to WebP
        const info = await sharp(file.buffer)
          .rotate() // auto-orient based on EXIF before stripping
          .resize({
            width: 1600,
            height: 1600,
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          })
          .webp({ quality: 84, effort: 4 })
          .toFile(outputPath);

        const relativeUrl = `/uploads/${outputFilename}`;

        processedImages.push({
          url: relativeUrl,
          alt: file.originalname ? path.parse(file.originalname).name : 'BAVIQUE Product',
          width: info.width,
          height: info.height,
          size: info.size,
          format: 'webp',
        });
      } catch (procErr) {
        console.error('Image processing failure for file:', file.originalname, procErr);
        return res.status(400).json({
          success: false,
          message: `Corrupt or unsupported image file: ${file.originalname}. Please upload valid JPEG, PNG, or WebP images.`,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `${processedImages.length} image(s) processed and uploaded successfully.`,
      images: processedImages,
    });
  } catch (err) {
    next(err);
  }
};
