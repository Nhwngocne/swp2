import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";
import { donationService } from "../../services/donationService";

const ResultForm = ({ form, onSuccess }) => {
  const { user } = useAuth();

  const [inputData, setInputData] = useState({
    date: "",
    volume: "",
    status: "",
    location: "",
    testResult: "",
    nextEligibleDate: "",
    staffId: "",
    bloodTypeId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Khởi tạo dữ liệu từ form khi component load hoặc form thay đổi
  useEffect(() => {
    if (form) {
      setInputData({
        date: form.eventDate ? form.eventDate.slice(0, 10) : "", // format yyyy-mm-dd
        volume: form.volumeMl || "",
        status: form.status || "PENDING",
        location: form.eventLocation || "",
        testResult: "",
        nextEligibleDate: "",
        staffId: user?.id || "",
        bloodTypeId: form.bloodTypeId || "",
      });
    }
  }, [form, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...inputData,
        memberId: form.memberId || user?.id,
      };

      const response = await donationService.createDonationHistory(payload);

      if (response.success) {
        alert("Tạo kết quả hiến máu thành công!");
        onSuccess && onSuccess(response.history);
      } else {
        setError(response.error || "Tạo kết quả thất bại");
      }
    } catch (err) {
      setError("Lỗi khi tạo kết quả");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="result-form">
      <h3>Gửi Kết Quả Hiến Máu</h3>

      <label>
        Ngày hiến máu:
        <input
          type="date"
          name="date"
          value={inputData.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Thể tích (ml):
        <input
          type="number"
          name="volume"
          value={inputData.volume}
          onChange={handleChange}
          min={1}
          required
        />
      </label>

      <label>
        Trạng thái:
        <select
          name="status"
          value={inputData.status}
          onChange={handleChange}
          required
        >
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
        </select>
      </label>

      <label>
        Địa điểm:
        <input
          type="text"
          name="location"
          value={inputData.location}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Kết quả xét nghiệm:
        <input
          type="text"
          name="testResult"
          value={inputData.testResult}
          onChange={handleChange}
          placeholder="Nhập kết quả xét nghiệm (nếu có)"
        />
      </label>

      <label>
        Ngày đủ điều kiện hiến tiếp:
        <input
          type="date"
          name="nextEligibleDate"
          value={inputData.nextEligibleDate}
          onChange={handleChange}
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi kết quả"}
      </button>

      {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default ResultForm;
