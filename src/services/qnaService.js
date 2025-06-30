import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/swp391";

const qnaAPI = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 30000,
});

qnaAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(
      "qnaService request:",
      config.url,
      "Token:",
      token || "No token"
    );
    // Chỉ bỏ qua token cho GET /qna/answered, /qna/{id}
    const isGetQnA =
      config.method === "get" &&
      (config.url === "/qna/answered" ||
        config.url.match(/^\/qna\/\d+$/));
    if (token && !isGetQnA && !config.url.includes("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !isGetQnA && !config.url.includes("/auth")) {
      console.warn("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("qnaService request error:", error);
    return Promise.reject(error);
  }
);

qnaAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("qnaService error:", {
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

export const qnaService = {
  // MEMBER gửi câu hỏi
  createQuestion: (formData, config = {}) =>
    qnaAPI.post("/qna/ask", formData, config),

  // STAFF trả lời câu hỏi

answerQuestion: (data, config = {}) =>
  qnaAPI.post("/qna/answer", data, config),



  // Tất cả user xem danh sách câu hỏi đã được trả lời
  getAllAnswered: (config = {}) =>
    qnaAPI.get("/qna/answered", config),

  // STAFF xem danh sách câu hỏi chưa được trả lời
  getPendingQuestions: (config = {}) =>
    qnaAPI.get("/qna/pending", config),

  // Lấy chi tiết câu hỏi theo ID
  getQnAById: (id, config = {}) =>
    qnaAPI.get(`/qna/${id}`, config),
};