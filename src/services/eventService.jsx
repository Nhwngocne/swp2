import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/swp391';

const eventAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 giây
});

eventAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const eventService = {
  getEvents: (config = {}) => eventAPI.get('/events', config),
};