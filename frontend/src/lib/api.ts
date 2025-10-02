// API Service Layer for Frontend-Backend Communication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to create headers
const createHeaders = (includeAuth: boolean = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Handle API errors
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // If response is not JSON, use status text or default message
      errorMessage = response.statusText || `HTTP error! status: ${response.status}`;
    }
    
    // Add status code to error message for better debugging
    const error = new Error(errorMessage) as Error & { status: number };
    error.status = response.status;
    throw error;
  }
  return response.json();
};

// ========================================
// PRODUCTS API
// ========================================

export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'name';
}

export const productsApi = {
  getAll: async (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return handleResponse(response);
  },

  getBySlug: async (slug: string) => {
    const response = await fetch(`${API_URL}/products/slug/${slug}`);
    return handleResponse(response);
  },

  create: async (data: unknown) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: unknown) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete product`);
    }
  },
};

// ========================================
// CATEGORIES API
// ========================================

export const categoriesApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/categories`);
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/categories/${id}`);
    return handleResponse(response);
  },

  getBySlug: async (slug: string) => {
    const response = await fetch(`${API_URL}/categories/slug/${slug}`);
    return handleResponse(response);
  },

  create: async (data: { name: string; slug: string }) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: { name?: string; slug?: string }) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete category`);
    }
  },
};

// ========================================
// ORDERS API
// ========================================

export const ordersApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  create: async (data: unknown) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: unknown) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete order`);
    }
  },
};

// ========================================
// USERS API
// ========================================

export const usersApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: unknown) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user`);
    }
  },
};

// ========================================
// AUTH API
// ========================================

export const authApi = {
  register: async (data: { email: string; password: string; name?: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// ========================================
// REVIEWS API
// ========================================

export const reviewsApi = {
  getByProduct: async (productId: string) => {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`);
    return handleResponse(response);
  },

  canReview: async (productId: string) => {
    const response = await fetch(`${API_URL}/products/${productId}/reviews/can-review`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  create: async (productId: string, data: { orderId: string; rating: number; comment?: string }) => {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (productId: string, reviewId: string) => {
    const response = await fetch(`${API_URL}/products/${productId}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete review`);
    }
  },
};

// Export API_URL for other uses
export { API_URL };



