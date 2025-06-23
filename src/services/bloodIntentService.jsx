import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const bloodIntentAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 30000,
});

bloodIntentAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "bloodIntentService request:",
      config.url,
      "Token:",
      token || "No token"
    );
    // Chỉ bỏ qua token cho GET /api/intents hoặc GET /api/intents/:id
    const isGetIntents =
      config.method === "get" &&
      (config.url === "/api/intents" ||
        config.url.match(/^\/api\/intents\/\d+$/) ||
        config.url.match(/^\/api\/intents\/member\/\d+$/));
    if (token && !isGetIntents && !config.url.includes("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !isGetIntents && !config.url.includes("/auth")) {
      console.warn("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("bloodIntentService request error:", error);
    return Promise.reject(error);
  }
);

bloodIntentAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("bloodIntentService error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      console.log("401 detected, clearing auth data");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const bloodIntentService = {
  // Tạo ý định hiến/nhận máu (MEMBER)
  createBloodIntent: (formData, config = {}) =>
    bloodIntentAPI.post("/api/intents", formData, config),

  // Lấy tất cả ý định (STAFF)
  getAllBloodIntents: (config = {}) => bloodIntentAPI.get("/api/intents", config),

  // Lấy ý định theo member (STAFF)
  getBloodIntentsByMember: (memberId, config = {}) =>
    bloodIntentAPI.get(`/api/intents/member/${memberId}`, config),

  // Lấy ý định theo ID (STAFF)
  getBloodIntentById: (id, config = {}) =>
    bloodIntentAPI.get(`/api/intents/${id}`, config),

  // Xóa ý định (STAFF)
  deleteBloodIntent: (id, config = {}) =>
    bloodIntentAPI.delete(`/api/intents/${id}`, config),
};