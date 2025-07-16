import React, { useState, useContext } from "react";
import "../../assets/css/member/Form.css";
import { bloodIntentService } from "../../services/bloodIntentService";
import { AuthContext } from "../../services/AuthContext";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    availableFrom: "",
    availableTo: "",
    bloodType: "",
    intentType: "CHO",
    location: "",
    description: "",
    phone: user?.phone || "",
    quantity: 1,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData
    };

    console.log("Submitting:", dataToSend);

    try {
      await bloodIntentService.createBloodIntent(dataToSend);
      alert("Đăng ký thành công!");
      navigate("/lookup");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="blood-register-form">
      <h2>Đăng ký {formData.intentType === "CHO" ? "cho máu" : "nhận máu"}</h2>
      <form onSubmit={handleSubmit}>
         <div className="form-group">
          <label>Bạn là:</label>
          <div className="role-options">
            <label>
              <input
                type="radio"
                name="intentType"
                value="CHO"
                checked={formData.intentType === "CHO"}
                onChange={handleChange}
              />
              Người cho
            </label>
            <label>
              <input
                type="radio"
                name="intentType"
                value="NHAN"
                checked={formData.intentType === "NHAN"}
                onChange={handleChange}
              />
              Người nhận
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Ngày bắt đầu:</label>
          <input
            type="date"
            name="availableFrom"
            value={formData.availableFrom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ngày kết thúc:</label>
          <input
            type="date"
            name="availableTo"
            value={formData.availableTo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nhóm máu:</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            required
          >
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
          <label>Địa điểm:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mô tả thêm:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ghi chú cụ thể nếu cần"
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Số lượng máu (ml):</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

       

        <button type="submit" className="submit-btn">
          Gửi đăng ký
        </button>
      </form>
    </div>
  );
};

export default Form;
