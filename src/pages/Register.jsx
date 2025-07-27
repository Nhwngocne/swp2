import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showNotification } from "../components/common/Notification";
import "../assets/css/pages/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberCccd: "",
    gender: "",
    job: "",
    dob: "",
    address: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Thêm trạng thái errors

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Kiểm tra lỗi thời gian thực
    let newErrors = { ...errors };
    if (name === "name" && !value.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    } else if (name === "name") {
      newErrors.name = "";
    }

    if (name === "email" && (!value.trim() || !/\S+@\S+\.\S+/.test(value))) {
      newErrors.email = "Vui lòng nhập email hợp lệ";
    } else if (name === "email") {
      newErrors.email = "";
    }

    if (name === "phone" && !/^0\d{9}$/.test(value)) {
      newErrors.phone = "Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số";
    } else if (name === "phone") {
      newErrors.phone = "";
    }

    if (name === "numberCccd" && !/^[0-9]{9,12}$/.test(value)) {
      newErrors.numberCccd = "Vui lòng nhập số CCCD/CMND hợp lệ (9-12 số)";
    } else if (name === "numberCccd") {
      newErrors.numberCccd = "";
    }

    if (name === "dob" && value) {
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dob = "Bạn phải từ 18 tuổi trở lên để đăng ký";
      } else {
        newErrors.dob = "";
      }
    } else if (name === "dob" && !value) {
      newErrors.dob = "Vui lòng chọn ngày sinh";
    }

    if (name === "gender" && !value) {
      newErrors.gender = "Vui lòng chọn giới tính";
    } else if (name === "gender") {
      newErrors.gender = "";
    }

    if (name === "job" && !value.trim()) {
      newErrors.job = "Vui lòng nhập nghề nghiệp";
    } else if (name === "job") {
      newErrors.job = "";
    }

    if (name === "address" && !value.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    } else if (name === "address") {
      newErrors.address = "";
    }

    if (name === "password" && (!value || value.length < 6)) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (name === "password") {
      newErrors.password = "";
    }

    if (name === "confirmPassword" && value !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    } else if (name === "confirmPassword") {
      newErrors.confirmPassword = "";
    }

    if (name === "agreeTerms" && !checked) {
      newErrors.agreeTerms = "Vui lòng đồng ý với điều khoản sử dụng";
    } else if (name === "agreeTerms") {
      newErrors.agreeTerms = "";
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Vui lòng nhập email hợp lệ";
    }
    if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }
    if (!formData.job.trim()) {
      newErrors.job = "Vui lòng nhập nghề nghiệp";
    }
    if (!/^[0-9]{9,12}$/.test(formData.numberCccd)) {
      newErrors.numberCccd = "Vui lòng nhập số CCCD/CMND hợp lệ (9-12 số)";
    }
    if (!formData.dob || formData.dob.trim() === "") {
      newErrors.dob = "Vui lòng chọn ngày sinh";
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dob = "Bạn phải từ 18 tuổi trở lên để đăng ký";
      }
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Vui lòng đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      console.log("Register formData:", formData); // Debug
      showNotification("Vui lòng xác minh email để hoàn tất đăng ký", "info");
      navigate("/verifyGmail", { state: formData });
    } catch (error) {
      console.error("Register submit error:", error);
      showNotification("Đã xảy ra lỗi. Vui lòng thử lại.", "error");
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
          <div className="form-grid">
            <div className="floating-label">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Họ và tên *</label>
              {errors.name && (
                <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                  {errors.name}
                </small>
              )}
            </div>
            <div className="floating-label">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Email *</label>
              {errors.email && (
                <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                  {errors.email}
                </small>
              )}
            </div>

            <div className="floating-label">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Số điện thoại *</label>
              {errors.phone && (
                <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                  {errors.phone}
                </small>
              )}
            </div>
            <div className="floating-label">
              <input
                type="text"
                name="numberCccd"
                value={formData.numberCccd}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Số CCCD/CMND *</label>
              {errors.numberCccd && (
                <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                  {errors.numberCccd}
                </small>
              )}
            </div>

            <div className="floating-label">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Ngày sinh *</label>
              {errors.dob && (
                <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                  {errors.dob}
                </small>
              )}
            </div>
            <div className="floating-label">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden></option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              <label>Giới tính *</label>
              {errors.gender && (
                <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                  {errors.gender}
                </small>
              )}
            </div>

            <div className="floating-label full-width">
              <input
                type="text"
                name="job"
                value={formData.job}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Nghề nghiệp *</label>
              {errors.job && (
                <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                  {errors.job}
                </small>
              )}
            </div>

            <div className="floating-label full-width">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                placeholder=" "
                required
              ></textarea>
              <label>Địa chỉ *</label>
              {errors.address && (
                <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                  {errors.address}
                </small>
              )}
            </div>

            <div className="floating-label">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Mật khẩu *</label>
              {errors.password && (
                <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                  {errors.password}
                </small>
              )}
            </div>
            <div className="floating-label">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Xác nhận mật khẩu *</label>
              {errors.confirmPassword && (
                <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                  {errors.confirmPassword}
                </small>
              )}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              Tôi đồng ý với <Link to="/terms">Điều khoản</Link> và{" "}
              <Link to="/privacy">Chính sách</Link>
            </label>
            {errors.agreeTerms && (
              <small style={{ color: "red", marginTop: "4px", display: "block" }}>
                {errors.agreeTerms}
              </small>
            )}
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;