// API Service for future backend integration
// This file will handle all API calls when you integrate with a Python backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Pages API
export const pagesApi = {
  // Get all pages
  getAll: () => apiRequest('/pages'),
  
  // Get page by ID
  getById: (id) => apiRequest(`/pages/${id}`),
  
  // Create new page
  create: (pageData) => apiRequest('/pages', {
    method: 'POST',
    body: JSON.stringify(pageData),
  }),
  
  // Update page
  update: (id, pageData) => apiRequest(`/pages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pageData),
  }),
  
  // Delete page
  delete: (id) => apiRequest(`/pages/${id}`, {
    method: 'DELETE',
  }),
  
  // Publish page
  publish: (id) => apiRequest(`/pages/${id}/publish`, {
    method: 'POST',
  }),
  
  // Unpublish page
  unpublish: (id) => apiRequest(`/pages/${id}/unpublish`, {
    method: 'POST',
  }),
};

// Widgets API
export const widgetsApi = {
  // Get all widgets for a page
  getByPage: (pageId) => apiRequest(`/pages/${pageId}/widgets`),
  
  // Get widget by ID
  getById: (id) => apiRequest(`/widgets/${id}`),
  
  // Create new widget
  create: (widgetData) => apiRequest('/widgets', {
    method: 'POST',
    body: JSON.stringify(widgetData),
  }),
  
  // Update widget
  update: (id, widgetData) => apiRequest(`/widgets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(widgetData),
  }),
  
  // Delete widget
  delete: (id) => apiRequest(`/widgets/${id}`, {
    method: 'DELETE',
  }),
  
  // Reorder widgets
  reorder: (pageId, widgetIds) => apiRequest(`/pages/${pageId}/widgets/reorder`, {
    method: 'POST',
    body: JSON.stringify({ widget_ids: widgetIds }),
  }),
  
  // Duplicate widget
  duplicate: (id) => apiRequest(`/widgets/${id}/duplicate`, {
    method: 'POST',
  }),
};

// Media API
export const mediaApi = {
  // Get all media
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/media${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get media by ID
  getById: (id) => apiRequest(`/media/${id}`),
  
  // Upload media
  upload: (file, metadata = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });
    
    return apiRequest('/media/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it for FormData
      },
      body: formData,
    });
  },
  
  // Update media metadata
  update: (id, metadata) => apiRequest(`/media/${id}`, {
    method: 'PUT',
    body: JSON.stringify(metadata),
  }),
  
  // Delete media
  delete: (id) => apiRequest(`/media/${id}`, {
    method: 'DELETE',
  }),
  
  // Generate thumbnail
  generateThumbnail: (id) => apiRequest(`/media/${id}/thumbnail`, {
    method: 'POST',
  }),
};

// Links API
export const linksApi = {
  // Get all links
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/links${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get link by ID
  getById: (id) => apiRequest(`/links/${id}`),
  
  // Create new link
  create: (linkData) => apiRequest('/links', {
    method: 'POST',
    body: JSON.stringify(linkData),
  }),
  
  // Update link
  update: (id, linkData) => apiRequest(`/links/${id}`, {
    method: 'PUT',
    body: JSON.stringify(linkData),
  }),
  
  // Delete link
  delete: (id) => apiRequest(`/links/${id}`, {
    method: 'DELETE',
  }),
  
  // Validate link
  validate: (url) => apiRequest('/links/validate', {
    method: 'POST',
    body: JSON.stringify({ url }),
  }),
};

// Settings API
export const settingsApi = {
  // Get settings
  get: () => apiRequest('/settings'),
  
  // Update settings
  update: (settings) => apiRequest('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
  
  // Reset settings to default
  reset: () => apiRequest('/settings/reset', {
    method: 'POST',
  }),
};

// Users API
export const usersApi = {
  // Get current user
  getCurrent: () => apiRequest('/users/me'),
  
  // Get all users
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get user by ID
  getById: (id) => apiRequest(`/users/${id}`),
  
  // Update user profile
  updateProfile: (userData) => apiRequest('/users/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  // Change password
  changePassword: (passwordData) => apiRequest('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }),
};

// Export/Import API
export const exportImportApi = {
  // Export all data
  export: (format = 'json') => apiRequest(`/export?format=${format}`),
  
  // Import data
  import: (data, options = {}) => apiRequest('/import', {
    method: 'POST',
    body: JSON.stringify({ data, options }),
  }),
  
  // Get export history
  getExportHistory: () => apiRequest('/export/history'),
  
  // Download export file
  downloadExport: (exportId) => apiRequest(`/export/${exportId}/download`),
};

// Analytics API
export const analyticsApi = {
  // Get page views
  getPageViews: (pageId, period = '30d') => apiRequest(`/analytics/pages/${pageId}/views?period=${period}`),
  
  // Get site statistics
  getSiteStats: () => apiRequest('/analytics/site/stats'),
  
  // Get popular content
  getPopularContent: (limit = 10) => apiRequest(`/analytics/content/popular?limit=${limit}`),
};

// Authentication API
export const authApi = {
  // Login
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  // Logout
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
  
  // Refresh token
  refreshToken: () => apiRequest('/auth/refresh', {
    method: 'POST',
  }),
  
  // Register
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

// WebSocket connection for real-time updates
export const createWebSocketConnection = (token) => {
  const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws?token=${token}`;
  return new WebSocket(wsUrl);
};

// Error handling utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      code: error.response.data?.code,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 0,
      code: 'NETWORK_ERROR',
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      code: 'UNKNOWN_ERROR',
    };
  }
};

export default {
  pages: pagesApi,
  widgets: widgetsApi,
  media: mediaApi,
  links: linksApi,
  settings: settingsApi,
  users: usersApi,
  exportImport: exportImportApi,
  analytics: analyticsApi,
  auth: authApi,
  createWebSocketConnection,
  handleApiError,
};
