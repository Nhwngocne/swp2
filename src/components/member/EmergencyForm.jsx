import React, { useState } from "react";
import "../../assets/css/member/EmergencyForm.css";
import { useAuth } from "../../services/AuthContext";
import { useEmergency } from "../../services/EmergencyContext";

const EmergencyForm = () => {
  const { user } = useAuth();
  const { createEmergencyRequest, fetchEmergencyRequests } = useEmergency();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.address || "",
    component: "",
    description: "",
    status: "PENDING",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.location ||
      !formData.component ||
      !formData.description
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const dataToSend = {
      name: formData.name,
      phone: formData.phone,
      location: formData.location,
      component: formData.component,
      description: formData.description,
      status: formData.status,
    };

    try {
      console.log("Data gửi đi:", dataToSend);
      const response = await createEmergencyRequest(dataToSend);
      if (response.success) {
        alert("Đã gửi yêu cầu khẩn cấp!");
        setFormData({
          name: user?.name || "",
          phone: user?.phone || "",
          location: user?.address || "",
          component: "",
          description: "",
          status: "PENDING",
        });
        setShowForm(false);
        await fetchEmergencyRequests(); // Làm mới danh sách
      } else {
        alert(response.error || "Gửi yêu cầu thất bại.");
      }
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
              <label>Tên (name):</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Số điện thoại (phone):</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
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
              <label>Thành phần (component):</label>
              <input
                type="text"
                name="component"
                value={formData.component}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Mô tả (description):</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength="1000"
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