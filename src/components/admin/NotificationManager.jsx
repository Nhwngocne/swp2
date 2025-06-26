import React, { useState } from 'react';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const newNotification = { id, message, type };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      addNotification(message, type);
      setMessage('');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Quản Lý Thông Báo</h2>

      {/* Form tạo thông báo */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Nhập nội dung thông báo..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="info">Thông tin</option>
          <option value="success">Thành công</option>
          <option value="warning">Cảnh báo</option>
          <option value="error">Lỗi</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Gửi Thông Báo
        </button>
      </form>

      {/* Danh sách thông báo đã gửi */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-gray-500">Chưa có thông báo nào.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-md flex justify-between items-center text-white ${
                n.type === 'success'
                  ? 'bg-green-500'
                  : n.type === 'error'
                  ? 'bg-red-500'
                  : n.type === 'warning'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-blue-500'
              }`}
            >
              <span>{n.message}</span>
              <button
                onClick={() => handleDelete(n.id)}
                className={`ml-4 text-sm font-bold rounded px-2 py-1 ${
                  n.type === 'warning' ? 'bg-black text-white' : 'bg-white text-black'
                } hover:opacity-80`}
              >
                Xóa
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationManager;
