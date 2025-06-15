import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showNotification } from '../components/common/Notification';
import { registerAPI } from '../services/member'; // Sử dụng API trực tiếp
import '../assets/css/pages/Register.css';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return showNotification('Vui lòng nhập họ tên', 'error') || false;
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      return showNotification('Vui lòng nhập email hợp lệ', 'error') || false;
    if (!formData.phone.trim() || !/^[0-9]{10,11}$/.test(formData.phone))
      return showNotification('Vui lòng nhập số điện thoại hợp lệ', 'error') || false;
    if (!formData.password || formData.password.length < 6)
      return showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error') || false;
    if (formData.password !== formData.confirmPassword)
      return showNotification('Mật khẩu xác nhận không khớp', 'error') || false;
    if (!formData.gender) return showNotification('Vui lòng chọn giới tính', 'error') || false;
    if (!formData.address.trim()) return showNotification('Vui lòng nhập địa chỉ', 'error') || false;
    if (!formData.job.trim()) return showNotification('Vui lòng nhập nghề nghiệp', 'error') || false;
    if (!/^[0-9]{9,12}$/.test(formData.numberCccd))
      return showNotification('Vui lòng nhập số CCCD/CMND hợp lệ (9-12 số)', 'error') || false;
    if (!formData.agreeTerms)
      return showNotification('Vui lòng đồng ý với điều khoản sử dụng', 'error') || false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, agreeTerms, ...registerData } = formData;
      await registerAPI(registerData);
      showNotification('Đăng ký thành công!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showNotification(error.message || 'Đăng ký thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  // JSX giữ nguyên như cũ...
  return (
    <div className="register-page">
      {/* phần còn lại như bạn viết */}
    </div>
  );
};

export default Register;
