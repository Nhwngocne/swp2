import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { qnaService } from "../services/qnaService";
import { useAuth } from "../services/AuthContext";
import axios from "axios";

const QnAContext = createContext();

export const useQnA = () => {
  const context = useContext(QnAContext);
  if (!context) {
    throw new Error("useQnA phải được dùng trong QnAProvider");
  }
  return context;
};

export const QnAProvider = ({ children }) => {
  const { user } = useAuth();
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  // Mapping cho QnAResponse
  const mapQnAResponse = (qna) => ({
    id: qna.id,
    question: qna.question || "",
    answer: qna.answer || "",
    member: {
      id: qna.member?.id || 0,
      fullName: qna.member?.fullName || "Không xác định",
    },
    staff: {
      id: qna.staff?.id || 0,
      fullName: qna.staff?.fullName || "Không xác định",
    },
    createdAt: qna.createdAt,
    answeredAt: qna.answeredAt,
  });

  // ===== Q&A Operations =====
  const fetchAnsweredQuestions = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy tất cả câu hỏi đã trả lời từ /swp391/qna/answered");
      const source = axios.CancelToken.source();
      const response = await qnaService.getAllAnswered({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedQuestions = response.data.map(mapQnAResponse);
      setAnsweredQuestions(mappedQuestions);
      setError(null);
      return { success: true, questions: mappedQuestions };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy câu hỏi đã trả lời:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy câu hỏi đã trả lời:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải câu hỏi đã trả lời";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const fetchPendingQuestions = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy tất cả câu hỏi chưa trả lời từ /swp391/qna/pending");
      const source = axios.CancelToken.source();
      const response = await qnaService.getPendingQuestions({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedQuestions = response.data.map(mapQnAResponse);
      setPendingQuestions(mappedQuestions);
      setError(null);
      return { success: true, questions: mappedQuestions };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy câu hỏi chưa trả lời:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy câu hỏi chưa trả lời:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải câu hỏi chưa trả lời";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const getQnAById = async (id) => {
    try {
      setLoading(true);
      console.log(`Đang lấy câu hỏi ${id} từ /swp391/qna/${id}`);
      const source = axios.CancelToken.source();
      const response = await qnaService.getQnAById(id, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedQuestion = mapQnAResponse(response.data);
      setError(null);
      return { success: true, question: mappedQuestion };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy câu hỏi:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy câu hỏi:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải câu hỏi";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData) => {
    try {
      setLoading(true);
      console.log("Đang tạo câu hỏi tại /swp391/qna/ask");
      if (!user || !user.id || !user.roles.includes("MEMBER"))
        throw new Error("Người dùng không có quyền MEMBER hoặc chưa xác thực.");
      const payload = {
        question: questionData.question,
      };
      const source = axios.CancelToken.source();
      const response = await qnaService.createQuestion(payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newQuestion = mapQnAResponse(response.data);
      setAnsweredQuestions((prev) => [...prev, newQuestion]);
      setError(null);
      return {
        success: true,
        message: "Tạo câu hỏi thành công",
        question: newQuestion,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo câu hỏi:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo câu hỏi:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Tạo câu hỏi thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (answerData) => {
    try {
      setLoading(true);
      console.log("Đang trả lời câu hỏi tại /swp391/qna/answer");
      if (!user || !user.id || !user.roles.includes("STAFF"))
        throw new Error("Người dùng không có quyền STAFF hoặc chưa xác thực.");
      const payload = {
        qnaId: answerData.qnaId,
        answer: answerData.answer,
      };
      const source = axios.CancelToken.source();
      const response = await qnaService.answerQuestion(payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedQuestion = mapQnAResponse(response.data);
      setAnsweredQuestions((prev) =>
        prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
      );
      setPendingQuestions((prev) =>
        prev.filter((q) => q.id !== updatedQuestion.id)
      );
      setError(null);
      return {
        success: true,
        message: "Trả lời câu hỏi thành công",
        question: updatedQuestion,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy trả lời câu hỏi:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi trả lời câu hỏi:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Trả lời câu hỏi thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnsweredQuestions();
    if (user && user.roles.includes("STAFF")) {
      fetchPendingQuestions();
    }
  }, [fetchAnsweredQuestions, fetchPendingQuestions, user]);

  const value = {
    answeredQuestions,
    pendingQuestions,
    loading,
    error,
    fetchAnsweredQuestions,
    fetchPendingQuestions,
    getQnAById,
    createQuestion,
    answerQuestion,
  };

  return <QnAContext.Provider value={value}>{children}</QnAContext.Provider>;
};