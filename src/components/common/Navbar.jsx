import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css'; // Import your CSS styles
import logo from '../../assets/logo.png';


const Navbar = ({ setSidebarOpen }) => {
  const { user,role, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand */}
        <div className="navbar-brand">
          {user && (
            <button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <span className="hamburger"></span>
              <span className="hamburger"></span>
              <span className="hamburger"></span>
            </button>
          )}
          <Link to="/" className="brand-link">
            <img src={logo} alt="Logo" className="brand-logo" />
            <span className="brand-text">Hiến Máu Nhân Đạo</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-nav">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/events" className="nav-link">Sự kiện</Link>
          <Link to="/news" className="nav-link">Tin tức</Link>
          <Link to="/blog" className="nav-link">Blog</Link>

          {!user ? (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary">Đăng ký</Link>
            </div>
          ) : (
            <div className="user-menu">
              <div className="user-info">
                <span className="welcome-text">Xin chào, {user.name}</span>
                <div className="user-role">{getRoleText(role)}</div>
              </div>

              <div className="dropdown">
                <button
                  className="dropdown-toggle"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User menu"
                >
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Hồ sơ cá nhân
                    </Link>

                    {user.role === 'member' && (
                      <>
                        <Link to="/donation-history" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          Lịch sử hiến máu
                        </Link>
                        <Link to="/emergency" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          Cấp cứu
                        </Link>
                      </>
                    )}

                    {user.role === 'staff' && (
                      <>
                        <Link to="/manage-events" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          Quản lý sự kiện
                        </Link>
                        <Link to="/blood-inventory" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          Kho máu
                        </Link>
                      </>
                    )}

                    {user.role === 'admin' && (
                      <>
                        <Link to="/manage" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          Quản lý hệ thống
                        </Link>
                        <Link to="/reports" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          Báo cáo thống kê
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
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
      return '';
  }
};

export default Navbar;