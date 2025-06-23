import React, { useState } from "react";
import { authService } from "../../services/authService";
import "../../assets/css/member/EmergencyForm.css";
import { useAuth } from "../../services/AuthContext";

const EmergencyForm = () => {
  const { user } = useAuth(); // Lấy thông tin người dùng
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    component: "",
    freeday: "",
    location: "",
    status: "PENDING",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.component || !formData.location || !formData.freeday) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  const dataToSend = {
    component: formData.component,
    location: formData.location,
    // Chuyển về định dạng yyyy-MM-dd
    freeday: new Date(formData.freeday).toISOString().split("T")[0],
    status: formData.status,
  };

  try {
    console.log("Data gửi đi:", dataToSend);
    await authService.createEmergency(dataToSend);
    alert("Đã gửi yêu cầu khẩn cấp!");
    setFormData({
      component: "",
      freeday: "",
      location: "",
      status: "PENDING",
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
          {user && <p>Xin chào, {user.name || user.fullName || user.email}!</p>}
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
            <button type="submit">Gửi yêu cầu</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmergencyForm;
