import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/components/common/Slidebar.css';

const Sidebar = ({ isOpen, setIsOpen, userRole }) => {
  const location = useLocation();

  // 🚫 Không hiển thị sidebar nếu role là MEMBER
  if (userRole === 'MEMBER') return null;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const getMenuItems = () => {
  let dashboardPath = "/";
  if (userRole === "ADMIN") dashboardPath = "/admin-dashboard";
  if (userRole === "STAFF") dashboardPath = "/staffDashboard";

  const dashboardItem = { label: "Dashboard", path: dashboardPath, icon: "🏠" };

  switch (userRole) {
    case "STAFF":
      return [
        dashboardItem,
        { path: "/eventManager", label: "Quản lý sự kiện" },
        { path: "/bloodInventory", label: "Kho máu" },
        { path: "/formManager", label: "Quản lý đơn đăng ký" },
        { path: "/manage-members", label: "Quản lý thành viên" },
      ];

    case "ADMIN":
      return [
        dashboardItem,
        { path: "/manage-news", label: "Quản lý tin tức" },
        { path: "/manage-notifications", label: "Quản lý thông báo" },
        { path: "/memberManagerAd", label: "Quản lý thành viên" },
        { path: "/staffmander", label: "Quản lý nhân viên" },
      ];

    default:
      return [dashboardItem];
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
