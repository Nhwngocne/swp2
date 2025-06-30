import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const notificationAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 30000,
});

notificationAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("notificationService request:", config.url, "Token:", token || "No token");

    if (token && !config.url.includes("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !config.url.includes("/auth")) {
      console.warn("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("notificationService request error:", error);
    return Promise.reject(error);
  }
);

notificationAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("notificationService error:", {
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

export const notificationService = {
  // STAFF tạo thông báo cho member
  createNotificationForMember: (data, config = {}) =>
    notificationAPI.post("/notifications/member", data, config),

  // MEMBER xem tất cả notifications của chính mình
  getMyNotifications: (config = {}) =>
    notificationAPI.get("/notifications/my", config),

  // STAFF xem notifications của 1 member cụ thể
  getNotificationsByMemberId: (memberId, config = {}) =>
    notificationAPI.get(`/notifications/member/${memberId}`, config),

  // STAFF xoá notification
  deleteNotification: (notificationId, config = {}) =>
    notificationAPI.delete(`/notifications/${notificationId}`, config),

  // MEMBER gửi thông báo đến staff (bao gồm memberId để liên kết)
  createNotificationToStaff: (data, config = {}) =>
    notificationAPI.post("/notifications/to-staff", data, config),

  // MEMBER gửi thông báo chỉ đến staff (không cần memberId)
  createNotificationToStaffOnly: (data, config = {}) =>
    notificationAPI.post("/notifications/to-staff-only", data, config),

  // MEMBER hoặc STAFF mark notification là đã đọc
  markAsRead: (notificationId, config = {}) =>
    notificationAPI.put(`/notifications/${notificationId}/mark-as-read`, {}, config),

  // MEMBER hoặc STAFF đánh dấu tất cả notifications là đã đọc
  markAllAsRead: (config = {}) =>
    notificationAPI.put("/notifications/mark-all-as-read", {}, config),

  // 🆕 LẤY TẤT CẢ NOTIFICATIONS (ADMIN dùng)
  getAllNotifications: (config = {}) =>
    notificationAPI.get("/notifications", config),
};
