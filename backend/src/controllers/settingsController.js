const StoreSettings = require('../models/StoreSettings');

// @desc    Get store contact details, opening hours, instagram handle
// @route   GET /api/store-settings
// @access  Public
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      // Create initial default settings if none exist
      settings = await StoreSettings.create({
        storeName: 'BAVIQUE',
        tagline: "More than just a store… it's a vibe.",
        subTagline: 'Fancy, Beauty, Fashion',
        phone: '+91 98765 43210',
        whatsapp: '+919876543210',
        email: 'hello@bavique.com',
        address: 'Bavique Boutique, Main High Street, Fashion Galleria, India',
        openingHours: 'Mon - Sun: 10:30 AM - 9:30 PM',
        instagramHandle: 'bavique_ff_',
        instagramUrl: 'https://instagram.com/bavique_ff_',
        googleMapsUrl: 'https://maps.google.com',
        announcementText: '✨ Welcome to BAVIQUE! Visit our boutique store to explore our exclusive new sparkle collection.',
        announcementActive: true,
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update store settings (Admin)
// @route   PATCH /api/admin/settings
// @access  Private
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings();
    }

    const {
      storeName,
      tagline,
      subTagline,
      phone,
      whatsapp,
      email,
      address,
      openingHours,
      instagramHandle,
      instagramUrl,
      googleMapsUrl,
      announcementText,
      announcementActive,
    } = req.body;

    if (storeName !== undefined) settings.storeName = storeName.trim();
    if (tagline !== undefined) settings.tagline = tagline.trim();
    if (subTagline !== undefined) settings.subTagline = subTagline.trim();
    if (phone !== undefined) settings.phone = phone.trim();
    if (whatsapp !== undefined) settings.whatsapp = whatsapp.trim();
    if (email !== undefined) settings.email = email.trim();
    if (address !== undefined) settings.address = address.trim();
    if (openingHours !== undefined) settings.openingHours = openingHours.trim();
    if (instagramHandle !== undefined) settings.instagramHandle = instagramHandle.trim().replace(/^@/, '');
    if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl.trim();
    if (googleMapsUrl !== undefined) settings.googleMapsUrl = googleMapsUrl.trim();
    if (announcementText !== undefined) settings.announcementText = announcementText.trim();
    if (announcementActive !== undefined) settings.announcementActive = Boolean(announcementActive);

    await settings.save();

    res.status(200).json({
      success: true,
      data: settings,
      message: 'Store settings saved successfully.',
    });
  } catch (err) {
    next(err);
  }
};
