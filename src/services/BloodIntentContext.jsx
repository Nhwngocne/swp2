import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { bloodIntentService } from "../services/bloodIntentService";
import { useAuth } from "../services/AuthContext";
import axios from "axios";

const BloodIntentContext = createContext();

export const useBloodIntent = () => {
  const context = useContext(BloodIntentContext);
  if (!context) {
    throw new Error("useBloodIntent phải được dùng trong BloodIntentProvider");
  }
  return context;
};

export const BloodIntentProvider = ({ children }) => {
  const { user } = useAuth();
  const [bloodIntents, setBloodIntents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  // Mapping cho BloodIntentFormResponse
  const mapBloodIntent = (intent) => ({
    id: intent.id,
    intentType: intent.intentType || "Không xác định",
    bloodType: intent.bloodType || "UNKNOWN",
    location: intent.location || "",
    availableFrom: intent.availableFrom,
    availableTo: intent.availableTo,
    status: intent.status || "PENDING",
    memberId: intent.memberId || 0,
    memberName: intent.memberName || "Không xác định",
    memberPhone: intent.memberPhone || "",
  });

  // Fetch all blood intents
  const fetchBloodIntents = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy tất cả ý định từ /swp391/api/intents");
      const source = axios.CancelToken.source();
      const response = await bloodIntentService.getAllBloodIntents({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedIntents = response.data.result.map(mapBloodIntent);
      setBloodIntents(mappedIntents);
      setError(null);
      return { success: true, intents: mappedIntents };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy ý định:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy ý định:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải ý định";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Fetch blood intents by member
  const getBloodIntentsByMember = async (memberId) => {
    try {
      setLoading(true);
      console.log(`Đang lấy ý định của member ${memberId} từ /swp391/api/intents/member/${memberId}`);
      const source = axios.CancelToken.source();
      const response = await bloodIntentService.getBloodIntentsByMember(memberId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedIntents = response.data.result.map(mapBloodIntent);
      setError(null);
      return { success: true, intents: mappedIntents };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy ý định:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy ý định:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải ý định";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fetch blood intent by ID
  const getBloodIntentById = async (id) => {
    try {
      setLoading(true);
      console.log(`Đang lấy ý định ${id} từ /swp391/api/intents/${id}`);
      const source = axios.CancelToken.source();
      const response = await bloodIntentService.getBloodIntentById(id, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedIntent = mapBloodIntent(response.data.result);
      setError(null);
      return { success: true, intent: mappedIntent };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy ý định:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy ý định:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải ý định";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Create blood intent
  const createBloodIntent = async (intentData) => {
    try {
      setLoading(true);
      console.log("Đang tạo ý định tại /swp391/api/intents");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = {
        intentType: intentData.intentType,
        bloodType: intentData.bloodType,
        location: intentData.location,
      };
      const source = axios.CancelToken.source();
      const response = await bloodIntentService.createBloodIntent(payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newIntent = mapBloodIntent(response.data.result);
      setBloodIntents((prev) => [...prev, newIntent]);
      setError(null);
      return {
        success: true,
        message: "Tạo ý định thành công",
        intent: newIntent,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo ý định:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo ý định:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Tạo ý định thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete blood intent
  const deleteBloodIntent = async (id) => {
    try {
      setLoading(true);
      console.log(`Đang xóa ý định ${id} tại /swp391/api/intents/${id}`);
      const source = axios.CancelToken.source();
      await bloodIntentService.deleteBloodIntent(id, {
        cancelToken: source.token,
      });
      console.log("Xóa ý định thành công");
      setBloodIntents((prev) => prev.filter((intent) => intent.id !== id));
      setError(null);
      return { success: true, message: "Xóa ý định thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa ý định:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa ý định:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa ý định thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Không tự động fetch all intents vì chỉ STAFF mới có quyền
    // Nếu muốn, thêm điều kiện role STAFF từ useAuth
  }, []);

  const value = {
    bloodIntents,
    loading,
    error,
    fetchBloodIntents,
    getBloodIntentsByMember,
    getBloodIntentById,
    createBloodIntent,
    deleteBloodIntent,
  };

  return <BloodIntentContext.Provider value={value}>{children}</BloodIntentContext.Provider>;
};