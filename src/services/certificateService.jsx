import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const certificateAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 30000,
});

certificateAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "certificateService request:",
      config.url,
      "Token:",
      token || "No token"
    );
    // Chỉ bỏ qua token cho GET /api/certificates/:id hoặc /api/certificates/by-donation/:id
    const isGetCertificates =
      config.method === "get" &&
      (config.url.match(/^\/api\/certificates\/\d+$/) ||
        config.url.match(/^\/api\/certificates\/by-donation\/\d+$/||
        config.url.match(/^\/lookup\/\d+\/\d+$/))
        );
    if (token && !isGetCertificates && !config.url.includes("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !isGetCertificates && !config.url.includes("/auth")) {
      console.warn("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("certificateService request error:", error);
    return Promise.reject(error);
  }
);

certificateAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("certificateService error:", {
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

export const certificateService = {
  // Tạo chứng chỉ (upload file) - STAFF
  uploadCertificate: (formData, config = {}) =>
    certificateAPI.post("/api/certificates/upload", formData, config),

  // Lấy chứng chỉ theo ID
  getCertificateById: (id, config = {}) =>
    certificateAPI.get(`/api/certificates/${id}`, config),

  // Lấy chứng chỉ theo donationHistoryId
  getCertificateByDonationHistoryId: (donationHistoryId, config = {}) =>
    certificateAPI.get(`/api/certificates/by-donation/${donationHistoryId}`, config),

  // Lookup tương thích máu (BloodType & BloodComponent)
  lookupBloodCompatibility: (componentId = 0, bloodTypeId = 0, config = {}) =>
    certificateAPI.get(`/lookup/${componentId}/${bloodTypeId}`, config),
};