import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";
import "../../assets/css/components/admin/NotificationManager.css";
import Pagination from "../../pages/Pagination";

const NotificationManager = () => {
  const { sendNotificationToAll, getAllNotifications, deleteNotification } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [localNotices, setLocalNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const result = await getAllNotifications();
    if (result.success) {
      setNotifications(result.notifications);
      if (currentPage > Math.ceil(result.notifications.length / itemsPerPage)) {
        setCurrentPage(1);
      }
    } else {
      addLocalNotification(result.error, "error");
    }
  };

  const addLocalNotification = (message, type = "info") => {
    const id = Date.now();
    const newNotification = { id, message, type };
    setLocalNotices((prev) => [...prev, newNotification]);
    setTimeout(() => {
      setLocalNotices((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      addLocalNotification("Nội dung thông báo không được để trống", "warning");
      return;
    }

    const typeToTitle = {
      info: "Thông tin",
      success: "Thành công",
      warning: "Cảnh báo",
      error: "Lỗi",
    };
    const title = typeToTitle[type] || "Thông báo";

    const result = await sendNotificationToAll(title, message);
    if (result.success) {
      addLocalNotification(result.message, "success");
      fetchNotifications();
    } else {
      addLocalNotification(result.error, "error");
    }
    setMessage("");
  };

  const handleDeleteNotification = async (title, message) => {
    const result = await deleteNotification(title, message);
    if (result.success) {
      addLocalNotification("Đã xóa thông báo thành công", "success");
      await fetchNotifications();
    } else {
      addLocalNotification(result.error, "error");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <div className="notification-manager">
      <div className="notification-grid">
        {/* Gửi thông báo */}
        <div className="notification-form-section">
          <h2>Gửi Thông Báo</h2>
          <form onSubmit={handleSubmit} className="notification-form">
            <textarea
              placeholder="Nhập nội dung thông báo..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-input"
              rows={4}
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-input"
            >
              <option value="info">Thông tin</option>
              <option value="success">Thành công</option>
              <option value="warning">Cảnh báo</option>
              <option value="error">Lỗi</option>
            </select>
            <button type="submit" className="submit-btn">
              Gửi Thông Báo
            </button>
          </form>
        </div>

        {/* Danh sách thông báo */}
        <div className="notification-list-section">
          <h2>Danh Sách Thông Báo</h2>
          {notifications.length === 0 ? (
            <p className="no-notifications">Chưa có thông báo nào trong hệ thống.</p>
          ) : (
            <div className="notification-list">
              {currentNotifications.map((n) => {
                const typeStyle = {
                  info: "border-blue-500 bg-blue-50 text-blue-800",
                  success: "border-green-500 bg-green-50 text-green-800",
                  warning: "border-yellow-500 bg-yellow-50 text-yellow-800",
                  error: "border-red-500 bg-red-50 text-red-800",
                }[n.type?.toLowerCase()] || "border-gray-400 bg-gray-50 text-gray-800";

                const typeIcon = {
                  info: "ℹ️",
                  success: "✅",
                  warning: "⚠️",
                  error: "❌",
                }[n.type?.toLowerCase()] || "🔔";

                return (
                  <div key={n.id} className={`notification-item ${typeStyle}`}>
                    <div className="notification-content">
                      <span className="icon">{typeIcon}</span>
                      <div>
                        <p className="title">{n.title}</p>
                        <p className="message">{n.message}</p>
                        <p className="date">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(n.title, n.message)}
                      className="delete-btn"
                      title="Xóa thông báo"
                    >
                      ✖
                    </button>
                  </div>
                );
              })}
              {notifications.length >= itemsPerPage && (
                <div className="pagination-container">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <div className="local-notifications">
        {localNotices.map((n) => (
          <div
            key={n.id}
            className="local-notification"
            style={{
              backgroundColor:
                n.type === "success"
                  ? "#2ecc71"
                  : n.type === "error"
                  ? "#e74c3c"
                  : n.type === "warning"
                  ? "#f1c40f"
                  : "#3498db",
              color: n.type === "warning" ? "#000" : "#fff",
            }}
          >
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationManager;
