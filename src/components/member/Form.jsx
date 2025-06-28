import React, { useState, useContext } from "react";
import "../../assets/css/member/Form.css";
import { bloodIntentService } from "../../services/bloodIntentService";
import { AuthContext } from "../../services/AuthContext";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    available_from: "",
    available_to: "",
    blood_type: "",
    intent_type: "donor",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      memberId: user?.id, // hoặc user.member_id
      status: "pending",
    };

    try {
      await bloodIntentService.createBloodIntent(dataToSend);
      alert("Đăng ký thành công!");
      // reset form nếu muốn
      setFormData({
        available_from: "",
        available_to: "",
        blood_type: "",
        intent_type: "donor",
        location: "",
      });
      navigate("/lookup"); // chuyển hướng về trang tìm kiếm
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="blood-register-form">
      <h2>Đăng ký {formData.intent_type === "donor" ? "hiến máu" : "nhận máu"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ngày bắt đầu:</label>
          <input
            type="date"
            name="available_from"
            value={formData.available_from}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ngày kết thúc:</label>
          <input
            type="date"
            name="available_to"
            value={formData.available_to}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nhóm máu:</label>
          <select
            name="blood_type"
            value={formData.blood_type}
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
          <label>Bạn là:</label>
          <div className="role-options">
            <label>
              <input
                type="radio"
                name="intent_type"
                value="donor"
                checked={formData.intent_type === "donor"}
                onChange={handleChange}
              />
              Người hiến
            </label>
            <label>
              <input
                type="radio"
                name="intent_type"
                value="receiver"
                checked={formData.intent_type === "receiver"}
                onChange={handleChange}
              />
              Người nhận
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Gửi đăng ký
        </button>
      </form>
    </div>
  );
};

export default Form;
