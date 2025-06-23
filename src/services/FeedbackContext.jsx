import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { feedbackService } from "../services/feedbackService";
import { useAuth } from "../services/AuthContext";
import axios from "axios";

const FeedbackContext = createContext();

export const useFeedbacks = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedbacks phải được dùng trong FeedbackProvider");
  }
  return context;
};

export const FeedbackProvider = ({ children }) => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  const mapFeedback = (feedback) => ({
    id: feedback.id,
    content: feedback.content || "Không có nội dung",
    rating: feedback.rating || 0,
    createdAt: feedback.createdAt,
    member: feedback.member || { id: 0, name: "Không xác định" },
  });

  const fetchFeedbacks = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy feedback từ /swp391/feedbacks");
      const source = axios.CancelToken.source();
      const response = await feedbackService.getAllFeedbacks({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedFeedbacks = response.data.result.map(mapFeedback);
      setFeedbacks(mappedFeedbacks);
      setError(null);
      return { success: true, feedbacks: mappedFeedbacks };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy feedback:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy feedback:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải feedback";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const getFeedbackById = async (feedbackId) => {
    try {
      setLoading(true);
      console.log(`Đang lấy feedback ${feedbackId} từ /swp391/feedbacks/${feedbackId}`);
      const source = axios.CancelToken.source();
      const response = await feedbackService.getFeedbackById(feedbackId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedFeedback = mapFeedback(response.data.result);
      setError(null);
      return { success: true, feedback: mappedFeedback };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy feedback:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy feedback:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải feedback";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createFeedback = async (feedbackData) => {
    try {
      setLoading(true);
      console.log("Đang tạo feedback tại /swp391/feedbacks");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = { content: feedbackData.content, rating: feedbackData.rating };
      const source = axios.CancelToken.source();
      const response = await feedbackService.createFeedback(payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newFeedback = mapFeedback(response.data.result);
      setFeedbacks((prev) => [...prev, newFeedback]);
      setError(null);
      return { success: true, message: "Tạo feedback thành công", feedback: newFeedback };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo feedback:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo feedback:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Tạo feedback thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = async (feedbackId, feedbackData) => {
    try {
      setLoading(true);
      console.log(`Đang cập nhật feedback ${feedbackId} tại /swp391/feedbacks/${feedbackId}`);
      const payload = { content: feedbackData.content, rating: feedbackData.rating };
      const source = axios.CancelToken.source();
      const response = await feedbackService.updateFeedback(feedbackId, payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedFeedback = mapFeedback(response.data.result);
      setFeedbacks((prev) =>
        prev.map((feedback) => (feedback.id === feedbackId ? updatedFeedback : feedback))
      );
      setError(null);
      return { success: true, message: "Cập nhật feedback thành công", feedback: updatedFeedback };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy cập nhật feedback:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi cập nhật feedback:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Cập nhật feedback thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (feedbackId) => {
    try {
      setLoading(true);
      console.log(`Đang xóa feedback ${feedbackId} tại /swp391/feedbacks/${feedbackId}`);
      const source = axios.CancelToken.source();
      await feedbackService.deleteFeedback(feedbackId, {
        cancelToken: source.token,
      });
      console.log("Xóa feedback thành công");
      setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== feedbackId));
      setError(null);
      return { success: true, message: "Xóa feedback thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa feedback:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa feedback:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa feedback thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const value = {
    feedbacks,
    loading,
    error,
    fetchFeedbacks,
    getFeedbackById,
    createFeedback,
    updateFeedback,
    deleteFeedback,
  };

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
};