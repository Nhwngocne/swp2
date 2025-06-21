import React, { useState } from "react";
import "../../assets/css/member/Form.css"; // tuỳ bạn tạo
import { useAuth } from "../../services/AuthContext"; // Giả sử bạn có AuthContext để lấy thông tin người dùng
import { authService } from "../../services/authService"; // Giả sử bạn có authService để gửi dữ liệu lên server

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    numberCccd: "",
    bloodType: "",
    address: "",
    phone: "",
    email: "",
    role: "donor", // "donor" or "receiver"
  });

  const [showForm, setShowForm] = useState(false); // Thêm trạng thái ẩn/hiện form

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu đăng ký:", formData);

    // TODO: Gửi dữ liệu lên server thông qua API
    alert("Đăng ký thành công!");
  };

  return (
    <div>
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="open-form-btn">
          Đăng ký hiến/nhận máu
        </button>
      )}

      {showForm && (
        <div className="blood-register-form">
          <h2>Đăng ký {formData.role === "donor" ? "hiến máu" : "nhận máu"}</h2>

          

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Ngày sinh:</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Giới tính:</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">--Chọn--</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label>Số CCCD:</label>
              <input type="text" name="numberCccd" value={formData.numberCccd} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Nhóm máu:</label>
              <select name="bloodType" value={formData.bloodType} onChange={handleChange} required>
                <option value="">--Chọn--</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group">
              <label>Địa chỉ:</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Số điện thoại:</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Bạn là:</label>
              <div className="role-options">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="donor"
                    checked={formData.role === "donor"}
                    onChange={handleChange}
                  />
                  Người cho
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="receiver"
                    checked={formData.role === "receiver"}
                    onChange={handleChange}
                  />
                  Người nhận
                </label>
              </div>
            </div>

            <button type="submit" className="submit-btn">Gửi đăng ký</button>
          </form>
          <button onClick={() => setShowForm(false)} className="close-form-btn">
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;
