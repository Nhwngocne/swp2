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
const systemTitles = ["Thông tin", "Thành công", "Cảnh báo", "Lỗi"];

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

  const filterNotificationsByRole = (notifications) => {
    if (isMember) {
      return notifications.filter(
        (n) => n.title === "forMember" || systemTitles.includes(n.title)
      );
    }
    if (isStaff) {
  return notifications.filter(
    (n) =>
      n.title === "forStaff" ||
      n.title === "Cảnh báo kho máu thấp" ||
      systemTitles.includes(n.title)
  );
}

    return [];
  };

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

      const filtered = filterNotificationsByRole(response.data.result);
      const mapped = filtered.map(mapNotification);

      // Giữ thông báo chưa đọc, hoặc đã đọc nhưng <= 7 ngày
      const now = new Date();
      const cleaned = mapped.filter(n => {
        if (!n.read) return true;
        const createdDate = new Date(n.createdAt);
        const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      });

      setNotifications(cleaned);
      setError(null);
      return { success: true, notifications: cleaned };
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

  // Giữ nguyên các function khác
  const getNotificationsByMemberId = async (memberId) => { /*...*/ };
  const createNotificationForMember = async (data) => { /*...*/ };
  const createNotificationToStaff = async (data) => { /*...*/ };
  const createNotificationToStaffOnly = async (data) => { /*...*/ };
  const deleteNotification = async (notificationId) => { /*...*/ };

  useEffect(() => {
    if (isMember || isStaff) {
      fetchMyNotifications();
    }
  }, [isMember, isStaff, fetchMyNotifications]);

  return (
    <NotificationContext.Provider value={{
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
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
