import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Datasets
export const datasetAPI = {
  upload: (formData, onProgress) => api.post('/datasets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e => onProgress?.(Math.round(e.loaded * 100 / e.total))
  }),
  list: () => api.get('/datasets'),
  get: (id) => api.get(`/datasets/${id}`),
  preview: (id) => api.get(`/datasets/${id}/preview`),
  delete: (id) => api.delete(`/datasets/${id}`)
};

// Dashboards
export const dashboardAPI = {
  create: (data) => api.post('/dashboards', data),
  list: () => api.get('/dashboards'),
  get: (id) => api.get(`/dashboards/${id}`),
  update: (id, data) => api.put(`/dashboards/${id}`, data),
  delete: (id) => api.delete(`/dashboards/${id}`),
  compute: (id) => api.post(`/dashboards/${id}/compute`)
};

// AI
export const aiAPI = {
  generate: (data) => api.post('/ai/generate-dashboard', data),
  suggestions: (datasetId) => api.post('/ai/suggestions', { datasetId }),
  ask: (datasetId, question) => api.post('/ai/ask', { datasetId, question })
};

export default api;
