import React, { useState } from "react";
import { authService } from "../../services/authService";
import "../../assets/css/member/EmergencyForm.css"; // Tuỳ chỉnh CSS của bạn
import { useAuth } from "../../services/AuthContext"; // Giả sử bạn có AuthContext để lấy thông tin người dùng

const EmergencyForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    component: "",
    freeday: "",
    location: "",
    blood_type_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.createEmergency(formData);
      alert("Đã gửi yêu cầu khẩn cấp!");
      setFormData({
        component: "",
        freeday: "",
        location: "",
        blood_type_id: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi gửi yêu cầu khẩn cấp:", err);
      alert("Gửi yêu cầu thất bại.");
    }
  };

  return (
    <div className="emergency-form-container">
      <button onClick={() => setShowForm(!showForm)} className="toggle-button">
        {showForm ? "Đóng form khẩn cấp" : "Mở form khẩn cấp"}
      </button>

      {showForm && (
        <div className="emergency-form">
          <h2>Đăng ký khẩn cấp</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Thành phần (component):</label>
              <input
                type="text"
                name="component"
                value={formData.component}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Ngày nghỉ (freeday):</label>
              <input
                type="date"
                name="freeday"
                value={formData.freeday}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Địa điểm (location):</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
           
            <div>
              <label>Blood Type ID:</label>
              <input
                type="number"
                name="blood_type_id"
                value={formData.blood_type_id}
                onChange={handleChange}
              />
            </div>
            
            <button type="submit">Gửi yêu cầu</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmergencyForm;
