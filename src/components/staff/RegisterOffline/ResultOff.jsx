import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { donationService } from "../../../services/donationService";
import { AuthContext } from "../../../services/AuthContext";
import "../../../assets/css/components/staff/ResultOff.css";

const ResultOff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    bloodType: "",
    volumeMl: "",
    result: "",
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateRegisOffline = async (id, offlineData) => {
    try {
      setLoading(true);

      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");

      const payload = {
        id: Number(id),
        bloodType: offlineData.bloodType,
        volumeMl: Number(offlineData.volumeMl),
        result: offlineData.result,
        note: offlineData.note || "",
        staffId: Number(user.id),
        status: "COMPLETED",
      };

      const response = await donationService.updateRegisOffline(id, payload);
      return {
        success: true,
        data: response.data.result,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Cập nhật thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    donationService.getRegisOfflineById(id)
      .then((res) => {
        const data = res.data;
        setFormData({
          bloodType: data.bloodType || "",
          volumeMl: data.volumeMl?.toString() || "",
          result: data.result || "",
          note: data.note || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi lấy dữ liệu đăng ký offline");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await updateRegisOffline(id, formData);

  if (res.success) {
    alert("Cập nhật kết quả thành công!");
    navigate("/registerOff"); // đổi đường dẫn ở đây
  } else {
    alert(`Lỗi: ${res.error}`);
  }
};

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="result-off">
      <h2>Cập nhật kết quả đơn đăng ký hiến máu</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nhóm máu:
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            required
          >
            <option value="">-- Nhóm máu --</option>
            <option value="O-">O-</option>
            <option value="O+">O+</option>
            <option value="A-">A-</option>
            <option value="A+">A+</option>
            <option value="B-">B-</option>
            <option value="B+">B+</option>
            <option value="AB-">AB-</option>
            <option value="AB+">AB+</option>
          </select>
        </label>

        <label>
          Dung tích máu (ml):
          <input
            type="number"
            name="volumeMl"
            value={formData.volumeMl}
            onChange={handleChange}
            required
            min={0}
          />
        </label>

        <label>
          Kết quả:
          <select
            name="result"
            value={formData.result}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn kết quả --</option>
            <option value="Đạt">Đạt</option>
            <option value="Không đạt">Không đạt</option>
          </select>
        </label>

        <label>
          Ghi chú:
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="4"
          />
        </label>

        <button type="submit" disabled={loading}>
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default ResultOff;
