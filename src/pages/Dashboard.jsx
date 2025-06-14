import React, { useState, useEffect } from 'react';
import { useAuth } from "../services/AuthContext";
import { Link } from 'react-router-dom';


const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalVolume: 0,
    upcomingEvents: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalDonations: user.role === 'member' ? 5 : 150,
          totalVolume: user.role === 'member' ? 2000 : 75000,
          upcomingEvents: 3,
          recentActivity: [
            {
              id: 1,
              type: 'donation',
              title: 'Hiến máu tại Bệnh viện Chợ Rẫy',
              date: '2024-01-15',
              status: 'completed'
            },
            {
              id: 2,
              type: 'event',
              title: 'Chương trình hiến máu tình nguyện',
              date: '2024-01-20',
              status: 'upcoming'
            },
            {
              id: 3,
              type: 'emergency',
              title: 'Cần máu khẩn cấp - Nhóm O-',
              date: '2024-01-18',
              status: 'urgent'
            }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const getQuickActions = () => {
    const commonActions = [
      { icon: 'fas fa-calendar', title: 'Sự kiện hiến máu', link: '/events' },
      { icon: 'fas fa-newspaper', title: 'Tin tức', link: '/news' },
      { icon: 'fas fa-search', title: 'Tìm kiếm', link: '/search' }
    ];

    switch (user.role) {
      case 'member':
        return [
          { icon: 'fas fa-user', title: 'Hồ sơ cá nhân', link: '/profile' },
          { icon: 'fas fa-history', title: 'Lịch sử hiến máu', link: '/donation-history' },
          { icon: 'fas fa-exclamation-triangle', title: 'Cấp cứu', link: '/emergency' },
          ...commonActions
        ];
      case 'staff':
        return [
          { icon: 'fas fa-calendar-alt', title: 'Quản lý sự kiện', link: '/manage-events' },
          { icon: 'fas fa-flask', title: 'Tồn kho máu', link: '/blood-inventory' },
          { icon: 'fas fa-users', title: 'Quản lý thành viên', link: '/manage-members' },
          ...commonActions
        ];
      case 'admin':
        return [
          { icon: 'fas fa-cog', title: 'Quản lý hệ thống', link: '/manage' },
          { icon: 'fas fa-chart-bar', title: 'Báo cáo thống kê', link: '/reports' },
          { icon: 'fas fa-bell', title: 'Thông báo', link: '/manage-notifications' },
          ...commonActions
        ];
      default:
        return commonActions;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'upcoming':
        return 'info';
      case 'urgent':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'donation':
        return 'fas fa-heart';
      case 'event':
        return 'fas fa-calendar';
      case 'emergency':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-info-circle';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{getWelcomeMessage()}, {user.fullName}!</h1>
        <p className="dashboard-subtitle">
          {user.role === 'member' && 'Cảm ơn bạn đã tham gia hoạt động hiến máu nhân đạo.'}
          {user.role === 'staff' && 'Chào mừng bạn đến với trang quản lý nhân viên.'}
          {user.role === 'admin' && 'Chào mừng bạn đến với trang quản trị hệ thống.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-heart"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalDonations}</h3>
            <p>{user.role === 'member' ? 'Lần hiến máu' : 'Tổng lượt hiến'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-flask"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalVolume.toLocaleString()}</h3>
            <p>ml máu đã hiến</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.upcomingEvents}</h3>
            <p>Sự kiện sắp tới</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{user.bloodType}</h3>
            <p>Nhóm máu của bạn</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Thao tác nhanh</h2>
        <div className="quick-actions">
          {getQuickActions().map((action, index) => (
            <Link key={index} to={action.link} className="quick-action-card">
              <div className="action-icon">
                <i className={action.icon}></i>
              </div>
              <h3>{action.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h2>Hoạt động gần đây</h2>
        <div className="activity-list">
          {stats.recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                <i className={getActivityIcon(activity.type)}></i>
              </div>
              <div className="activity-content">
                <h4>{activity.title}</h4>
                <p className="activity-date">{new Date(activity.date).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className={`activity-status status-${getStatusColor(activity.status)}`}>
                {activity.status === 'completed' && 'Hoàn thành'}
                {activity.status === 'upcoming' && 'Sắp diễn ra'}
                {activity.status === 'urgent' && 'Khẩn cấp'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blood Type Compatibility */}
      {user.role === 'member' && (
        <div className="dashboard-section">
          <h2>Thông tin nhóm máu</h2>
          <div className="blood-compatibility">
            <div className="blood-info">
              <h3>Nhóm máu của bạn: {user.bloodType}</h3>
              <div className="compatibility-grid">
                <div className="compatibility-item">
                  <h4>Có thể hiến cho:</h4>
                  <div className="blood-types">
                    {user.bloodType === 'O-' && <span>Tất cả nhóm máu</span>}
                    {user.bloodType === 'O+' && <span>A+, B+, AB+, O+</span>}
                    {user.bloodType === 'A-' && <span>A+, A-, AB+, AB-</span>}
                    {user.bloodType === 'A+' && <span>A+, AB+</span>}
                    {user.bloodType === 'B-' && <span>B+, B-, AB+, AB-</span>}
                    {user.bloodType === 'B+' && <span>B+, AB+</span>}
                    {user.bloodType === 'AB-' && <span>AB+, AB-</span>}
                    {user.bloodType === 'AB+' && <span>AB+</span>}
                  </div>
                </div>
                <div className="compatibility-item">
                  <h4>Có thể nhận từ:</h4>
                  <div className="blood-types">
                    {user.bloodType === 'AB+' && <span>Tất cả nhóm máu</span>}
                    {user.bloodType === 'AB-' && <span>A-, B-, AB-, O-</span>}
                    {user.bloodType === 'A+' && <span>A+, A-, O+, O-</span>}
                    {user.bloodType === 'A-' && <span>A-, O-</span>}
                    {user.bloodType === 'B+' && <span>B+, B-, O+, O-</span>}
                    {user.bloodType === 'B-' && <span>B-, O-</span>}
                    {user.bloodType === 'O+' && <span>O+, O-</span>}
                    {user.bloodType === 'O-' && <span>O-</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;