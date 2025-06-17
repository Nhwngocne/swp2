import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen, userRole }) => {
  const location = useLocation();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const getMenuItems = () => {
    const commonItems = [
      //{ path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/profile', label: 'Hồ sơ cá nhân', icon: '👤' },
    ];

      const dashboardItem = userRole === 'ADMIN'
    ? [{ path: '/dashboard', label: 'Dashboard', icon: '📊' }]
    : [];

    switch (userRole) {
      case 'MEMBER':
        return [
          ...commonItems,
          { path: '/donation-history', label: 'Lịch sử hiến máu', icon: '🩸' },
          //{ path: '/emergency', label: 'Yêu cầu cấp cứu', icon: '🚨' },
          { path: '/events', label: 'Sự kiện hiến máu', icon: '📅' },
        ];

      case 'STAFF':
        return [
          ...commonItems,
          { path: '/manage-events', label: 'Quản lý sự kiện', icon: '📅' },
          { path: '/blood-inventory', label: 'Kho máu', icon: '🏥' },
          { path: '/emergency', label: 'Yêu cầu cấp cứu', icon: '🚨' },
          { path: '/manage-members', label: 'Quản lý thành viên', icon: '👥' },
        ];

      case 'ADMIN':
        return [
          ...commonItems,
          { path: '/manage', label: 'Quản lý hệ thống', icon: '⚙️' },
          { path: '/manage-news', label: 'Quản lý tin tức', icon: '📰' },
          { path: '/manage-forum', label: 'Quản lý diễn đàn', icon: '💬' },
          { path: '/manage-notifications', label: 'Quản lý thông báo', icon: '🔔' },
          { path: '/reports', label: 'Báo cáo thống kê', icon: '📈' },
          { path: '/settings', label: 'Cài đặt hệ thống', icon: '🛠️' },
        ];

      default:
        return commonItems;
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button 
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {getMenuItems().map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path}
                  className={`nav-link ${isActive(item.path)}`}
                  onClick={handleLinkClick}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-role-info">
            <p className="role-label">Vai trò:</p>
            <p className="role-value">{getRoleText(userRole)}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

// Helper function to get role text in Vietnamese
const getRoleText = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'Quản trị viên';
    case 'STAFF':
      return 'Nhân viên';
    case 'MEMBER':
      return 'Thành viên';
    default:
      return 'Người dùng';
  }
};

export default Sidebar;