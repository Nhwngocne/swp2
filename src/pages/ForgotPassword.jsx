import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../assets/css/pages/Login.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyEmail = async () => {
    if (!email) return setError("Vui lòng nhập email");
    setLoading(true);
    setError("");
    try {
      const res = await authService.verifyEmail(email);
      if (res.data?.code === 1000) {
        setStep(2);
        setSuccessMessage("✅ Mã OTP đã được gửi về email của bạn.");
      } else {
        setError(res.data?.message || "Không thể gửi email xác thực.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Không thể gửi email xác thực.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError("Vui lòng nhập mã OTP");
    setLoading(true);
    try {
      const res = await authService.verifyOtp(otp, email);
      if (res.data?.code === 1000 && res.data?.result?.verified) {
        setStep(3);
        setSuccessMessage(
          "✅ Mã OTP xác thực thành công. Vui lòng nhập mật khẩu mới."
        );
      } else {
        setError(res.data?.message || "Mã OTP không chính xác.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Mã OTP không chính xác.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return setError("Mật khẩu phải có ít nhất 6 ký tự");
    }
    if (newPassword !== repeatPassword) {
      return setError("Mật khẩu nhập lại không khớp");
    }
    setLoading(true);
    setError("");
    try {
      const res = await authService.changeForgottenPassword(email, {
        password: newPassword,
        repeatPassword: repeatPassword,
      });
      if (res.data?.code === 1000 && res.data?.result?.changed) {
        setSuccessMessage(
          "✅ Đổi mật khẩu thành công. Đang chuyển hướng đến trang đăng nhập..."
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(res.data?.message || "Đổi mật khẩu thất bại.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đổi mật khẩu thất bại.");
      setSuccessMessage("");
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
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
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
              <button
                onClick={handleVerifyEmail}
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
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
              <button
                onClick={handleVerifyOtp}
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? "Đang xác minh..." : "Xác minh OTP"}
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

              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="form-input"
              />

              <button
                onClick={handleChangePassword}
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </button>
            </>
          )}

          <div className="login-footer">
            <p>
              <Link to="/login" className="register-link">
                Quay lại đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
