// services/bloodIntentService.js
import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const bloodIntentAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 30000,
});

// Gắn token vào mọi request nếu có
bloodIntentAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("bloodIntentService request:", config.url, "Token:", token || "No token");
    if (token && !config.url.includes("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !config.url.includes("/auth")) {
      console.warn("No token found for request:", config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Bắt lỗi và redirect nếu 401
bloodIntentAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("bloodIntentService error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const bloodIntentService = {
  // MEMBER: tạo ý định
  createBloodIntent: (formData, config = {}) =>
    bloodIntentAPI.post("/intents", formData, config),

  // STAFF: lấy toàn bộ
  getAllBloodIntents: (config = {}) =>
    bloodIntentAPI.get("/intents", config),

  // STAFF: lấy theo member
  getBloodIntentsByMember: (memberId, config = {}) =>
    bloodIntentAPI.get(`/intents/member/${memberId}`, config),

  // STAFF: lấy theo ID
  getBloodIntentById: (id, config = {}) =>
    bloodIntentAPI.get(`/intents/${id}`, config),

  // STAFF: xóa
  deleteBloodIntent: (id, config = {}) =>
    bloodIntentAPI.delete(`/intents/${id}`, config),
  // STAFF: cập nhật trạng thái
  approveBloodIntentForm: (formId, config = {}) =>
    bloodIntentAPI.post(`/intents/approve/${formId}`, {}, config),
  // STAFF: từ chối ý định
  rejectBloodIntentForm: (id, config = {}) =>
  bloodIntentAPI.post(`/intents/reject/${id}`, {}, config),

};
