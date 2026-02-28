import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Add auth token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Events
export const createEvent = (data) => API.post('/events', data);
export const getPublishedEvents = () => API.get('/events/published');
export const getPendingEvents = () => API.get('/events/pending');
export const approveEvent = (id, status) => API.put(`/events/${id}/approve`, { status });
export const publishEvent = (id) => API.put(`/events/${id}/publish`);
export const getMyEvents = () => API.get('/events/my-events');
export const getEvent = (id) => API.get(`/events/${id}`);
export const getEventsByHouse = (houseId) => API.get(`/events/house/${houseId}`);
export const getMentorHouseEvents = () => API.get('/events/mentor/house');

// Attendance
export const registerForEvent = (eventId) => API.post('/attendance/register', { eventId });
export const getEventRegistrations = (eventId) => API.get(`/attendance/event/${eventId}`);
export const markAttendance = (id, status) => API.put(`/attendance/${id}/mark`, { status });
export const getMyParticipations = () => API.get('/attendance/my-participations');
export const getAllEventAttendance = (eventId) => API.get(`/attendance/event/${eventId}/all`);

// Houses
export const getAllHouses = () => API.get('/houses');
export const getHouse = (id) => API.get(`/houses/${id}`);
export const getLeaderboard = () => API.get('/houses/leaderboard');
export const getHouseDashboard = (houseId) => API.get(`/houses/${houseId}/dashboard`);

// Users
export const getMyRank = () => API.get('/users/my-rank');
export const updateProfile = (data) => API.put('/users/profile', data);

// Admin
export const getGlobalDashboard = () => API.get('/admin/dashboard');
export const getAdminHouseDashboard = (houseId) => API.get(`/admin/house/${houseId}`);
export const getAdminHouseEvents = (houseId) => API.get(`/admin/house/${houseId}/events`);

export default API;
