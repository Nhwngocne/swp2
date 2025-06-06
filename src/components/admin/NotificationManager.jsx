import React, { useState } from 'react';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), message, type }
    ]);
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 3000);
  };

  // Example usage: addNotification('Đây là thông báo!', 'success');

  return (
    <div className="notification-manager">
      {notifications.map((n) => (
        <div key={n.id} className={`notification ${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationManager;