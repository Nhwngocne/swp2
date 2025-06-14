import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Manage.css'; // Assuming you have a CSS file for styling

const Manage = () => {
  const [stats] = useState({
    totalUsers: 1250,
    totalEvents: 45,
    totalNews: 28,
    totalDonations: 3200,
    monthlyGrowth: 12.5,
    activeUsers: 892
  });

  const [recentActivities] = useState([
    { id: 1, action: 'Người dùng mới đăng ký', user: 'Nguyễn Văn A', time: '5 phút trước' },
    { id: 2, action: 'Sự kiện mới được tạo', user: 'Admin', time: '15 phút trước' },
    { id: 3, action: 'Tin tức được cập nhật', user: 'Staff B', time: '30 phút trước' },
    { id: 4, action: 'Hiến máu thành công', user: 'Trần Thị C', time: '1 giờ trước' },
  ]);

  const managementSections = [
    {
      title: 'Quản lý Tin tức',
      description: 'Tạo, chỉnh sửa và quản lý các bài viết tin tức',
      icon: '📰',
      link: '/manage-news',
      color: '#3498db'
    },
    {
      title: 'Quản lý Diễn đàn',
      description: 'Điều hành các thảo luận và bài viết trên diễn đàn',
      icon: '💬',
      link: '/manage-forum',
      color: '#2ecc71'
    },
    {
      title: 'Quản lý Thông báo',
      description: 'Gửi thông báo và cập nhật cho người dùng',
      icon: '🔔',
      link: '/manage-notifications',
      color: '#f39c12'
    },
    {
      title: 'Báo cáo & Thống kê',
      description: 'Xem báo cáo chi tiết và phân tích dữ liệu',
      icon: '📊',
      link: '/reports',
      color: '#9b59b6'
    },
    {
      title: 'Cài đặt Hệ thống',
      description: 'Cấu hình và tùy chỉnh hệ thống',
      icon: '⚙️',
      link: '/settings',
      color: '#34495e'
    }
  ];

  return (
    <div className="manage-container">
      <div className="manage-header">
        <h1>Bảng điều khiển Admin</h1>
        <p>Quản lý và giám sát toàn bộ hệ thống</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers.toLocaleString()}</h3>
            <p>Tổng người dùng</p>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">🎉</div>
          <div className="stat-content">
            <h3>{stats.totalEvents}</h3>
            <p>Sự kiện hiến máu</p>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">📰</div>
          <div className="stat-content">
            <h3>{stats.totalNews}</h3>
            <p>Bài viết tin tức</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>{stats.totalDonations.toLocaleString()}</h3>
            <p>Lượt hiến máu</p>
          </div>
        </div>
      </div>

      <div className="manage-content">
        {/* Management Sections */}
        <div className="management-grid">
          <h2>Quản lý hệ thống</h2>
          <div className="sections-grid">
            {managementSections.map((section, index) => (
              <Link 
                key={index} 
                to={section.link} 
                className="management-card"
                style={{ '--accent-color': section.color }}
              >
                <div className="card-icon">{section.icon}</div>
                <div className="card-content">
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </div>
                <div className="card-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities">
          <h2>Hoạt động gần đây</h2>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">🔄</div>
                <div className="activity-content">
                  <p><strong>{activity.action}</strong></p>
                  <p className="activity-user">bởi {activity.user}</p>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Thao tác nhanh</h2>
          <div className="actions-grid">
            <button className="action-btn create">
              <span>➕</span>
              Tạo tin tức mới
            </button>
            <button className="action-btn notify">
              <span>📢</span>
              Gửi thông báo
            </button>
            <button className="action-btn backup">
              <span>💾</span>
              Sao lưu dữ liệu
            </button>
            <button className="action-btn export">
              <span>📤</span>
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;