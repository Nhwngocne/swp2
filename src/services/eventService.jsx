import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const eventAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  timeout: 30000,
});

eventAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "eventService request:",
      config.url,
      "Token:",
      token || "No token"
    );
    // Chỉ bỏ qua token cho GET /events hoặc GET /events/:id
    const isGetEvents =
      config.method === "get" &&
      (config.url === "/events" ||
        config.url.match(/^\/events\/\d+$/) ||
        config.url === "/blogs" ||
        config.url.match(/^\/blogs\/\d+$/));
    if (token && !isGetEvents && !config.url.includes("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !isGetEvents && !config.url.includes("/auth")) {
      console.warn("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("eventService request error:", error);
    return Promise.reject(error);
  }
);

eventAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("eventService error:", {
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

export const eventService = {
  //EVENT===================================================================
  // Lấy tất cả sự kiện
  getEvents: (config = {}) => eventAPI.get("/events", config),

  // Lấy sự kiện theo ID
  getEventById: (eventId, config = {}) =>
    eventAPI.get(`/events/${eventId}`, config),

  // Tạo sự kiện
  createEvent: (formData, config = {}) =>
    eventAPI.post("/events", formData, config), // Không cần headers ở đây

  // Cập nhật sự kiện
  updateEvent: (eventId, formData, config = {}) =>
    eventAPI.put(`/events/${eventId}`, formData, config),

  // Xóa sự kiện
  deleteEvent: (eventId, config = {}) =>
    eventAPI.delete(`/events/${eventId}`, config),

  //FORM EVENT=====================================================================
  // Tạo biểu mẫu hiến máu
  createBloodDonationForm: (formData, config = {}) =>
    eventAPI.post("/forms", formData, config),

  // Cập nhật biểu mẫu hiến máu (dành cho staff)
  updateBloodDonationFormByStaff: (formData, config = {}) =>
    eventAPI.put("/forms/approve", formData, config),

  // Cập nhật biểu mẫu hiến máu (dành cho member)
  updateBloodDonationFormByMember: (formId, memberId, formData, config = {}) =>
    eventAPI.put(`/forms/${formId}/member/${memberId}`, formData, config),

  // Xóa biểu mẫu hiến máu
  deleteBloodDonationForm: (formId, config = {}) =>
    eventAPI.delete(`/forms/${formId}`, config),

  // Lấy tất cả biểu mẫu hiến máu
  getAllBloodDonationForms: (config = {}) => eventAPI.get("/forms", config),

  // Lấy biểu mẫu hiến máu theo ID
  getBloodDonationFormById: (formId, config = {}) =>
    eventAPI.get(`/forms/${formId}`, config),

  // Lấy tất cả biểu mẫu của một thành viên
  getBloodDonationFormsByMember: (memberId, config = {}) =>
    eventAPI.get(`/forms/member/${memberId}`, config),

  // Lấy biểu mẫu cụ thể của một thành viên
  getBloodDonationFormByMemberAndId: (formId, memberId, config = {}) =>
    eventAPI.get(`/forms/${formId}/member/${memberId}`, config),

  // Lấy tất cả biểu mẫu của một sự kiện
  getBloodDonationFormsByEvent: (eventId, config = {}) =>
    eventAPI.get(`/forms/event/${eventId}`, config),

  // BLOG=======================================================================
  // Lấy tất cả blog
  getBlogs: (config = {}) => eventAPI.get("/blogs", config),

  // Lấy blog theo ID
  getBlogById: (blogId, config = {}) =>
    eventAPI.get(`/blogs/${blogId}`, config),

  // Tạo blog
  createBlog: (formData, config = {}) =>
    eventAPI.post("/blogs", formData, config),

  // Cập nhật blog
  updateBlog: (blogId, formData, config = {}) =>
    eventAPI.put(`/blogs/${blogId}`, formData, config),

  // Xóa blog
  deleteBlog: (blogId, config = {}) =>
    eventAPI.delete(`/blogs/${blogId}`, config),
};
