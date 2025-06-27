import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../services/AuthContext";
import { signInWithGoogle } from "../services/firebaseConfig";
import '../assets/css/pages/Login.css';
import googleLogo from '../assets/img/logo-gg.png'; // ✅ đúng tên


const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu sai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        const role = result.role || localStorage.getItem("role"); // Lấy role từ response hoặc localStorage

        if (role === "ADMIN") {
          navigate("/admin-dashboard");
        } else if (role === "STAFF") {
          navigate("/staffDashboard");
        } else if (role === "MEMBER") {
          navigate("/home");
        } else {
          navigate("/"); // fallback
        }
      } else {
        setErrors({ general: result.error || "Đăng nhập thất bại" });
      }
    } catch (error) {
      setErrors({ general: "Có lỗi xảy ra khi đăng nhập." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const response = await loginWithGoogle(idToken);

      if (response.success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setErrors({ general: response.error || "Đăng nhập Google thất bại" });
      }
    } catch (error) {
      console.error("Đăng nhập Google thất bại:", error);
      setErrors({ general: "Đăng nhập Google thất bại. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Đăng nhập</h1>
            <p className="login-subtitle">Chào mừng bạn trở lại</p>
          </div>

          {errors.general && (
            <div className="alert alert-error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Nhập địa chỉ email của bạn"
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Mật khẩu *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Nhập mật khẩu của bạn"
                disabled={loading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="login-divider"><span>hoặc</span></div>

          <div className="social-login">
            <button
              className="btn btn-social btn-google"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img
                src={googleLogo}
                alt="Google"
                style={{ width: "20px", height: "20px" }}
              />
              Đăng nhập với Google
            </button>
          </div>

          <div className="login-footer">
            <Link to="/forgotPassword" className="forgotPassword">Quên mật khẩu?</Link>
            <p>

              Chưa có tài khoản?
              <Link to="/register" className="register-link"> Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
