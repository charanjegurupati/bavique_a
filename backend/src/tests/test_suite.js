const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@bavique.com';
const ADMIN_PASSWORD = 'Bavique@Admin2026!';

let adminToken = '';
let createdCategoryId = '';
let createdProductId = '';
let createdProductSlug = '';

const runTests = async () => {
  console.log('====================================================');
  console.log('🧪 BAVIQUE AUTOMATED INTEGRATION & SECURITY TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Reason: ${err.message}`);
      failed++;
    }
  };

  // 1. PUBLIC ENDPOINTS
  console.log('--- 1. Public Catalogue API ---');
  await test('Public Health Endpoint', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.brand, 'BAVIQUE');
  });

  await test('Get Active Categories', async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(Array.isArray(data.data));
    assert(data.data.length >= 5, 'Should have at least 5 categories');
  });

  await test('Get Products with Pagination & Filtering', async () => {
    const res = await fetch(`${BASE_URL}/products?limit=6&page=1`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.length, 6);
    assert(data.total >= 15);
  });

  await test('Filter Products by Category Slug (hair-accessories)', async () => {
    const res = await fetch(`${BASE_URL}/products?category=hair-accessories`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.data.length > 0);
    data.data.forEach(p => {
      assert.strictEqual(p.category.slug, 'hair-accessories');
    });
  });

  await test('Search Products by Keyword ("Pearl")', async () => {
    const res = await fetch(`${BASE_URL}/products?search=Pearl`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.data.length > 0);
    const hasPearl = data.data.some(p => p.name.includes('Pearl') || p.description.includes('Pearl'));
    assert(hasPearl, 'Results should contain Pearl');
  });

  await test('Sort Products by Price Ascending', async () => {
    const res = await fetch(`${BASE_URL}/products?sort=price_asc&limit=10`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    for (let i = 0; i < data.data.length - 1; i++) {
      assert(data.data[i].price <= data.data[i + 1].price, 'Price should be non-decreasing');
    }
  });

  await test('Get Featured Products', async () => {
    const res = await fetch(`${BASE_URL}/products/featured`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.data.length > 0);
    data.data.forEach(p => assert.strictEqual(p.featured, true));
  });

  await test('Get Store Settings', async () => {
    const res = await fetch(`${BASE_URL}/store-settings`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.data.storeName, 'BAVIQUE');
    assert.strictEqual(data.data.instagramHandle, 'bavique_ff_');
  });

  // 2. SECURITY & AUTHENTICATION
  console.log('\n--- 2. Security & Authentication ---');
  await test('Deny Unauthorized Access to Admin Routes', async () => {
    const res = await fetch(`${BASE_URL}/admin/products`);
    assert.strictEqual(res.status, 401);
  });

  await test('Reject Invalid Login Credentials', async () => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: 'WrongPassword123!' }),
    });
    assert.strictEqual(res.status, 401);
  });

  await test('Admin Login with Correct Credentials', async () => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.token, 'Token must be returned');
    assert.strictEqual(data.user.email, ADMIN_EMAIL);
    assert(!data.user.password, 'Password hash must NEVER be returned');
    adminToken = data.token;
  });

  await test('Get Admin Profile with Token (/api/admin/me)', async () => {
    const res = await fetch(`${BASE_URL}/admin/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.email, ADMIN_EMAIL);
  });

  await test('Get Real Dashboard Stats (/api/admin/stats)', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.data.totalProducts >= 15);
    assert(data.data.totalCategories >= 5);
    assert(data.data.availableProducts > 0);
  });

  // 3. ADMIN CRUD OPERATIONS & SAFETY CHECKS
  console.log('\n--- 3. Administrator CRUD & Safety Checks ---');
  await test('Create Category (Admin)', async () => {
    const res = await fetch(`${BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Temporary Test Category',
        description: 'For automated test execution',
        displayOrder: 99,
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert(data.data._id);
    createdCategoryId = data.data._id;
  });

  await test('Create Product in Category (Admin)', async () => {
    const res = await fetch(`${BASE_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Test Sparkle Ring',
        shortDescription: 'Sterling silver sparkle ring',
        description: 'Full description of test sparkle ring',
        price: 999,
        category: createdCategoryId,
        availability: 'in_stock',
        featured: true,
        visibility: true,
        productCode: 'TEST-RNG-01',
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert(data.data._id);
    createdProductId = data.data._id;
    createdProductSlug = data.data.slug;
  });

  await test('Verify Product Exists Publicly by Slug', async () => {
    const res = await fetch(`${BASE_URL}/products/${createdProductSlug}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.data.name, 'Test Sparkle Ring');
    assert.strictEqual(data.data.price, 999);
  });

  await test('Prevent Category Deletion When Products Are Assigned (Safety Gate)', async () => {
    const res = await fetch(`${BASE_URL}/admin/categories/${createdCategoryId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 400, 'Should reject deletion of category with assigned products');
    const data = await res.json();
    assert(data.message.includes('Cannot delete this category because it contains'));
  });

  await test('Update Product Details & Price', async () => {
    const res = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 1299,
        availability: 'out_of_stock',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.data.price, 1299);
    assert.strictEqual(data.data.availability, 'out_of_stock');
  });

  await test('Delete Test Product', async () => {
    const res = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
  });

  await test('Delete Category Now That Products Are Cleaned Up', async () => {
    const res = await fetch(`${BASE_URL}/admin/categories/${createdCategoryId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
  });

  // 4. IMAGE UPLOADS
  console.log('\n--- 4. Image Upload Security & Verification ---');
  await test('Upload Valid Image (Admin Multipart)', async () => {
    // Generate a minimal valid 1x1 PNG in memory
    const png1x1 = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    const blob = new Blob([png1x1], { type: 'image/png' });
    const formData = new FormData();
    formData.append('images', blob, 'test-pixel.png');

    const res = await fetch(`${BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: formData,
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(Array.isArray(data.images));
    assert(data.images[0].url.startsWith('/uploads/'));
    assert.strictEqual(data.images[0].format, 'webp', 'Sharp converted image to WebP');
  });

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
};

runTests().catch(err => {
  console.error('Test Runner Fatal:', err);
  process.exit(1);
});
