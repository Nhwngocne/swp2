import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { showNotification } from '../components/common/Notification';
import { useAuth } from '../services/AuthContext';
import '../assets/css/pages/VerifyGmail.css';

const VerifyGmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(''); // ✅ Thêm state lỗi
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const formData = location.state;
    if (!formData) {
      showNotification('Thiếu thông tin đăng ký. Vui lòng thử lại.', 'error');
      navigate('/register');
      return;
    }

    setUserData(formData);
    setEmail(formData.email);

    sendOtp(formData.email);
  }, []);

  const sendOtp = async (email) => {
    try {
      const res = await authService.verifyEmail(email);
      if (res.data?.code === 1000) {
        showNotification('Mã OTP đã được gửi đến email của bạn', 'success');
      } else {
        showNotification(res.data?.message || 'Gửi OTP thất bại', 'error');
      }
    } catch (err) {
      showNotification(err.message || 'Gửi OTP thất bại', 'error');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError('Vui lòng nhập mã OTP'); // ✅ Gán lỗi tại đây
      return;
    }

    setOtpError(''); // ✅ Xoá lỗi cũ nếu có
    setLoading(true);

    try {
      const res = await authService.verifyOtp(otp, email);
      if (res.data?.code === 1000 && res.data?.result?.verified) {
        const { confirmPassword, agreeTerms, ...registerData } = userData;
        const registerRes = await authService.register(registerData);

        if (registerRes.data?.success) {
          showNotification('Đăng ký thành công!', 'success');
          navigate('/login');
        } else {
          setOtpError(registerRes.data?.message || 'Đăng ký thất bại'); // ✅ Hiển thị lỗi đăng ký nếu có
        }
      } else {
        setOtpError('Mã OTP không đúng hoặc đã hết hạn');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Xác minh OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <h2>Xác minh Email</h2>
      <p>Chúng tôi đã gửi mã OTP đến email: <strong>{email}</strong></p>

      <div className="form-group">
        <label htmlFor="otp">Mã OTP</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Nhập mã OTP"
          required
        />
        {otpError && <p className="error-message">{otpError}</p>} {/* ✅ Hiển thị lỗi ở đây */}
      </div>

      <button onClick={handleVerifyOtp} className="register-btn" disabled={loading}>
        {loading ? 'Đang xác minh...' : 'Xác minh OTP'}
      </button>
    </div>
  );
};

export default VerifyGmail;
