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
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/apply') && !path.includes('/join') && !path.includes('/applicant')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const login = (data) => api.post('/auth/login', data);
export const registerSchool = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Schools (Super Admin)
export const getSchools = (params) => api.get('/schools', { params });
export const getSchool = (id) => api.get(`/schools/${id}`);
export const updateSchool = (id, data) => api.put(`/schools/${id}`, data);
export const toggleSchoolStatus = (id) => api.patch(`/schools/${id}/toggle-status`);
export const getPlatformStats = () => api.get('/schools/stats');

// Super Admin
export const getSuperAdminDashboard = () => api.get('/admin/dashboard');
export const getAdmins = (params) => api.get('/admin/admins', { params });

// Plans
export const getPlans = () => api.get('/plans');
export const createPlan = (data) => api.post('/plans', data);
export const updatePlan = (id, data) => api.put(`/plans/${id}`, data);
export const deletePlan = (id) => api.delete(`/plans/${id}`);

// Credit Packages
export const getCreditPackages = () => api.get('/credit-packages');
export const createCreditPackage = (data) => api.post('/credit-packages', data);
export const updateCreditPackage = (id, data) => api.put(`/credit-packages/${id}`, data);
export const deleteCreditPackage = (id) => api.delete(`/credit-packages/${id}`);

// Locations
export const getStates = () => api.get('/locations/states');
export const getCities = (stateId) =>
  api.get('/locations/cities', { params: stateId ? { stateId } : {} });
export const getLocalities = (params) => api.get('/locations/localities', { params });
export const createState = (data) => api.post('/locations/states', data);
export const createCity = (data) => api.post('/locations/cities', data);
export const createLocality = (data) => api.post('/locations/localities', data);
export const updateState = (id, data) => api.put(`/locations/states/${id}`, data);
export const updateCity = (id, data) => api.put(`/locations/cities/${id}`, data);
export const updateLocality = (id, data) => api.put(`/locations/localities/${id}`, data);
export const deleteState = (id) => api.delete(`/locations/states/${id}`);
export const deleteCity = (id) => api.delete(`/locations/cities/${id}`);
export const deleteLocality = (id) => api.delete(`/locations/localities/${id}`);

// Credits
export const getSchoolCredits = () => api.get('/credits');
export const getUnlockHistory = () => api.get('/credits/history');
export const purchaseCreditPackage = (packageId) => api.post('/credits/purchase', { packageId });
export const assignCreditsToSchool = (data) => api.post('/credits/assign', data);

// Candidates
export const getCandidates = (params) => api.get('/candidates', { params });
export const getCandidate = (id) => api.get(`/candidates/${id}`);
export const unlockCandidate = (id) => api.post(`/candidates/${id}/unlock`);
export const checkDuplicate = (params) => api.get('/candidates/check-duplicate', { params });
export const createCandidate = (data) => api.post('/candidates', data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
export const getDashboardStats = () => api.get('/candidates/dashboard');

// Import
export const importSingleCandidate = (data) => api.post('/import/single', data);
export const importBulkCandidates = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/import/bulk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Application Links
export const getApplicationLink = () => api.get('/application/link');
export const getApplicationQR = () => api.get('/application/qr');
export const getSchoolBySlug = (slug) => api.get(`/application/school/${slug}`);
export const submitApplication = (slug, data) => api.post(`/application/submit/${slug}`, data);
export const submitPublicApplication = (data) => api.post('/applicant/apply', data);

// Applicant
export const registerApplicant = (data) => api.post('/applicant/register', data);
export const getApplicantProfile = () => api.get('/applicant/profile');
export const updateApplicantProfile = (data) => api.put('/applicant/profile', data);
export const getApplicantDashboard = () => api.get('/applicant/dashboard');
export const getReceivedRequests = () => api.get('/applicant/requests');
export const getRequestSchoolDetails = (requestId) => api.get(`/applicant/requests/${requestId}/school`);
export const getApplicantSubscription = () => api.get('/applicant/subscription');
export const getApplicantSubscriptionHistory = () => api.get('/applicant/subscription/history');
export const purchaseApplicantPlan = (planId) => api.post('/applicant/subscription/purchase', { planId });

// Applicant Plans (Super Admin)
export const getApplicantPlans = () => api.get('/applicant-plans');
export const createApplicantPlan = (data) => api.post('/applicant-plans', data);
export const updateApplicantPlan = (id, data) => api.put(`/applicant-plans/${id}`, data);
export const deleteApplicantPlan = (id) => api.delete(`/applicant-plans/${id}`);

// Interest Requests (School Admin)
export const sendInterestRequest = (data) => api.post('/interest-requests', data);
export const getSentInterestRequests = () => api.get('/interest-requests/sent');
export const getInterestRequestStatus = (candidateId) => api.get(`/interest-requests/status/${candidateId}`);

// Notifications (Applicant)
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.patch('/notifications/read-all');

// Settings
export const getSettings = () => api.get('/settings');
export const addSettingItem = (data) => api.post('/settings/add', data);
export const removeSettingItem = (data) => api.post('/settings/remove', data);

export const uploadPublicFiles = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  return api.post('/upload/public', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Upload
export const uploadFiles = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
