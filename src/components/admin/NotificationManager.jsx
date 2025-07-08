import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const NotificationManager = () => {
  const { sendNotificationToAll, getAllNotifications, deleteNotification } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [localNotices, setLocalNotices] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const result = await getAllNotifications();
    if (result.success) {
      setNotifications(result.notifications);
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Gửi Thông Báo Toàn Hệ Thống
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <textarea
          placeholder="Nhập nội dung thông báo..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="info">Thông tin</option>
          <option value="success">Thành công</option>
          <option value="warning">Cảnh báo</option>
          <option value="error">Lỗi</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full transition duration-200"
        >
          Gửi Thông Báo
        </button>
      </form>

      <h3 className="text-2xl font-semibold mb-5">Danh Sách Thông Báo</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500">Chưa có thông báo nào trong hệ thống.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((n) => {
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
              <div
                key={n.id}
                className={`flex items-start justify-between p-4 rounded-lg border-l-8 ${typeStyle} shadow`}
              >
                <div className="flex gap-3">
                  <div className="text-2xl">{typeIcon}</div>
                  <div>
                    <p className="font-semibold text-lg">{n.title}</p>
                    <p>{n.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNotification(n.title, n.message)}
                  className="ml-4 text-red-600 hover:text-red-800 transition duration-200 text-xl"
                  title="Xóa thông báo"
                >
                  ✖
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 space-y-3 z-50">
        {localNotices.map((n) => {
          let bgColor = "";
          let textColor = "";

          if (n.type === "success") {
            bgColor = "#16a34a"; // Tailwind green-600
            textColor = "#fff";
          } else if (n.type === "error") {
            bgColor = "#dc2626"; // Tailwind red-600
            textColor = "#fff";
          } else if (n.type === "warning") {
            bgColor = "#facc15"; // Tailwind yellow-400/500
            textColor = "#000";
          } else {
            bgColor = "#2563eb"; // Tailwind blue-600
            textColor = "#fff";
          }

          return (
            <div
              key={n.id}
              className="px-5 py-3 rounded-lg shadow-lg transition-transform duration-500"
              style={{
                backgroundColor: bgColor,
                color: textColor
              }}
            >
              {n.message}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationManager;
