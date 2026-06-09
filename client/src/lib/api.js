import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Schools (Super Admin)
export const getSchools = (params) => api.get('/schools', { params });
export const getSchool = (id) => api.get(`/schools/${id}`);
export const createSchool = (data) => api.post('/schools', data);
export const updateSchool = (id, data) => api.put(`/schools/${id}`, data);
export const toggleSchoolStatus = (id) => api.patch(`/schools/${id}/toggle-status`);
export const getPlatformStats = () => api.get('/schools/stats');

// Candidates
export const getCandidates = (params) => api.get('/candidates', { params });
export const getCandidate = (id) => api.get(`/candidates/${id}`);
export const checkDuplicate = (params) => api.get('/candidates/check-duplicate', { params });
export const createCandidate = (data) => api.post('/candidates', data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
export const getDashboardStats = () => api.get('/candidates/dashboard');

// Settings
export const getSettings = () => api.get('/settings');
export const addSettingItem = (data) => api.post('/settings/add', data);
export const removeSettingItem = (data) => api.post('/settings/remove', data);

// Upload
export const uploadFiles = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
