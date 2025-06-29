import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const donationAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 30000,
});

donationAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "donationService request:",
      config.url,
      "Token:",
      token || "No token"
    );
    // Chỉ bỏ qua token cho GET /donations/histories, /donations/offline, /donations/receive/:id
    const isGetDonations =
      config.method === "get" &&
      (
        config.url === "/donations/offline" ||
        config.url.match(/^\/donations\/histories\/\d+$/) ||
        config.url.match(/^\/donations\/offline\/\d+$/) ||
        config.url.match(/^\/donations\/receive\/\d+$/));
    if (token && !isGetDonations && !config.url.includes("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !isGetDonations && !config.url.includes("/auth")) {
      console.warn("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("donationService request error:", error);
    return Promise.reject(error);
  }
);

donationAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("donationService error:", {
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

export const donationService = {
  // ===== Donation History =====
  createDonationHistory: (formData, config = {}) =>
    donationAPI.post("/donations/histories", formData, config),
  getDonationHistoryById: (id, config = {}) =>
    donationAPI.get(`/donations/histories/${id}`, config),
  getAllDonationHistories: (config = {}) =>
    donationAPI.get("/donations/histories", config),
  updateDonationHistory: (id, formData, config = {}) =>
    donationAPI.put(`/donations/histories/${id}`, formData, config),
  deleteDonationHistory: (id, config = {}) =>
    donationAPI.delete(`/donations/histories/${id}`, config),
  getDonationHistoriesByMemberId: (memberId, config = {}) =>
    donationAPI.get(`/donations/histories/member/${memberId}`, config),
  // ===== Donation Registration =====
  createDonationRegistration: (formData, config = {}) =>
    donationAPI.post("/donations/registrations", formData, config),
  updateDonationRegistration: (id, formData, config = {}) =>
    donationAPI.put(`/donations/registrations/${id}`, formData, config),
  deleteDonationRegistration: (id, config = {}) =>
    donationAPI.delete(`/donations/registrations/${id}`, config),
  getDonationRegistrationsByMember: (memberId, config = {}) =>
    donationAPI.get(`/forms/member/${memberId}`, config),

  // ===== Regis Offline =====
  createRegisOffline: (formData, config = {}) =>
    donationAPI.post("/donations/offline", formData, config),
  getRegisOfflineById: (id, config = {}) =>
    donationAPI.get(`/donations/offline/${id}`, config),
  getAllRegisOffline: (config = {}) =>
    donationAPI.get("/donations/offline", config),
  updateRegisOffline: (id, formData, config = {}) =>
    donationAPI.put(`/donations/offline/${id}`, formData, config),
  deleteRegisOffline: (id, config = {}) =>
    donationAPI.delete(`/donations/offline/${id}`, config),

  // ===== Regis Receive from Registration =====
  createRegisReceiveFromRegistration: (formData, config = {}) =>
    donationAPI.post("/donations/receive-from-registration", formData, config),
  getRegisReceiveById: (id, config = {}) =>
    donationAPI.get(`/donations/receive/${id}`, config),
  updateRegisReceiveFromRegistration: (id, formData, config = {}) =>
    donationAPI.put(`/donations/receive/${id}`, formData, config),
  deleteRegisReceive: (id, config = {}) =>
    donationAPI.delete(`/donations/receive/${id}`, config),

  getAllForms: (config = {}) => donationAPI.get("/blood-donation-forms", config),
};