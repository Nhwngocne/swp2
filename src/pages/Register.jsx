import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showNotification } from '../components/common/Notification';


const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    bloodType: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
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
    if (!formData.fullName.trim()) {
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
    if (!formData.birthDate) {
      showNotification('Vui lòng nhập ngày sinh', 'error');
      return false;
    }
    if (!formData.gender) {
      showNotification('Vui lòng chọn giới tính', 'error');
      return false;
    }
    if (!formData.bloodType) {
      showNotification('Vui lòng chọn nhóm máu', 'error');
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
      await register(formData);
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
                <label htmlFor="fullName">Họ và tên *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
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
                <label htmlFor="birthDate">Ngày sinh *</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
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
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="bloodType">Nhóm máu *</label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn nhóm máu</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="form-section">
            <h3>Liên hệ khẩn cấp</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergencyContact">Tên người liên hệ</label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyPhone">Số điện thoại</label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="form-section">
            <h3>Thông tin y tế</h3>
            <div className="form-group">
              <label htmlFor="medicalHistory">Tiền sử bệnh lý (nếu có)</label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows="3"
                placeholder="Mô tả các bệnh lý, dị ứng, thuốc đang sử dụng..."
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