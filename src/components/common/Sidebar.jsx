import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/components/common/Slidebar.css';

const Sidebar = ({ isOpen, setIsOpen, userRole }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(false);

  if (userRole === 'MEMBER') return null;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleSubmenu = () => {
    setOpenSubmenu(!openSubmenu);
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
          {
            label: "Quản lý đơn đăng ký",
            children: [
              { path: "/bloodFormList", label: " Danh Sách Hiến Máu" },
              { path: "/bloodIntentList", label: "Danh Sách Hiến/Nhận Máu" },
              { path: "/emergencyList", label: "Danh Sách Cấp Cứu" }
            ]
          },
          { path: "/manage-members", label: "Quản lý thành viên" },
          { path: "/qna", label: "Hỏi đáp" },
        ];

      case "ADMIN":
        return [
          dashboardItem,
          { path: "/manage-news", label: "Quản lý tin tức" },
          { path: "/manage-notifications", label: "Quản lý thông báo" },
          { path: "/memberManagerAd", label: "Quản lý thành viên" },
          { path: "/staff-manager", label: "Quản lý nhân viên" },
        ];

      default:
        return [dashboardItem];
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {getMenuItems().map((item) => (
              <li key={item.path || item.label} className="nav-item">
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path)}`}
                    onClick={handleLinkClick}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.label}</span>
                  </Link>
                ) : (
                  <>
                    {/* click to toggle submenu */}
                    <div
                      className="nav-link submenu-header"
                      onClick={toggleSubmenu}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="nav-text">{item.label}</span>
                      
                    </div>
                    {openSubmenu && (
                      <ul className="submenu">
                        {item.children.map((child) => (
                          <li key={child.path} className="nav-sub-item">
                            <Link
                              to={child.path}
                              className={`nav-link ${isActive(child.path)}`}
                              onClick={handleLinkClick}
                            >
                              <span className="nav-text">{child.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
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
