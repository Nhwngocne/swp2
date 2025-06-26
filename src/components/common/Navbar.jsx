import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext.jsx";

import RegisterHistory from "../member/RegisterHistory.jsx"; // Import RegisterHistory if needed
import Certificate from "../member/Certificate.jsx";
import '../../assets/css/components/common/navbar.css';
import logo from '../../assets/img/logo.png';
import Register from '../../pages/Register.jsx';
import LookUp from '../../pages/LookUp.jsx';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user; // ✅ Thêm dòng này

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout(); // Đợi logout xong
    navigate("/"); // Điều hướng về trang home
  };

  const getInitials = (fullName) => {
    return fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Dummy notifications
  const notifications = [
    {
      id: 1,
      title: "Hãy đánh dấu lịch của bạn cho sự kiện hiến máu...",
      content: "Còn rất nhiều cơ hội đặt lịch hiến máu cho ngày 31/07",
      type: "Sự kiện",
      date: "2025-06-16T08:00:00",
      read: false,
    },
    {
      id: 2,
      title: "GÓC CẢNH BÁO",
      content: "CẢNH BÁO LỪA ĐẢO",
      type: "Tin tức",
      date: "2025-06-15T10:00:00",
      read: false,
    },
    {
      id: 3,
      title: "GÓC CẢNH BÁO",
      content: "CẢNH BÁO LỪA ĐẢO",
      type: "Tin tức",
      date: "2025-06-13T09:00:00",
      read: true,
    },
  ];

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diff === 0 ? "Hôm nay" : `${diff} ngày trước`;
  };

  // Auto-close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
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
              <Link to="/register" className="top-link">
                Đăng kí
              </Link>
              <Link to="/login" className="top-link login-btn">
                Đăng nhập
              </Link>
            </>
          ) : (
            <div className="user-dropdown" ref={userDropdownRef}>
              <div
                className="user-toggle"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setNotifOpen(false); // 🔒 Tắt dropdown thông báo
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

              <div className="notification-wrapper" ref={notifDropdownRef}>
                <div
                  className="notification-bell"
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setDropdownOpen(false); // 🔒 Tắt dropdown user
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
                      {notifications.map((n) => (
                        <div key={n.id} className="notification-item">
                          <div className="noti-title">{n.title}</div>
                          <div className="noti-content">{n.content}</div>
                          <div className="noti-time">{timeAgo(n.date)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {dropdownOpen && (

                <div className="user-dropdown-menu">{role !== 'ADMIN' && role !== 'STAFF' && (
                  <>
                    <Link to="/profile" className="dropdown-btn">
                      <i
                        className="fa-solid fa-user"
                        style={{ marginRight: 8 }}
                      ></i>
                      Thông tin cá nhân
                    </Link>
                    <Link to="/registerHistory" className="dropdown-btn">
                      <i
                        className="fa-solid fa-user"
                        style={{ marginRight: 8 }}
                      ></i>
                      Lịch sử đăng ký
                    </Link>
                    <Link to="/certificate" className="dropdown-btn">
                      <i
                        className="fa-solid fa-user"
                        style={{ marginRight: 8 }}
                      ></i>
                      chứng chỉ
                    </Link>
                  </>
                )}
                  <button className="dropdown-btn" onClick={handleLogout}>
                    <i
                      className="fa-solid fa-right-from-bracket"
                      style={{ marginRight: 8 }}
                    ></i>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* thanh headr */}
      <nav className="navbar-bottom">
        {role !== 'ADMIN' && role !== 'STAFF' && (
          <>
            <Link to="/" className="nav-item active">Trang chủ</Link>
            <Link to="/faq" className="nav-item">Hỏi - Đáp</Link>
            <Link to="/news" className="nav-item">Tin tức</Link>
            <Link to="/lookUp" className="nav-item">Tra cứu</Link>
            <Link to="/contact" className="nav-item">Liên hệ</Link>
          </>
        )}

        {role === 'MEMBER' && (
          <Link to="/donationHistory" className="nav-item">
            Lịch sử hiến máu
          </Link>
        )}
      </nav>


    </header>

  );
};

export default Navbar;
