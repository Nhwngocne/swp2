import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showNotification } from '../components/common/Notification';
import './Register.css'; // Import your CSS styles  

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    address: '',
    job: '',
    numberCccd: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showNotification('Vui lòng nhập họ tên', 'error');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      showNotification('Vui lòng nhập email hợp lệ', 'error');
      return false;
    }
    if (!formData.phone.trim() || !/^[0-9]{10,11}$/.test(formData.phone)) {
      showNotification('Vui lòng nhập số điện thoại hợp lệ', 'error');
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
    if (!formData.numberCccd.trim() || !/^[0-9]{9,12}$/.test(formData.numberCccd)) {
      showNotification('Vui lòng nhập số CCCD/CMND hợp lệ (9-12 số)', 'error');
      return false;
    }
    if (!formData.agreeTerms) {
      showNotification('Vui lòng đồng ý với điều khoản sử dụng', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare data for API (exclude confirmPassword and agreeTerms)
      const { confirmPassword, agreeTerms, ...registerData } = formData;
      await register(registerData);
      showNotification('Đăng ký thành công!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showNotification(error.message || 'Đăng ký thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Đăng ký tài khoản</h1>
          <p>Tham gia cộng đồng hiến máu nhân đạo</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3>Thông tin cá nhân</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Họ và tên *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="numberCccd">Số CCCD/CMND *</label>
                <input
                  type="text"
                  id="numberCccd"
                  name="numberCccd"
                  value={formData.numberCccd}
                  onChange={handleChange}
                  pattern="[0-9]{9,12}"
                  title="Vui lòng nhập số CCCD/CMND từ 9-12 chữ số"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Giới tính *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="job">Nghề nghiệp *</label>
                <input
                  type="text"
                  id="job"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  placeholder="Ví dụ: Sinh viên, Kỹ sư, Bác sĩ..."
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Địa chỉ *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                placeholder="Nhập địa chỉ đầy đủ của bạn"
                required
              />
            </div>
          </div>

          {/* Account Security */}
          <div className="form-section">
            <h3>Bảo mật tài khoản</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Mật khẩu *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                />
                <small>Mật khẩu phải có ít nhất 6 ký tự</small>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <span className="checkmark"></span>
              Tôi đồng ý với <Link to="/terms">Điều khoản sử dụng</Link> và <Link to="/privacy">Chính sách bảo mật</Link>
            </label>
          </div>

          <button
            type="submit"
            className={`register-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;