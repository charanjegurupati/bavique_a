require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const StoreSettings = require('../models/StoreSettings');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bavique_db');
    console.log('[Seed] Database connected successfully.');
  } catch (err) {
    console.error('[Seed Error] Connection failed:', err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  console.log('🔄 Cleaning existing collections...');
  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();
  await StoreSettings.deleteMany();

  console.log('👤 Creating default Administrator account...');
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@bavique.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Bavique@Admin2026!';

  const admin = await User.create({
    name: 'Bavique Store Owner',
    email: adminEmail,
    password: adminPassword,
    role: 'superadmin',
  });
  console.log(`✅ Admin created: ${admin.email} / ${adminPassword}`);

  console.log('🏷️ Creating 5 Core Categories...');
  const categoriesData = [
    {
      name: 'Hair Accessories',
      slug: 'hair-accessories',
      description: 'Handcrafted clips, crystal hairpins, silk scrunchies, and pearl headbands.',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop&q=80',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Makeup & Skincare',
      slug: 'makeup-skincare',
      description: 'Luminous tints, rosewater mists, velvet lipsticks, and beauty essentials.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Jewellery',
      slug: 'jewellery',
      description: 'Delicate gold-toned necklaces, cubic zirconia earrings, and shimmer bracelets.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Bags & Fancy Items',
      slug: 'bags-fancy-items',
      description: 'Quilted crossbody pouches, party clutches, cute key charms, and fancy totes.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'Dresses & Fashion',
      slug: 'dresses-fashion',
      description: 'Boutique party dresses, satin coordinates, flowy sundresses, and chic tops.',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
      displayOrder: 5,
      isActive: true,
    },
  ];

  const createdCategories = await Category.insertMany(categoriesData);
  const catMap = {};
  createdCategories.forEach((c) => {
    catMap[c.name] = c._id;
    catMap[c.slug] = c._id;
  });
  console.log(`✅ Created ${createdCategories.length} categories.`);

  console.log('✨ Creating Curated Products...');
  const productsData = [
    // HAIR ACCESSORIES
    {
      name: 'Opulent Pearl & Crystal Headband',
      shortDescription: 'Double-row lustrous faux pearl headband with shimmering crystal accents.',
      description: 'Add instant royalty to your hairstyle. Crafted with high-grade faux pearls mounted on a flexible, comfortable rose-gold alloy frame with velvet-lined ends to prevent pinching behind the ears.',
      price: 699,
      category: catMap['Hair Accessories'],
      productCode: 'HA-PRL-01',
      availability: 'in_stock',
      featured: true,
      visibility: true,
      displayOrder: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=1000&auto=format&fit=crop&q=80', alt: 'Pearl Headband front view', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1000&auto=format&fit=crop&q=80', alt: 'Pearl Headband detail', isPrimary: false },
      ],
    },
    {
      name: 'Blush Velvet Ribbon Claw Clip Set',
      shortDescription: 'Pair of durable French grip claw clips in soft blush pink and ivory.',
      description: 'Secure hold without damaging or creasing hair. Features ultra-smooth matte finish with delicate ribbon bow silhouette for chic everyday ponytails and half-up styles.',
      price: 349,
      category: catMap['Hair Accessories'],
      productCode: 'HA-CLW-02',
      availability: 'in_stock',
      featured: false,
      visibility: true,
      displayOrder: 2,
      images: [
        { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1000&auto=format&fit=crop&q=80', alt: 'Velvet Ribbon Claw Clip', isPrimary: true },
      ],
    },
    {
      name: 'Golden Butterfly Flutter Hair Pins (Set of 4)',
      shortDescription: 'Delicate filigree butterflies with rose-gold metallic luster.',
      description: 'Intricately etched hollow butterfly clips that look as though they flutter when you walk. Perfect for weddings, prom nights, and festive celebrations.',
      price: 499,
      category: catMap['Hair Accessories'],
      productCode: 'HA-BTF-03',
      availability: 'in_stock',
      featured: true,
      visibility: true,
      displayOrder: 3,
      images: [
        { url: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=1000&auto=format&fit=crop&q=80', alt: 'Butterfly Hair Pins', isPrimary: true },
      ],
    },

    // MAKEUP & SKINCARE
    {
      name: 'Luminous Rose Water Hydration Mist (100ml)',
      shortDescription: 'Infused with distilled Bulgarian damask rose petals and hyaluronic essence.',
      description: 'A multi-purpose floral elixir that hydrates, primes, and sets your makeup with an ethereal dewy glow. Packaged in a luxury frosted glass spray flask.',
      price: 850,
      category: catMap['Makeup & Skincare'],
      productCode: 'MS-ROSE-01',
      availability: 'in_stock',
      featured: true,
      visibility: true,
      displayOrder: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&auto=format&fit=crop&q=80', alt: 'Rose Water Mist Bottle', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop&q=80', alt: 'Skincare flatlay', isPrimary: false },
      ],
    },
    {
      name: 'Velvet Petal Cream Blush & Lip Pot',
      shortDescription: 'Dual-purpose creamy pigment in universally flattering peach-rose.',
      description: 'Buttery smooth formulation that melts seamlessly onto cheeks and lips with fingertips. Provides a natural flush with antioxidant rich jojoba seed oil.',
      price: 599,
      category: catMap['Makeup & Skincare'],
      productCode: 'MS-BLSH-02',
      availability: 'in_stock',
      featured: false,
      visibility: true,
      displayOrder: 2,
      images: [
        { url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1000&auto=format&fit=crop&q=80', alt: 'Cream Blush Pot', isPrimary: true },
      ],
    },
    {
      name: 'Champagne Shimmer Body Glow Oil (50ml)',
      shortDescription: 'Dry body oil loaded with ultra-fine gold and rose gold micro-pearls.',
      description: 'Highlights collarbones, arms, and décolletage without grease or stickiness. Scented with warm vanilla and white orchid.',
      price: 999,
      category: catMap['Makeup & Skincare'],
      productCode: 'MS-GLW-03',
      availability: 'coming_soon',
      featured: true,
      visibility: true,
      displayOrder: 3,
      images: [
        { url: 'https://images.unsplash.com/photo-1608248597359-255d491bc95f?w=1000&auto=format&fit=crop&q=80', alt: 'Shimmer Glow Oil', isPrimary: true },
      ],
    },

    // JEWELLERY
    {
      name: 'Celestial Constellation Pendant Necklace',
      shortDescription: '18k gold-plated dainty chain with micro pavé cubic zirconia stars.',
      description: 'Hypoallergenic, water-resistant plating that does not tarnish. Features an adjustable 16-18 inch delicate link chain with lobster clasp and engraved BAVIQUE tag.',
      price: 1199,
      category: catMap['Jewellery'],
      productCode: 'JW-STR-01',
      availability: 'in_stock',
      featured: true,
      visibility: true,
      displayOrder: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=80', alt: 'Celestial Pendant', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1611591475879-1c94d01b1b90?w=1000&auto=format&fit=crop&q=80', alt: 'Jewelry styling', isPrimary: false },
      ],
    },
    {
      name: 'Cascading Pearl Drop Earrings',
      shortDescription: 'Baroque freshwater teardrop pearls hanging from polished gold studs.',
      description: 'Timeless elegance suited for both daytime brunch and evening parties. Featherlight weight ensures total comfort throughout the day.',
      price: 899,
      category: catMap['Jewellery'],
      productCode: 'JW-EAR-02',
      availability: 'in_stock',
      featured: false,
      visibility: true,
      displayOrder: 2,
      images: [
        { url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1000&auto=format&fit=crop&q=80', alt: 'Pearl Drop Earrings', isPrimary: true },
      ],
    },
    {
      name: 'Rose Gold Sparkling Tennis Bracelet',
      shortDescription: 'Continuous band of 3mm brilliant cut stones in secure four-prong basket.',
      description: 'Dazzling fire and scintillation crafted with double safety latch. Standard 7-inch length fitting comfortably on most wrists.',
      price: 1499,
      category: catMap['Jewellery'],
      productCode: 'JW-BRC-03',
      availability: 'out_of_stock',
      featured: true,
      visibility: true,
      displayOrder: 3,
      images: [
        { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000&auto=format&fit=crop&q=80', alt: 'Tennis Bracelet', isPrimary: true },
      ],
    },

    // BAGS & FANCY ITEMS
    {
      name: 'Quilted Blush Box Handbag with Gold Chain',
      shortDescription: 'Structured vegan leather miniature box bag with twisted metal handle.',
      description: 'A showstopping statement accessory designed to hold your smartphone, lipstick, cardholder, and keys. Includes detachable woven leather-and-chain shoulder strap.',
      price: 2499,
      category: catMap['Bags & Fancy Items'],
      productCode: 'BG-BOX-01',
      availability: 'in_stock',
      featured: true,
      visibility: true,
      displayOrder: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&auto=format&fit=crop&q=80', alt: 'Quilted Handbag', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1000&auto=format&fit=crop&q=80', alt: 'Bag side angle', isPrimary: false },
      ],
    },
    {
      name: 'Crystal Embellished Evening Clutch',
      shortDescription: 'Hard-shell metallic clutch covered in light-catching rhinestone mesh.',
      description: 'The definitive cocktail party companion. Lined in soft champagne satin with interior card slot and concealable serpentine cross-body chain.',
      price: 1899,
      category: catMap['Bags & Fancy Items'],
      productCode: 'BG-CLT-02',
      availability: 'in_stock',
      featured: false,
      visibility: true,
      displayOrder: 2,
      images: [
        { url: 'https://images.unsplash.com/photo-1566150902880-1a221f7e43ce?w=1000&auto=format&fit=crop&q=80', alt: 'Crystal Evening Clutch', isPrimary: true },
      ],
    },
    {
      name: 'Fluffy Teddy Plush Vanity Pouch',
      shortDescription: 'Super soft faux shearling cosmetic pouch with golden heart zipper pull.',
      description: 'Keep your makeup, hair clips, and daily essentials organized inside your tote with this incredibly adorable, plush vanity organizer.',
      price: 749,
      category: catMap['Bags & Fancy Items'],
      productCode: 'BG-PCH-03',
      availability: 'in_stock',
      featured: false,
      visibility: true,
      displayOrder: 3,
      images: [
        { url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1000&auto=format&fit=crop&q=80', alt: 'Teddy Vanity Pouch', isPrimary: true },
      ],
    },

    // DRESSES & FASHION
    {
      name: 'Rose Champagne Satin Slip Dress',
      shortDescription: 'Bias-cut cowl neckline midi dress with delicate adjustable spaghetti straps.',
      description: 'Elegantly drapes across the silhouette in heavyweight glossy silk-satin. Features a graceful side slit and cowl back detail.',
      price: 3299,
      category: catMap['Dresses & Fashion'],
      productCode: 'DR-SLP-01',
      availability: 'in_stock',
      featured: true,
      visibility: true,
      displayOrder: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&auto=format&fit=crop&q=80', alt: 'Satin Slip Dress', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&auto=format&fit=crop&q=80', alt: 'Dress back silhouette', isPrimary: false },
      ],
    },
    {
      name: 'Pastel Floral Ruffled Tiered Sundress',
      shortDescription: 'Breezy chiffon dress with romantic flutter sleeves and cinched waistline.',
      description: 'Brimming with feminine sweetness, tailored with soft inner lining and smocked elastic back for a custom comfortable fit.',
      price: 2799,
      category: catMap['Dresses & Fashion'],
      productCode: 'DR-FLR-02',
      availability: 'in_stock',
      featured: false,
      visibility: true,
      displayOrder: 2,
      images: [
        { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&auto=format&fit=crop&q=80', alt: 'Pastel Floral Sundress', isPrimary: true },
      ],
    },
    {
      name: 'Midnight Glamour Velvet Mini Dress',
      shortDescription: 'Rich chocolate-toned plush velvet wrap dress with ruched waist.',
      description: 'Luxe stretch velvet that catches the light with subtle warmth. Ideal for dinner dates, birthday evenings, and formal boutique events.',
      price: 3599,
      category: catMap['Dresses & Fashion'],
      productCode: 'DR-VLV-03',
      availability: 'in_stock',
      featured: true,
      visibility: true,
      displayOrder: 3,
      images: [
        { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&auto=format&fit=crop&q=80', alt: 'Velvet Mini Dress', isPrimary: true },
      ],
    },
  ];

  await Product.insertMany(productsData);
  console.log(`✅ Created ${productsData.length} curated products across 5 categories.`);

  console.log('🏬 Creating Store Settings...');
  await StoreSettings.create({
    storeName: 'BAVIQUE',
    tagline: "More than just a store… it's a vibe.",
    subTagline: 'Fancy, Beauty, Fashion',
    phone: '+91 98765 43210',
    whatsapp: '+919876543210',
    email: 'contact@bavique.com',
    address: 'BAVIQUE Boutique, Plot 24 Fashion Galleria, Near City Center, India',
    openingHours: 'Monday – Sunday: 10:30 AM – 9:30 PM',
    instagramHandle: 'bavique_ff_',
    instagramUrl: 'https://instagram.com/bavique_ff_',
    googleMapsUrl: 'https://maps.google.com',
    announcementText: '✨ Discover Your Everyday Sparkle — Visit our boutique store to explore our exclusive new sparkle collection.',
    announcementActive: true,
  });
  console.log('✅ Store settings initialized with official handle @bavique_ff_');

  console.log('🎉 Database seeding completed successfully!');
  process.exit(0);
};

seedData().catch((err) => {
  console.error('Seed script error:', err);
  process.exit(1);
});
