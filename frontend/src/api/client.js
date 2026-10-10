export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const backendBase = import.meta.env.VITE_API_URL;
  if (backendBase && url.startsWith('/uploads/')) {
    return `${backendBase.replace(/\/$/, '')}${url}`;
  }
  return url;
};

// Helper for making standard JSON fetch requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('bavique_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'An unexpected response format was returned from the server.',
  }));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Public Catalogue APIs
  getCategories: () => request('/categories'),
  getCategoryBySlug: (slug) => request(`/categories/${slug}`),

  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return request(`/products?${query.toString()}`);
  },

  getFeaturedProducts: () => request('/products/featured'),
  getProductBySlug: (slug) => request(`/products/${slug}`),
  getStoreSettings: () => request('/store-settings'),

  // Admin Authentication
  loginAdmin: (credentials) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logoutAdmin: () =>
    request('/admin/logout', {
      method: 'POST',
    }),

  getMe: () => request('/admin/me'),

  // Admin Stats
  getAdminStats: () => request('/admin/stats'),

  // Admin Products
  getAdminProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return request(`/admin/products?${query.toString()}`);
  },

  getAdminProductById: (id) => request(`/admin/products/${id}`),

  createProduct: (productData) =>
    request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (id, productData) =>
    request(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    }),

  deleteProduct: (id) =>
    request(`/admin/products/${id}`, {
      method: 'DELETE',
    }),

  // Admin Categories
  getAdminCategories: () => request('/admin/categories'),

  createCategory: (categoryData) =>
    request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),

  updateCategory: (id, categoryData) =>
    request(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    }),

  deleteCategory: (id) =>
    request(`/admin/categories/${id}`, {
      method: 'DELETE',
    }),

  // Admin Store Settings
  updateStoreSettings: (settingsData) =>
    request('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settingsData),
    }),

  // Upload Images
  uploadImages: async (files) => {
    const token = localStorage.getItem('bavique_admin_token');
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const response = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Image upload failed.');
    }
    return data;
  },
};
