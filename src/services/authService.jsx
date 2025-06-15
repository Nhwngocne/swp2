import axios from "axios";

// Base URL cho API
const REST_API_BASE_URL = 'http://localhost:8080/swp391';

// Tạo axios instance với cấu hình mặc định
const authAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm token vào header
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và error
authAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authService = {
  // Đăng nhập
  login: (email, password) => 
    authAPI.post('/auth/login', { email, password }),

  // Đăng ký
  register: (userData) => 
    authAPI.post('/members', userData),

  // Cập nhật profile
  updateProfile: (profileData) => 
    authAPI.put('/profile', profileData),

  // Đăng xuất (nếu cần gọi API)
  logout: () => 
    authAPI.post('/logout'),

  // Refresh tokenx`
  refreshToken: (refreshToken) => 
    authAPI.post('/refresh-token', { refreshToken }),

  // Lấy thông tin user hiện tại
  getCurrentUser: () => 
    authAPI.get('/auth/me'),

  // Đổi mật khẩu
  changePassword: (oldPassword, newPassword) => 
    authAPI.put('/change-password', { oldPassword, newPassword }),

  // Quên mật khẩu
  forgotPassword: (email) => 
    authAPI.post('/forgot-password', { email }),

  // Reset mật khẩu
  resetPassword: (token, newPassword) => 
    authAPI.post('/reset-password', { token, newPassword }),

  // Verify email
  verifyEmail: (token) => 
    authAPI.post('/verify-email', { token }),

  getAllUsers: () => 
  authAPI.get('/members'),
};



export default authService;