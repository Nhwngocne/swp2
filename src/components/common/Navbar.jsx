import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext.jsx";
import { useNotifications } from "../../services/NotificationsContext.jsx";

import '../../assets/css/components/common/navbar.css';
import logo from '../../assets/img/logo.png';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const { notifications, loading, error, markAllAsRead, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getInitials = (fullName) => {
    return fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diff === 0 ? "Hôm nay" : `${diff} ngày trước`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-top">
        <div className="navbar-placeholder" />

        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Logo BloodLink" className="footer-logo" />
          </Link>
        </div>

        <div className="navbar-auth">
          {!isLoggedIn ? (
            <>
              <Link to="/register" className="top-link">Đăng kí</Link>
              <Link to="/login" className="top-link login-btn">Đăng nhập</Link>
            </>
          ) : (
            <div className="user-dropdown" ref={userDropdownRef}>
              <div
                className="user-toggle"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setNotifOpen(false);
                }}
              >
                <div className="user-avatar">
                  {getInitials(user.fullName || user.name)}
                </div>
                <span className="user-name">{user.fullName || user.name}</span>
                <span className="dropdown-icon">
                  <i className="fa-solid fa-chevron-down"></i>
                </span>
              </div>

              {role !== 'ADMIN' && (
                <div className="notification-wrapper" ref={notifDropdownRef}>
                  <div
                    className="notification-bell"
                    onClick={() => {
                      const next = !notifOpen;
                      setNotifOpen(next);
                      setDropdownOpen(false);
                    }}
                  >
                    <i className="fa-solid fa-bell notification-icon"></i>
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="notification-badge">
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </div>

                  {notifOpen && (
                    <div className="notification-dropdown">
                      <strong>Thông báo</strong>
                      <div className="notification-list">
                        {loading && <div className="notification-item">Đang tải...</div>}
                        {error && <div className="notification-item">Lỗi: {error}</div>}
                        {!loading && notifications.length === 0 && (
                          <div className="notification-item">Không có thông báo</div>
                        )}
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`notification-item ${!n.read ? 'unread' : ''}`}
                          >
                            <div>
                              <div className="noti-title">{n.message}</div>
                              <div className="noti-time">{timeAgo(n.createdAt)}</div>
                            </div>
                            {!n.read && (
                              <div
                                className="mark-read-btn"
                                onClick={async () => {
                                  await markAsRead(n.id);
                                }}
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "8px",
                                  color: "#28a745",
                                  fontWeight: "bold",
                                  fontSize: "16px"
                                }}
                                title="Đánh dấu đã đọc"
                              >
                                ✓
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {notifications.length > 0 && (
                        <div
                          onClick={async () => await markAllAsRead()}
                          style={{
                            cursor: "pointer",
                            textAlign: "center",
                            marginTop: "10px",
                            fontSize: "14px",
                            color: "#007bff"
                          }}
                          title="Đánh dấu tất cả đã đọc"
                        >
                          ✓ Đọc tất cả
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  {role === 'MEMBER' && (
                    <>
                      <Link to="/profile" className="dropdown-btn">
                        <i className="fa-solid fa-user" style={{ marginRight: 8 }}></i>
                        Thông tin cá nhân
                      </Link>
                      <Link to="/registerHistory" className="dropdown-btn">
                        <i className="fa-solid fa-list" style={{ marginRight: 8 }}></i>
                        Lịch sử đăng ký
                      </Link>
                      <Link to="/certificate" className="dropdown-btn">
                        <i className="fa-solid fa-certificate" style={{ marginRight: 8 }}></i>
                        Chứng chỉ
                      </Link>
                    </>
                  )}
                  <button className="dropdown-btn" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket" style={{ marginRight: 8 }}></i>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="navbar-bottom">
        {role !== 'ADMIN' && role !== 'STAFF' && (
          <>
            <Link to="/" className="nav-item">Trang chủ</Link>
            {role === 'MEMBER' && (
          <Link to="/donationHistory" className="nav-item">
            Lịch sử hiến máu
          </Link>
        )}
            <Link to="/faq" className="nav-item">Hỏi - Đáp</Link>
            <Link to="/news" className="nav-item">Tin tức</Link>
            <Link to="/lookUp" className="nav-item">Tra cứu</Link>
            <Link to="/donor-search" className="nav-item">Liên hệ</Link>
          </>
        )}
     
      </nav>
    </header>
  );
};

export default Navbar;
