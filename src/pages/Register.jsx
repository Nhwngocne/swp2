// Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { showNotification } from '../components/common/Notification';

import '../assets/css/pages/Register.css'; //
import VerifyGmail from './VerifyGmail';


const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', numberCccd: '',
    gender: '', job: '', dob: '', address: '',
    password: '', confirmPassword: '', agreeTerms: false
  });

  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
// <<<<<<< HEAD
//     const { name, email, phone, numberCccd, gender, job, dob, address, password, confirmPassword, agreeTerms } = formData;
//     if (!name.trim()) return showNotification('Vui lòng nhập họ tên', 'error');
//     if (!/\S+@\S+\.\S+/.test(email)) return showNotification('Email không hợp lệ', 'error');
//     if (!/^0\d{9}$/.test(phone)) return showNotification('SĐT không hợp lệ', 'error');
//     if (!/^[0-9]{9,12}$/.test(numberCccd)) return showNotification('CCCD/CMND không hợp lệ', 'error');
//     if (!gender) return showNotification('Chọn giới tính', 'error');
//     if (!job.trim()) return showNotification('Nhập nghề nghiệp', 'error');
//     if (!dob) return showNotification('Chọn ngày sinh', 'error');
//     if (!address.trim()) return showNotification('Nhập địa chỉ', 'error');
//     if (password.length < 6) return showNotification('Mật khẩu ít nhất 6 ký tự', 'error');
//     if (password !== confirmPassword) return showNotification('Mật khẩu xác nhận không khớp', 'error');
//     if (!agreeTerms) return showNotification('Đồng ý điều khoản', 'error');
// =======
    if (!formData.name.trim()) {
      showNotification('Vui lòng nhập họ tên', 'error');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      showNotification('Vui lòng nhập email hợp lệ', 'error');
      return false;
    }
    if (!/^0\d{9}$/.test(formData.phone)) {
      showNotification('Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số', 'error');
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showNotification('Mật khẩu xác nhận không khớp', 'error');
      return false;
    }
    if (!formData.gender) {
      showNotification('Vui lòng chọn giới tính', 'error');
      return false;
    }
    if (!formData.address.trim()) {
      showNotification('Vui lòng nhập địa chỉ', 'error');
      return false;
    }
    if (!formData.job.trim()) {
      showNotification('Vui lòng nhập nghề nghiệp', 'error');
      return false;
    }

    if (!/^[0-9]{9,12}$/.test(formData.numberCccd)) {
      showNotification('Vui lòng nhập số CCCD/CMND hợp lệ (9-12 số)', 'error');
      return false;
    }
    if (!formData.agreeTerms) {
      showNotification('Vui lòng đồng ý với điều khoản sử dụng', 'error');
      return false;
    }
    if (!formData.dob || formData.dob.trim() === '') {
      showNotification('Vui lòng chọn ngày sinh', 'error');
      return false;
    }
    if (!formData.agreeTerms) {
      showNotification('Vui lòng đồng ý với điều khoản sử dụng', 'error');
      return false;
    }

// >>>>>>> origin/FE_Moi
    return true;
  };

  const handleSubmit = async (e) => {
// <<<<<<< HEAD
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     try {
//       const { confirmPassword, agreeTerms, ...data } = formData;
//       await register(data);
//       showNotification('Đăng ký thành công!', 'success');
//       navigate('/dashboard');
//     } catch (error) {
//       showNotification(error.message || 'Đăng ký thất bại', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };
// =======
  e.preventDefault();

  if (!validateForm()) return;

  try {
    setLoading(true);
    // ✅ Không gọi API đăng ký ở đây nữa
    showNotification("Vui lòng xác minh email để hoàn tất đăng ký", "info");
    navigate("/verifyGmail", { state: formData }); // Truyền dữ liệu sang verify
  } catch (error) {
    showNotification("Đã xảy ra lỗi. Vui lòng thử lại.", "error");
  } finally {
    setLoading(false);
  }
};
// >>>>>>> origin/FE_Moi

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Đăng ký tài khoản</h1>
          <p>Tham gia cộng đồng hiến máu nhân đạo</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid">
            <div className="floating-label">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder=" " required />
              <label>Họ và tên *</label>
            </div>
            <div className="floating-label">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder=" " required />
              <label>Email *</label>
            </div>

            <div className="floating-label">
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder=" " required />
              <label>Số điện thoại *</label>
            </div>
            <div className="floating-label">
              <input type="text" name="numberCccd" value={formData.numberCccd} onChange={handleChange} placeholder=" " required />
              <label>Số CCCD/CMND *</label>
            </div>

            <div className="floating-label">
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} placeholder=" " required />
              <label>Ngày sinh *</label>
            </div>
            <div className="floating-label">
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="" disabled hidden></option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              <label>Giới tính *</label>
            </div>

            <div className="floating-label full-width">
              <input type="text" name="job" value={formData.job} onChange={handleChange} placeholder=" " required />
              <label>Nghề nghiệp *</label>
            </div>

            <div className="floating-label full-width">
              <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder=" " required></textarea>
              <label>Địa chỉ *</label>
            </div>

            <div className="floating-label">
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder=" " required />
              <label>Mật khẩu *</label>
            </div>
            <div className="floating-label">
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder=" " required />
              <label>Xác nhận mật khẩu *</label>
              {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>
                  Mật khẩu xác nhận không khớp
                </small>
              )}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} required />
              Tôi đồng ý với <Link to="/terms">Điều khoản</Link> và <Link to="/privacy">Chính sách</Link>
            </label>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="register-footer">
          <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
