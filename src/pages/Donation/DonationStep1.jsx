import React from "react";
import "../../assets/css/pages/DonationStep1.css";

export default function DonationStep1({ formData, setFormData, onNext, eventData, bloodTypes, bloodTypeMap }) {
  const { bloodTypes: eventBloodTypes, session, donationMorningStart, donationMorningEnd, donationAfternoonStart, donationAfternoonEnd } = eventData;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa chọn ngày";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="step-section">
      <h2>Bước 1: Thông tin đặt hiến máu</h2>

      <div className="mb-4">
        <label>Ngày hiến máu:</label>
        <input type="text" value={formatDate(formData.donation_date)} disabled />
      </div>

      <div className="mb-4">
        <label>Địa điểm hiến máu:</label>
        <input type="text" value={formData.location || "Chưa chọn địa điểm"} disabled />
      </div>

      <div className="mb-4">
        <label>Nhóm máu cần hiến:</label>
        <input
          type="text"
          value={Array.isArray(eventBloodTypes) && eventBloodTypes.length > 0 ? eventBloodTypes.join(", ") : "Không xác định"}
          disabled
        />
      </div>

      <div className="mb-4">
        <label>Nhóm máu của bạn:</label>
        <select
          name="bloodTypeId"
          value={formData.bloodTypeId || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="" disabled>
            Chọn nhóm máu
          </option>
          {Object.keys(bloodTypeMap).map((name) => (
            <option key={bloodTypeMap[name]} value={bloodTypeMap[name]}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label>Thể tích máu hiến:</label>
        <div className="volume-options">
          {["250", "350", "400"].map((volume) => (
            <label key={volume}>
              <input
                type="radio"
                name="volumeMl"
                value={volume}
                checked={formData.volumeMl === volume}
                onChange={handleChange}
              />
              {volume} ml
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label>Khung giờ hiến máu:</label>
        <div className="session-options">
          {(session === "ALL" || session === "MORNING") && (
            <label>
              <input
                type="radio"
                name="session"
                value="MORNING"
                checked={formData.session === "MORNING"}
                onChange={handleChange}
              />
              {donationMorningStart} - {donationMorningEnd}
            </label>
          )}
          {(session === "ALL" || session === "AFTERNOON") && (
            <label>
              <input
                type="radio"
                name="session"
                value="AFTERNOON"
                checked={formData.session === "AFTERNOON"}
                onChange={handleChange}
              />
              {donationAfternoonStart} - {donationAfternoonEnd}
            </label>
          )}
        </div>
      </div>

      <button type="button" onClick={onNext} className="next-step-btn">
        Tiếp theo
      </button>
    </div>
  );
}