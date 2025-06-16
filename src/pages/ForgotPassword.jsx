import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../assets/css/pages/Login.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyEmail = async () => {
    if (!email) return setError('Vui lòng nhập email');
    setLoading(true);
    try {
      await authService.verifyEmail(email);
      setStep(2);
    } catch {
      setError('Không thể gửi email xác thực.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError('Vui lòng nhập mã OTP');
    setLoading(true);
    try {
      await authService.verifyOtp(otp, email);
      setStep(3);
    } catch {
      setError('Mã OTP không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return setError('Mật khẩu phải có ít nhất 6 ký tự');
    }
    setLoading(true);
    try {
      await authService.changeForgottenPassword(email, newPassword);
      navigate('/login');
    } catch {
      setError('Đổi mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Quên mật khẩu</h2>
          {error && <div className="alert alert-error">{error}</div>}

          {step === 1 && (
            <>
              <p className="login-subtitle">Nhập email để nhận mã OTP</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
              <button onClick={handleVerifyEmail} className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="login-subtitle">Nhập mã OTP đã gửi đến email</p>
              <input
                type="text"
                placeholder="Nhập OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-input"
              />
              <button onClick={handleVerifyOtp} className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Đang xác minh...' : 'Xác minh OTP'}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="login-subtitle">Nhập mật khẩu mới</p>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
              />
              <button onClick={handleChangePassword} className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </>
          )}

          <div className="login-footer">
            <p><Link to="/login" className="register-link">Quay lại đăng nhập</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
