import axios from "axios";

// Base URL cho API
const REST_API_BASE_URL = "http://localhost:8080/swp391";

// Tạo axios instance với cấu hình mặc định
const authAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để tự động thêm token vào header
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
  (response) => response,
  (error) => {
    const isAuthFreeEndpoint =
      error.config?.url?.includes("/forgotPassword") ||
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register") ||
      error.config?.url?.includes("/auth/loginGoogle") ||
      error.config?.url?.includes("/reset-password") ||

      error.config?.url?.includes("/register/send-otp") ||    
      error.config?.url?.includes("/register/verify-otp");

       error.config?.url?.includes("/feedback");
// >>>>>>> origin/FE_Moi

    if (error.response?.status === 401 && !isAuthFreeEndpoint) {
      console.log("401 Unauthorized - URL:", error.config?.url, "Redirecting to /auth/login"); // Debug
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }else if (error.response) {
      console.log("API error:", error.config?.url, error.response.status, error.response.data); // Debug
    }

    return Promise.reject(error);
  }
);


// Auth API functions
export const authService = {
  // Đăng nhập
  login: (email, password) => authAPI.post("/auth/login", { email, password }),

  // Đăng ký
  register: (userData) => authAPI.post("/members", userData),

  // Cập nhật profile
  updateProfile: (memberId, profileData) =>
    authAPI.put(`/members/${memberId}`, profileData),

  // Đăng xuất (nếu cần gọi API)
  logout: (token) => authAPI.post("/auth/logout", { token }),
  
  // Refresh tokenx`
  refreshToken: (refreshToken) =>
    authAPI.post("/refresh-token", { refreshToken }),

  // Lấy thông tin user hiện tại
  getCurrentUser: () => authAPI.get("/auth/me"),

  // Đổi mật khẩu
  changePassword: (oldPassword, newPassword) =>
    authAPI.put("/change-password", { oldPassword, newPassword }),

  // Thay đổi mật khẩu sau khi quên
  changeForgottenPassword: (email, passwordData) =>
    authAPI.post(`/forgotPassword/changePassword/${email}`, passwordData),

  // Reset mật khẩu
  resetPassword: (token, newPassword) =>
    authAPI.post("/reset-password", { token, newPassword }),

  // verify otp(forget password)
  verifyOtp: (otp, email) =>
    authAPI.post(`/forgotPassword/verifyOtp/${otp}/${email}`),

  // Verify email(forget password)
  verifyEmail: (email) => 
    authAPI.post(`/forgotPassword/verifyMail/${email}`),

  //Verify email(register)
  sendOtp: (email) => 
    authAPI.post("/register/send-otp", { email }),

  // verify otp(register)
  verifyOtpRegis: (otp, email) => 
    authAPI.post("/register/verify-otp", { otp, email }),

  getAllUsers: () => authAPI.get("/members"),
  // Đăng nhập bằng Google

  loginWithGoogle: (idToken) =>
    authAPI.post("/auth/loginGoogle", { token: idToken }),

  // Lấy danh sách tất cả feedback
  getAllFeedback: () => authAPI.get("/feedbacks"),

  // Gửi feedback
  sendFeedback: (feedbackData) => authAPI.post("/feedbacks", feedbackData),

  

};

export default authService;
