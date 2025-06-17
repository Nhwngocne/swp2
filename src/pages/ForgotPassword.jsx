import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "../assets/css/pages/ForgotPassword.css";

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
        setSuccessMessage("Mã OTP đã được gửi về email của bạn.");
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
  setError("");
  setSuccessMessage("");
  try {
    const res = await authService.verifyOtp(otp, email);

    if (res.data?.code === 1000 && res.data?.result?.verified) {
      setSuccessMessage("Mã OTP xác thực thành công. Vui lòng nhập mật khẩu mới.");
      setStep(3);
    } else {
      setError(res.data?.message || "Mã OTP không chính xác.");
      // ❌ KHÔNG setStep(3) ở đây
    }
  } catch (err) {
    setError(err.response?.data?.message || "Mã OTP không chính xác.");
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
        setSuccessMessage("Đổi mật khẩu thành công. Đang chuyển hướng...");
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
    <div className="forgot-page">
      <div className="forgot-container">
        <div className="forgot-card">
          <h2 className="forgot-title">Quên mật khẩu</h2>

          {successMessage && (
            <div className="forgot-alert forgot-alert-success">
              <FaCheckCircle className="icon-success" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="forgot-alert forgot-alert-error">
              <FaExclamationCircle className="icon-error" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <>
              <p className="forgot-subtitle">Nhập email để nhận mã OTP</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="forgot-input"
              />
              <button
                onClick={handleVerifyEmail}
                className="forgot-btn"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="forgot-subtitle">Nhập mã OTP đã gửi đến email</p>
              <input
                type="text"
                placeholder="Nhập OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="forgot-input"
              />
              <button
                onClick={handleVerifyOtp}
                className="forgot-btn"
                disabled={loading}
              >
                {loading ? "Đang xác minh..." : "Xác minh OTP"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="forgot-subtitle">Nhập mật khẩu mới</p>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="forgot-input"
              />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="forgot-input"
              />
              <button
                onClick={handleChangePassword}
                className="forgot-btn"
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </button>
            </>
          )}

          <div className="forgot-footer">
            <p>
              <Link to="/login" className="forgot-link">Quay lại đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
