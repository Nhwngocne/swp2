import axios from "axios";

// Base URL cho API
const REST_API_BASE_URL = "http://localhost:8080/swp391";

// Tạo axios instance với cấu hình mặc định
const bloodAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để tự động thêm token vào header
bloodAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý response và error
bloodAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublicEndpoint = error.config?.url?.includes("/feedback");

    if (error.response?.status === 401 && !isPublicEndpoint) {
      console.log("401 Unauthorized - URL:", error.config?.url, "Redirecting to /auth/login");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    } else if (error.response) {
      console.log("API error:", error.config?.url, error.response.status, error.response.data);
    }

    return Promise.reject(error);
  }
);

// BloodService API functions
export const bloodService = {
  // Tạo mới một bản ghi hiến máu
  createDonation: (donationData) => bloodAPI.post("/blood-donations", donationData),

  // Lấy danh sách tất cả các lần hiến máu
  getAllDonations: () => bloodAPI.get("/blood-donations"),

  // Lấy thông tin hiến máu theo ID
  getDonationById: (donationId) => bloodAPI.get(`/blood-donations/${donationId}`),

  // Lấy danh sách hiến máu theo ID thành viên
  getDonationsByMemberId: (memberId) => bloodAPI.get(`/blood-donations/member/${memberId}`),

  // Xóa bản ghi hiến máu
  deleteDonation: (donationId) => bloodAPI.delete(`/blood-donations/${donationId}`),

  // Cập nhật bản ghi hiến máu
  updateDonation: (donationId, donationData) => bloodAPI.put(`/blood-donations/${donationId}`, donationData),

  // Tạo giấy chứng nhận hiến máu (nếu có chức năng này)
  generateCertificate: (donationId) => bloodAPI.get(`/blood-donations/certificate/${donationId}`, { responseType: "blob" }),
};

export default bloodService;
