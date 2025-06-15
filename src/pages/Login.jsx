import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/pages/Login.css';
import { LoginAPI } from '../services/login';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '' });
  const [inValid, setInValid] = useState('');
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (validateForm(email, password)) {
      const loginData = { email, password };
      LoginAPI(loginData)
        .then((response) => {
          setInValid('');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('rolename', response.data.rolename);
          navigate('/home');
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            setInValid('Invalid email or password');
          } else {
            console.log('Unexpected login error:', error);
          }
        });
    }
  }

  function validateForm(email, password) {
    let isValid = true;
    const copyError = { email: '', password: '' };

    if (!email.trim()) {
      copyError.email = 'Email is required';
      isValid = false;
      setInValid('');
    }

    if (!password.trim()) {
      copyError.password = 'Password is required';
      isValid = false;
      setInValid('');
    }

    setError(copyError);
    return isValid;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image-section">
        </div>

        <div className="login-form-section">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleLogin}>
            <input
              className={`login-input form-control ${error.email ? 'is-invalid' : ''}`}
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              required
            />
            {error.email && <div className="invalid-feedback">{error.email}</div>}

            <input
              className={`login-input form-control ${error.password ? 'is-invalid' : ''}`}
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
            />
            {error.password && <div className="invalid-feedback">{error.password}</div>}
            {inValid && <div className="invalid-feedback d-block">{inValid}</div>}

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <a href="/auth/google" className="login-button google-button">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="google-icon"
            />
            Sign in with Google
          </a>

          <p className="register-text">
            Don't have an account?{' '}
            <a href="/email/register" className="register-link">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
