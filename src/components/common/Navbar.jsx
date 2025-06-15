import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/components/common/navbar.css';
import logo from '../../assets/img/logo.png';

const Navbar = () => {
  const navigate = useNavigate();

  // Kiểm tra người dùng có đang đăng nhập không
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    // Xóa localStorage khi logout
    localStorage.removeItem('token');
    localStorage.removeItem('rolename');
    localStorage.removeItem('name');

    navigate('/');
    window.location.reload(); // reload để cập nhật giao diện
  };

  return (
    <header className="navbar-wrapper">
      {/* PHẦN TRÊN */}
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
            <>
              <Link to="/profile" className="top-link">Hồ sơ</Link>
              <button className="top-link logout-btn" onClick={handleLogout}>Đăng xuất</button>
            </>
          )}
        </div>
      </div>

      {/* MENU DƯỚI */}
      <nav className="navbar-bottom">
        <Link to="/" className="nav-item active">Trang chủ</Link>
        <Link to="/faq" className="nav-item">Hỏi - Đáp</Link>
        <Link to="/news" className="nav-item">Tin tức</Link>
        <Link to="/search" className="nav-item">Tra cứu</Link>
        <Link to="/contact" className="nav-item">Liên hệ</Link>
      </nav>
    </header>
  );
};

export default Navbar;
