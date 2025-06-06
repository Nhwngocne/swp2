// src/components/common/Notification.jsx
import React, { useState, useEffect } from 'react';


const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (event) => {
      const newNotification = {
        id: Date.now(),
        message: event.detail.message,
        type: event.detail.type || 'info',
        duration: event.detail.duration || 5000,
      };

      setNotifications(prev => [...prev, newNotification]);

      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.duration);
    };

    window.addEventListener('show-notification', handleNotification);
    return () => window.removeEventListener('show-notification', handleNotification);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      default: return 'fas fa-info-circle';
    }
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <i className={getNotificationIcon(notification.type)}></i>
            <span className="notification-message">{notification.message}</span>
          </div>
          <button className="notification-close" onClick={() => removeNotification(notification.id)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

// ✅ Named export cho Register.jsx sử dụng
export const showNotification = (message, type = 'info', duration = 5000) => {
  const event = new CustomEvent('show-notification', {
    detail: { message, type, duration }
  });
  window.dispatchEvent(event);
};

export default Notification;
