import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Auth state sync callback — set by AuthContext
let onAuthFailure = null;
export const setAuthFailureHandler = (handler) => {
  onAuthFailure = handler;
};

// Per-tab token management via sessionStorage
export const setTabToken = (token) => {
  if (token) sessionStorage.setItem('auth_token', token);
};
export const getTabToken = () => sessionStorage.getItem('auth_token');
export const clearTabToken = () => sessionStorage.removeItem('auth_token');

// Attach per-tab token to every request via Authorization header
// This takes precedence over cookies in the backend middleware,
// so each tab authenticates independently.
API.interceptors.request.use((config) => {
  const token = getTabToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses — clear auth state and redirect
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url === '/auth/me';
    if (error.response?.status === 401 && !isAuthCheck) {
      clearTabToken();
      if (onAuthFailure) onAuthFailure();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const logoutApi = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');

// Events
export const createEvent = (data) => API.post('/events', data);
export const getPublishedEvents = (page = 1, limit = 12) => API.get(`/events/published?page=${page}&limit=${limit}`);
export const getPendingEvents = () => API.get('/events/pending');
export const approveEvent = (id, status) => API.put(`/events/${id}/approve`, { status });
export const publishEvent = (id) => API.put(`/events/${id}/publish`);
export const closeEvent = (id) => API.put(`/events/${id}/close`);
export const getMyEvents = (page = 1, limit = 12) => API.get(`/events/my-events?page=${page}&limit=${limit}`);
export const getMentorHouseEvents = () => API.get('/events/mentor/house');

// Admin Events
export const createAdminEvent = (data) => API.post('/admin-events/create', data);
export const getAllAdminEvents = () => API.get('/admin-events');
export const deleteAdminEvent = (id) => API.delete(`/admin-events/${id}`);
export const updateEventPoints = (data) => API.post('/admin-events/create', data);

// Attendance
export const registerForEvent = (eventId) => API.post('/attendance/register', { eventId });
export const getEventRegistrations = (eventId) => API.get(`/attendance/event/${eventId}`);
export const markAttendance = (id, status) => API.put(`/attendance/${id}/mark`, { status });
export const getMyParticipations = (page = 1, limit = 12) => API.get(`/attendance/my-participations?page=${page}&limit=${limit}`);
// Houses
export const getAllHouses = () => API.get('/houses');
export const getLeaderboard = () => API.get('/houses/leaderboard');
export const getHouseDashboard = (houseId) => API.get(`/houses/${houseId}/dashboard`);
export const getTopPerformers = (params = {}) => API.get('/houses/top-performers', { params });
export const addPointsToStudent = (data) => API.post('/houses/add-points', data);

// Users
export const getMyRank = () => API.get('/users/my-rank');
export const updateProfile = (data) => API.put('/users/profile', data);
export const getHouseStudents = (houseId) => API.get(`/users/house/${houseId}`);
export const getStudentPoints = (id) => API.get(`/users/${id}/points`);

// Admin
export const getGlobalDashboard = () => API.get('/admin/dashboard');
export const getAdminHouseDashboard = (houseId) => API.get(`/admin/house/${houseId}`);
export const getAdminHouseEvents = (houseId) => API.get(`/admin/house/${houseId}/events`);
export const addMember = (data) => API.post('/admin/add-member', data);

export default API;
