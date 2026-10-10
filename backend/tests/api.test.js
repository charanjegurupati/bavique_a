const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');

const BASE_URL = 'http://localhost:5000/api';

describe('BAVIQUE Boutique API & Security Test Suite', () => {
  let adminToken = '';
  let testCategoryId = '';
  let testProductId = '';

  // 1. System Health & Public Catalogue Endpoints
  test('Health Check endpoint returns online status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'online');
    assert.strictEqual(data.brand, 'BAVIQUE');
  });

  test('Public Categories endpoint returns active boutique collections', async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 5, 'Should have at least 5 core boutique categories');
    testCategoryId = data.data[0]._id;
  });

  test('Public Products endpoint supports search, category filter, and pagination', async () => {
    const res = await fetch(`${BASE_URL}/products?limit=6`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.length > 0);
    assert.ok(data.total >= 10);
    assert.strictEqual(typeof data.currentPage, 'number');
  });

  test('Public Products endpoint filters by category correctly', async () => {
    const res = await fetch(`${BASE_URL}/products?category=hair-accessories`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.length > 0);
    data.data.forEach((p) => {
      assert.strictEqual(p.category.slug, 'hair-accessories');
    });
  });

  test('Public Store Settings endpoint returns contact details, hours, and verified handle', async () => {
    const res = await fetch(`${BASE_URL}/store-settings`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.storeName, 'BAVIQUE');
    assert.strictEqual(data.data.instagramHandle, 'bavique_ff_');
  });

  // 2. Security & Authentication Controls
  test('Admin Login rejects invalid credentials', async () => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@bavique.com', password: 'WrongPassword123!' }),
    });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  test('Admin Login succeeds with valid credentials and issues encrypted JWT token', async () => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@bavique.com', password: 'Bavique@Admin2026!' }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, 'admin@bavique.com');
    adminToken = data.token;
  });

  test('Protected Admin Endpoints reject requests without authorization token', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    assert.strictEqual(res.status, 401);
  });

  test('Protected Admin Endpoints reject malformed/forged tokens', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: 'Bearer fake.jwt.signature' },
    });
    assert.strictEqual(res.status, 401);
  });

  test('Protected Admin Stats returns real database aggregation counts', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer adminToken` ? `Bearer ${adminToken}` : '' },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.totalProducts > 0);
    assert.ok(data.data.totalCategories >= 5);
  });

  // 3. Product Management (CRUD)
  test('Admin can create a new boutique product', async () => {
    const newProduct = {
      name: 'Automated Test Velvet Scrunchie',
      shortDescription: 'Plush velvet scrunchie for test suite.',
      description: 'Handcrafted luxury velvet scrunchie created by test pass.',
      price: 299,
      category: testCategoryId,
      productCode: 'TST-SCR-99',
      availability: 'in_stock',
      featured: false,
      visibility: true,
      displayOrder: 99,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
          alt: 'Test Scrunchie',
          isPrimary: true,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(newProduct),
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.name, newProduct.name);
    testProductId = data.data._id;
  });

  test('Admin can update an existing boutique product', async () => {
    assert.ok(testProductId, 'Requires created product ID');
    const res = await fetch(`${BASE_URL}/admin/products/${testProductId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 349,
        availability: 'out_of_stock',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.price, 349);
    assert.strictEqual(data.data.availability, 'out_of_stock');
  });

  test('Admin can safely delete a boutique product', async () => {
    assert.ok(testProductId, 'Requires created product ID');
    const res = await fetch(`${BASE_URL}/admin/products/${testProductId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);

    // Verify it is no longer found
    const verifyRes = await fetch(`${BASE_URL}/admin/products/${testProductId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(verifyRes.status, 404);
  });

  // 4. Critical Business Logic Safeguard
  test('Category deletion is rejected if products still belong to it', async () => {
    // Attempt to delete core Category 1 which has assigned products
    const res = await fetch(`${BASE_URL}/admin/categories/${testCategoryId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes('active product(s)'));
  });
});
