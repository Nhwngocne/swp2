

import '../../assets/css/components/common/Footer.css';
import logo from '../../assets/img/logo.png'; // đường dẫn logo đúng của bạn

export default function Footer() {

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Phần trên: logo + thông tin + liên kết */}
        <div className="footer-top">
          {/* Bên trái */}
         <div className="footer-left">
          <div className="footer-logo-info">
            <img src={logo} alt="Logo BloodLink" className="footer-logo" />
            <div className="contact-info">
              <h4>Thông tin liên hệ</h4>
              <ul>
                <li>• 3541 Đường Fort Meade, Laurel, MD 20724</li>
                <li>• Số điện thoại: (301) 490-5050</li>
                <li>• Mở cửa 24/7 tất cả các ngày</li>
              </ul>
            </div>
          </div>
        </div>

          {/* Bên phải */}
          <div className="footer-right">
            <h4>Liên kết hữu ích</h4>
            <ul className="footer-links-list">
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
            </ul>
          </div>
        </div>

        {/* Đường kẻ */}
        <hr className="footer-divider" />

    
       
      </div>
    </footer>
  );
}
