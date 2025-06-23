import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const emergencyAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 30000,
});

emergencyAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "emergencyService request:",
      config.url,
      "Token:",
      token || "No token"
    );
    // Chỉ bỏ qua token cho GET /emergencies/emergency, /emergencies/nearbyDonors
    const isGetEmergencies =
      config.method === "get" &&
      (config.url === "/emergencies/emergency" ||
        config.url === "/emergencies/nearbyDonors" ||
        config.url.match(/^\/emergencies\/emergency\/\d+$/) ||
        config.url.match(/^\/emergencies\/nearbyDonors\/\d+$/));
    if (token && !isGetEmergencies && !config.url.includes("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !isGetEmergencies && !config.url.includes("/auth")) {
      console.warn("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("emergencyService request error:", error);
    return Promise.reject(error);
  }
);

emergencyAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("emergencyService error:", {
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

export const emergencyService = {
  // ===== Emergency Request =====
  createEmergencyRequest: (formData, config = {}) =>
    emergencyAPI.post("/emergencies/emergency", formData, config),
  getEmergencyRequestById: (emergencyId, config = {}) =>
    emergencyAPI.get(`/emergencies/emergency/${emergencyId}`, config),
  getAllEmergencyRequests: (config = {}) =>
    emergencyAPI.get("/emergencies/emergency", config),
  updateEmergencyRequest: (emergencyId, formData, config = {}) =>
    emergencyAPI.put(`/emergencies/emergency/${emergencyId}`, formData, config),
  deleteEmergencyRequest: (emergencyId, config = {}) =>
    emergencyAPI.delete(`/emergencies/emergency/${emergencyId}`, config),

  // ===== Nearby Donors =====
  getAllNearbyDonors: (config = {}) =>
    emergencyAPI.get("/emergencies/nearbyDonors", config),
  getNearbyDonorById: (nearbyDonorId, config = {}) =>
    emergencyAPI.get(`/emergencies/nearbyDonors/${nearbyDonorId}`, config),
};