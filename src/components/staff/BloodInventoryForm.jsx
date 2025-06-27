import React, { useState } from "react";
import { useAuth } from "../../services/AuthContext";
import { bloodService } from "../../services/BloodService";
import "../../assets/css/components/staff/BloodInventoryForm.css";

const BloodInventoryForm = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    component: "",
    quantity: "",
    lastUpdated: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.component || !formData.quantity || !formData.lastUpdated) {
      alert("Vui lòng điền đủ thông tin bắt buộc.");
      return;
    }

    try {
      const payload = {
        component: formData.component,
        quantity: parseInt(formData.quantity, 10),
        lastUpdated: formData.lastUpdated,
        staffId: user?.id || null,    // hoặc nếu bạn muốn staffId cũng từ user
      };

      console.log("Payload gửi đi:", payload);

      await bloodService.createBloodInventory(payload);

      alert("Thêm kho máu thành công!");
      setFormData({
        component: "",
        quantity: "",
        lastUpdated: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Lỗi khi thêm kho máu:", err);
      alert("Thêm kho máu thất bại!");
    }
  };

  return (
    <div className="blood-inventory-container">
      <button
        className="toggle-button"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Đóng form" : "Mở form thêm kho máu"}
      </button>

      {showForm && (
        <form className="blood-form" onSubmit={handleSubmit}>
          <h2>Thêm Kho Máu</h2>
          <div className="blood-form-group">
            <label>Thành phần máu</label>
            <input
              name="component"
              value={formData.component}
              onChange={handleChange}
              required
            />
          </div>
          <div className="blood-form-group">
            <label>Số lượng</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="blood-form-group">
            <label>Ngày cập nhật</label>
            <input
              type="date"
              name="lastUpdated"
              value={formData.lastUpdated}
              onChange={handleChange}
              required
            />
          </div>
          {/* Ẩn trường staffId, adminId vì đã tự lấy từ user */}
          <button type="submit" className="submit-button">Lưu</button>
        </form>
      )}
    </div>
  );
};

export default BloodInventoryForm;
