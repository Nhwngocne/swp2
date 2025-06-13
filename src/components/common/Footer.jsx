import React from 'react';
import './Footer.css'; // Import your CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Trung tâm Hiến máu</h3>
            <p>Kết nối những trái tim nhân ái, cứu sống những sinh mạng quý giá.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li><a href="/events">Sự kiện hiến máu</a></li>
              <li><a href="/news">Tin tức</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/search">Tìm kiếm</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="/help">Trợ giúp</a></li>
              <li><a href="/faq">Câu hỏi thường gặp</a></li>
              <li><a href="/contact">Liên hệ</a></li>
              <li><a href="/privacy">Chính sách bảo mật</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Liên hệ</h4>
            <div className="contact-info">
              <p><i className="fas fa-phone"></i> (84) 123-456-789</p>
              <p><i className="fas fa-envelope"></i> info@hienmauvietnam.org</p>
              <p><i className="fas fa-map-marker-alt"></i> 123 Đường ABC, Quận 1, TP.HCM</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Trung tâm Hiến máu Việt Nam. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;