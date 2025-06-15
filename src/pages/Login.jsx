import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../services/AuthContext";
import '../assets/css/pages/Login.css'; //
const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  //Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setErrors({ general: result.error || 'Đăng nhập thất bại' });
      }
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại.' });
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
            <p className="login-subtitle">
              Chào mừng bạn trở lại 
            </p>
          </div>

          {errors.general && (
            <div className="alert alert-error">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
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
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mật khẩu *
              </label>
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
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>


          <div className="login-divider">
            <span>hoặc</span>
          </div>

          <div className="social-login">
            <button className="btn btn-social btn-google">
              <img src="/assets/google-icon.svg" alt="Google" />
              Đăng nhập với Google
            </button>

          </div>


          <div className="login-footer">
            <p>
              Chưa có tài khoản? 
              <Link to="/register" className="register-link">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Login;