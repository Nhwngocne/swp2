import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { notificationService } from "../services/notificationsService";
import { useAuth } from "../services/AuthContext";
import axios from "axios";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications phải được dùng trong NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isMember, isStaff } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  const mapNotification = (notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message || "Không có nội dung",
    createdAt: notification.createdAt,
    member: notification.member || null,
    staff: notification.staff || null,
    read: notification.read || false,
  });

  const fetchMyNotifications = useCallback(async () => {
    if (!isMember && !isStaff) {
      console.log("Role không phù hợp để lấy notifications");
      return { success: false, error: "Role không hợp lệ" };
    }
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;

    try {
      setLoading(true);
      const source = axios.CancelToken.source();
      const response = await notificationService.getMyNotifications({
        cancelToken: source.token,
      });

      let filtered = response.data.result;
      if (isMember) {
        filtered = filtered.filter((n) => n.title === "forMember");
      } else if (isStaff) {
        filtered = filtered.filter((n) => n.title === "forStaff");
      }

      const mapped = filtered.map(mapNotification);
      setNotifications(mapped);
      setError(null);
      return { success: true, notifications: mapped };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy notifications:", error.message);
        return { success: false, error: error.message };
      }
      const errorMessage = error.response?.data?.message || "Không thể tải notifications";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [isMember, isStaff]);

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const source = axios.CancelToken.source();
      await notificationService.markAllAsRead({ cancelToken: source.token });
      await fetchMyNotifications();
      setError(null);
      return { success: true };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy markAllAsRead:", error.message);
        return { success: false, error: error.message };
      }
      const errorMessage = error.response?.data?.message || "Không thể mark đã đọc";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setLoading(true);
      const source = axios.CancelToken.source();
      await notificationService.markAsRead(notificationId, {
        cancelToken: source.token,
      });
      await fetchMyNotifications();
      setError(null);
      return { success: true, message: "Đã đánh dấu là đã đọc" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy markAsRead:", error.message);
        return { success: false, error: error.message };
      }
      const errorMessage = error.response?.data?.message || "Không thể mark đã đọc";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getNotificationsByMemberId = async (memberId) => {
    try {
      setLoading(true);
      const source = axios.CancelToken.source();
      const response = await notificationService.getNotificationsByMemberId(memberId, {
        cancelToken: source.token,
      });
      const mapped = response.data.result.map(mapNotification);
      setNotifications(mapped);
      setError(null);
      return { success: true, notifications: mapped };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy notifications:", error.message);
        return { success: false, error: error.message };
      }
      const errorMessage = error.response?.data?.message || "Không thể tải notifications";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createNotificationForMember = async (data) => {
    try {
      setLoading(true);
      const source = axios.CancelToken.source();
      await notificationService.createNotificationForMember(data, {
        cancelToken: source.token,
      });
      if (isMember || isStaff) await fetchMyNotifications();
      setError(null);
      return { success: true, message: "Tạo notification thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo notification:", error.message);
        return { success: false, error: error.message };
      }
      const errorMessage = error.response?.data?.message || "Tạo notification thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createNotificationToStaff = async (data) => {
    try {
      setLoading(true);
      const source = axios.CancelToken.source();
      await notificationService.createNotificationToStaff(data, {
        cancelToken: source.token,
      });
      setError(null);
      return { success: true, message: "Đã gửi thông báo đến staff" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy gửi notification:", error.message);
        return { success: false, error: error.message };
      }
      const errorMessage = error.response?.data?.message || "Gửi notification thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createNotificationToStaffOnly = async (data) => {
    try {
      setLoading(true);
      const source = axios.CancelToken.source();
      await notificationService.createNotificationToStaffOnly(data, {
        cancelToken: source.token,
      });
      setError(null);
      return { success: true, message: "Đã gửi thông báo đến staff" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy gửi notification:", error.message);
        return { success: false, error: error.message };
      }
      const errorMessage = error.response?.data?.message || "Gửi notification thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setLoading(true);
      const source = axios.CancelToken.source();
      await notificationService.deleteNotification(notificationId, {
        cancelToken: source.token,
      });
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setError(null);
      return { success: true, message: "Xóa notification thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa notification:", error.message);
        return { success: false, error: error.message };
      }
      const errorMessage = error.response?.data?.message || "Xóa notification thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMember || isStaff) {
      fetchMyNotifications();
    }
  }, [isMember, isStaff, fetchMyNotifications]);

  const value = {
    notifications,
    loading,
    error,
    fetchMyNotifications,
    getNotificationsByMemberId,
    createNotificationForMember,
    createNotificationToStaff,
    createNotificationToStaffOnly,
    deleteNotification,
    markAllAsRead,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
