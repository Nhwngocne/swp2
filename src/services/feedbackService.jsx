import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const feedbackAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 30000,
});

feedbackAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "feedbackService request:",
      config.url,
      "Token:",
      token || "No token"
    );
    // Chỉ bỏ qua token cho GET /feedbacks hoặc GET /feedbacks/:id
    const isGetFeedbacks =
      config.method === "get" &&
      (config.url === "/feedbacks" || config.url.match(/^\/feedbacks\/\d+$/));
    if (token && !isGetFeedbacks && !config.url.includes("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !isGetFeedbacks && !config.url.includes("/auth")) {
      console.warn("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("feedbackService request error:", error);
    return Promise.reject(error);
  }
);

feedbackAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("feedbackService error:", {
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

export const feedbackService = {
  // FEEDBACK===================================================================
  // Tạo feedback
  createFeedback: (formData, config = {}) =>
    feedbackAPI.post("/feedbacks", formData, config),

  // Cập nhật feedback
  updateFeedback: (feedbackId, formData, config = {}) =>
    feedbackAPI.put(`/feedbacks/${feedbackId}`, formData, {
      headers: { "Content-Type": "application/json" },
      ...config,
    }),

  // Xóa feedback
  deleteFeedback: (feedbackId, config = {}) =>
    feedbackAPI.delete(`/feedbacks/${feedbackId}`, config),

  // Lấy tất cả feedback
  getAllFeedbacks: (config = {}) => feedbackAPI.get("/feedbacks", config),

  // Lấy feedback theo ID
  getFeedbackById: (feedbackId, config = {}) =>
    feedbackAPI.get(`/feedbacks/${feedbackId}`, config),
};