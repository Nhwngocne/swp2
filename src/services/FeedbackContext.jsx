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
    throw new Error("useFeedbacks must be used within a FeedbackProvider");
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
    content: feedback.content || "No content",
    rating: feedback.rating || 0,
    createdAt: feedback.createdAt,
    member: feedback.member || { id: 0, name: "Unknown" },
  });

  const fetchFeedbacks = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Fetching feedbacks from /swp391/feedbacks");
      const token = localStorage.getItem("token");
      const source = axios.CancelToken.source();
      const response = await feedbackService.getAllFeedbacks({
        cancelToken: source.token,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("API response:", response.data);
      const mappedFeedbacks = response.data.result.map(mapFeedback);
      setFeedbacks(mappedFeedbacks);
      setError(null);
      return { success: true, feedbacks: mappedFeedbacks };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Fetch feedbacks cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Fetch feedbacks error:", error.response?.status, error.message);
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : error.response?.data?.message || "Không thể tải feedback";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const value = {
    feedbacks,
    loading,
    error,
    fetchFeedbacks,
    getFeedbackById: async (feedbackId) => {
      try {
        setLoading(true);
        console.log(`Fetching feedback ${feedbackId} from /swp391/feedbacks/${feedbackId}`);
        const token = localStorage.getItem("token");
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
          console.log("Get feedback cancelled:", error.message);
          return { success: false, error: error.message };
        }
        console.error("Get feedback error:", error.response?.status, error.message);
        const errorMessage =
          error.response?.status === 401
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            : error.response?.data?.message || "Không thể tải feedback";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    createFeedback: async (feedbackData) => {
      try {
        setLoading(true);
        console.log("Creating feedback at /swp391/feedbacks");
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");
        if (!user || !user.id) throw new Error("User not authenticated or ID not found.");
        const payload = { content: feedbackData.content, rating: feedbackData.rating };
        const source = axios.CancelToken.source();
        const response = await feedbackService.createFeedback(payload, { cancelToken: source.token });
        console.log("API response:", response.data);
        const newFeedback = mapFeedback(response.data.result);
        setFeedbacks((prev) => [...prev, newFeedback]);
        setError(null);
        return { success: true, message: "Tạo feedback thành công", feedback: newFeedback };
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Create feedback cancelled:", error.message);
          return { success: false, error: error.message };
        }
        console.error("Create feedback error:", error.response?.status, error.message);
        const errorMessage =
          error.response?.status === 401
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            : error.response?.data?.message || "Tạo feedback thất bại";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    updateFeedback: async (feedbackId, feedbackData) => {
      try {
        setLoading(true);
        console.log(`Updating feedback ${feedbackId} at /swp391/feedbacks/${feedbackId}`);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");
        const payload = { content: feedbackData.content, rating: feedbackData.rating };
        const source = axios.CancelToken.source();
        const response = await feedbackService.updateFeedback(feedbackId, payload, { cancelToken: source.token });
        console.log("API response:", response.data);
        const updatedFeedback = mapFeedback(response.data.result);
        setFeedbacks((prev) =>
          prev.map((feedback) => (feedback.id === feedbackId ? updatedFeedback : feedback))
        );
        setError(null);
        return { success: true, message: "Cập nhật feedback thành công", feedback: updatedFeedback };
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Update feedback cancelled:", error.message);
          return { success: false, error: error.message };
        }
        console.error("Update feedback error:", error.response?.status, error.message);
        const errorMessage =
          error.response?.status === 401
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            : error.response?.data?.message || "Cập nhật feedback thất bại";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    deleteFeedback: async (feedbackId) => {
      try {
        setLoading(true);
        console.log(`Deleting feedback ${feedbackId} at /swp391/feedbacks/${feedbackId}`);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");
        const source = axios.CancelToken.source();
        await feedbackService.deleteFeedback(feedbackId, { cancelToken: source.token });
        console.log("Feedback deleted successfully");
        setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== feedbackId));
        setError(null);
        return { success: true, message: "Xóa feedback thành công" };
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Delete feedback cancelled:", error.message);
          return { success: false, error: error.message };
        }
        console.error("Delete feedback error:", error.response?.status, error.message);
        const errorMessage =
          error.response?.status === 401
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
            : error.response?.data?.message || "Xóa feedback thất bại";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
  };

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
};