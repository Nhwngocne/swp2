import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showNotification } from "../components/common/Notification";
import { useAuth } from "../services/AuthContext";
import "../assets/css/pages/VerifyGmail.css";

const VerifyGmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendOtp, verifyOtpRegis, register } = useAuth();

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(""); // ✅ Thêm state lỗi
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSendOtp = async (email) => {
    try {
      console.log("Sending OTP to:", email); // Debug
      const result = await sendOtp(email);
      console.log("Send OTP result:", result); // Debug
      if (result.success) {
        //showNotification(result.message, "success");
        console.error("Send OTP error:", err.response || err);
        showNotification(
          err.response?.data?.message || "Gửi OTP thất bại. Vui lòng thử lại.",
          "error"
        );
      } else {
        showNotification(result.error, "error");
      }
    } catch (err) {
      showNotification(err.message || "Gửi OTP thất bại", "error");
    }
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) {
      showNotification(
        `Vui lòng đợi ${resendCooldown} giây trước khi gửi lại OTP`,
        "info"
      );
      return;
    }
    setOtp("");
    setOtpError("");
    handleSendOtp(email);
    setResendCooldown(30);
  };

  useEffect(() => {
    const formData = location.state;
    console.log("VerifyGmail useEffect - formData:", formData);
    if (!formData || !formData.email || typeof formData.email !== "string") {
      console.log("Invalid formData, navigating to /register");
      showNotification("Thiếu thông tin đăng ký. Vui lòng thử lại.", "error");
      navigate("/register");
      return;
    }

    setUserData(formData);
    setEmail(formData.email);

    handleSendOtp(formData.email);
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Vui lòng nhập mã OTP");
      return;
    }

    setOtpError("");
    setLoading(true);

    try {
      console.log("Verifying OTP:", otp, "for email:", email); // Debug
      const verifyResult = await verifyOtpRegis(otp, email);
      console.log("Verify OTP result:", verifyResult); // Debug 
      if (verifyResult.success) {
        const { confirmPassword, agreeTerms, ...registerData } = userData;
        const registerResult = await register(registerData);

        if (registerResult.success) {
          showNotification(registerResult.message, "success");
          navigate("/login");
        } else {
          setOtpError(registerResult.error || "Đăng ký thất bại");
        }
      } else {
        setOtpError(verifyResult.error || "Mã OTP không đúng hoặc đã hết hạn");
      }
    } catch (err) {
      console.error("Verify OTP error:", err.response || err);
      setOtpError(err.response?.data?.message || "Xác minh OTP thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <h2>Xác minh Email</h2>
      <p>
        Chúng tôi đã gửi mã OTP đến email: <strong>{email}</strong>
      </p>

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
        {otpError && <p className="error-message">{otpError}</p>}{" "}
        {/* ✅ Hiển thị lỗi ở đây */}
      </div>

      <button
        onClick={handleVerifyOtp}
        className="register-btn"
        disabled={loading}
      >
        {loading ? "Đang xác minh..." : "Xác minh OTP"}
      </button>
      {/* resend otp */}
      <button
        onClick={handleResendOtp}
        className="resend-otp-btn"
        disabled={loading}
      >
        Gửi lại OTP
      </button>
    </div>
  );
};

export default VerifyGmail;
