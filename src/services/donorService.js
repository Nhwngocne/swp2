import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const donorAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 30000,
});

donorAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

donorAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const donorService = {
  searchNearestDonors: (data) => donorAPI.post("/donors/search", data),
  getGeocode: (address) => donorAPI.get(`/donors/geocode?address=${encodeURIComponent(address)}`),
  getRoute: (origin, destination) =>
    axios.get(
      `https://rsapi.goong.io/Direction?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&vehicle=car&api_key=fYkDka9BdVPjFXwOG2Yoc2gyj15vfkdfC711wR8u`
    ),
};