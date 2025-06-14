import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../services/AuthContext";
import './Navbar.css';
import logo from '../../assets/logo.png';
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-wrapper">
      {/* ===== PHẦN TRÊN: logo giữa + auth ===== */}
    <div className="navbar-top">
  <div className="navbar-placeholder" /> {/* chiếm bên trái */}
  
  <div className="navbar-logo">
    <Link to="/">
                 <img src={logo} alt="Logo BloodLink" className="footer-logo" />
    </Link>
  </div>

  <div className="navbar-auth">
    {!user ? (
      <>
        <Link to="/register" className="top-link">Đăng kí</Link>
        <Link to="/login" className="top-link login-btn">Đăng nhập</Link>
      </>
    ) : (
      <button className="top-link logout-btn" onClick={handleLogout}>Đăng xuất</button>
    )}
  </div>
</div>

      {/* ===== PHẦN MENU DƯỚI: nền đỏ ===== */}
      <nav className="navbar-bottom">
        <Link to="/" className="nav-item active">Trang chủ</Link>
        <Link to="/faq" className="nav-item">Hỏi -Đáp</Link>
        <Link to="/news" className="nav-item">Tin tức</Link>
        <Link to="/lookup" className="nav-item">Tra cứu</Link>
        <Link to="/contact" className="nav-item">Liên hệ</Link>
      </nav>
    </header>
  );
};

export default Navbar;
