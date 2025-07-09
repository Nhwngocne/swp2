import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const bloodAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 30000,
});

bloodAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "bloodService request:",
      config.url,
      "Token:",
      token || "No token"
    );
    // Chỉ bỏ qua token cho GET /blood/type hoặc GET /blood/inventory
    const isGetBlood =
      config.method === "get" &&
      (config.url === "/blood/type" ||
        // config.url === "/blood/inventory" ||
        config.url.match(/^\/blood\/type\/\d+$/) ||
        config.url.match(/^\/blood\/inventory\/\d+$/));
    if (token && !isGetBlood && !config.url.includes("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !isGetBlood && !config.url.includes("/auth")) {
      console.warn("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("bloodService request error:", error);
    return Promise.reject(error);
  }
);

bloodAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("bloodService error:", {
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

export const bloodService = {
  // ==== BLOOD TYPE ====
  // Tạo loại máu
  createBloodType: (formData, config = {}) =>
    bloodAPI.post("/blood/type", formData, config),

  // Cập nhật loại máu
  updateBloodType: (typeId, formData, config = {}) =>
    bloodAPI.put(`/blood/type/${typeId}`, formData, config),

  // Xóa loại máu
  deleteBloodType: (typeId, config = {}) =>
    bloodAPI.delete(`/blood/type/${typeId}`, config),

  // Lấy tất cả loại máu
  getAllBloodTypes: (config = {}) => bloodAPI.get("/blood/type", config),

  // Lấy loại máu theo ID
  getBloodTypeById: (typeId, config = {}) =>
    bloodAPI.get(`/blood/type/${typeId}`, config),

  // ==== BLOOD INVENTORY ====
  // Tạo kho máu
  createBloodInventory: (formData, config = {}) =>
    bloodAPI.post("/blood/inventory", formData, config),

  // Cập nhật kho máu
  updateBloodInventory: (inventoryId, formData, config = {}) =>
    bloodAPI.put(`/blood/inventory/${inventoryId}`, formData, config),

  // Xóa kho máu
  deleteBloodInventory: (inventoryId, config = {}) =>
    bloodAPI.delete(`/blood/inventory/${inventoryId}`, config),

  // Lấy tất cả kho máu
  getAllBloodInventories: (config = {}) => bloodAPI.get("/blood/inventory", config),

  // Lấy kho máu theo ID
  getBloodInventoryById: (inventoryId, config = {}) =>
    bloodAPI.get(`/blood/inventory/${inventoryId}`, config),

  getAllBloodIntentForms: () => bloodIntentAPI.get("/intents/alls"),
};