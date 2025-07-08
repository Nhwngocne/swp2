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
  // CRUD Blood Donation
  createDonation: (donationData) => bloodAPI.post("/blood-donations", donationData),
  getAllDonations: () => bloodAPI.get("/blood-donations"),
  getDonationById: (donationId) => bloodAPI.get(`/blood-donations/${donationId}`),
  getDonationsByMemberId: (memberId) => bloodAPI.get(`/blood-donations/member/${memberId}`),
  deleteDonation: (donationId) => bloodAPI.delete(`/blood-donations/${donationId}`),
  updateDonation: (donationId, donationData) => bloodAPI.put(`/blood-donations/${donationId}`, donationData),
  generateCertificate: (donationId) =>
    bloodAPI.get(`/blood-donations/certificate/${donationId}`, { responseType: "blob" }),

  // CRUD Blood Intent Forms
  getAllBloodIntentForms: () => bloodAPI.get("/intents/alls"),

  // CRUD Blood Inventories
  getAllBloodInventories: () => bloodAPI.get("/blood/inventory"),

};

export default bloodService;
