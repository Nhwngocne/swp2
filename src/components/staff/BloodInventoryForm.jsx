import React, { useState } from "react";
import { useAuth } from "../../services/AuthContext";
import { bloodService } from "../../services/BloodService";
import "../../assets/css/components/staff/BloodInventoryForm.css";

const BloodInventoryForm = ({ bloodInventories = [], onSuccess }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    bloodType: "",
    addQuantity: "",
  });

  // Map nhóm máu sang bloodTypeId (chuẩn)
  const bloodMap = {
    "O-": 6, "O+": 7, "A-": 8, "A+": 9,
    "B-": 10, "B+": 11, "AB-": 12, "AB+": 13
  };

  const bloodTypes = Object.keys(bloodMap);

  const getCurrentQuantity = () => {
    if (!formData.bloodType) return 0;
    const bloodTypeId = bloodMap[formData.bloodType];

    // ✅ Tìm inventory đúng bloodTypeId
    const inventory = bloodInventories.find(inv => 
      Number(inv.bloodTypeId) === Number(bloodTypeId)
    );

    console.log(`===> Inventory cho ${formData.bloodType}:`, inventory);
    return inventory ? inventory.quantity : 0;
  };

  const handleToggleForm = () => {
    setShowForm(prev => !prev);
    if (!showForm) {
      setFormData({
        bloodType: "",
        addQuantity: ""
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddQuantity = async () => {
    if (!formData.bloodType || !formData.addQuantity) {
      alert("Vui lòng chọn nhóm máu và nhập số lượng.");
      return;
    }

    const addNum = parseInt(formData.addQuantity, 10);
    if (isNaN(addNum) || addNum <= 0) {
      alert("Số lượng phải là số lớn hơn 0.");
      return;
    }

    const bloodTypeId = bloodMap[formData.bloodType];
    const inventory = bloodInventories.find(inv =>
      Number(inv.bloodTypeId) === Number(bloodTypeId)
    );

    if (!inventory) {
      alert(`Không tìm thấy kho máu cho nhóm máu ${formData.bloodType}`);
      return;
    }

    try {
      const payload = {
        component: inventory.component,
        quantity: inventory.quantity + addNum,
        lastUpdated: new Date().toISOString().split('T')[0],
        staffId: user?.id || null,
      };

      console.log("🚀 Payload gửi lên server:", payload);

      await bloodService.updateBloodInventory(inventory.id, payload);

      alert(`Đã thêm ${addNum} đơn vị máu cho nhóm ${formData.bloodType}`);
      onSuccess && onSuccess();
      setShowForm(false);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật kho máu:", err);
      alert("Cập nhật kho máu thất bại!");
    }
  };

  return (
    <div className="blood-inventory-container">
      <button className="toggle-button" onClick={handleToggleForm}>
        {showForm ? "Đóng form" : "Thêm Đơn Vị Máu"}
      </button>

      {showForm && (
        <div className="blood-form">
          <h2>Thêm Đơn Vị Máu</h2>
          <div className="blood-form-group">
            <label>Nhóm máu</label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn nhóm máu --</option>
              {bloodTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {formData.bloodType && (
            <>
              <div className="blood-form-group">
                <label>Số lượng hiện tại:</label>
                <span style={{ fontWeight: 'bold' }}>{getCurrentQuantity()}</span>
              </div>
              <div className="blood-form-group">
                <label>Thêm số lượng:</label>
                <input
                  type="number"
                  name="addQuantity"
                  value={formData.addQuantity}
                  onChange={handleChange}
                  placeholder="Nhập số lượng muốn thêm"
                  min="1"
                />
              </div>
              <button
                type="button"
                className="submit-button"
                onClick={handleAddQuantity}
              >
                Thêm
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BloodInventoryForm;
