import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDonation } from "../../services/DonationContext";
import { useEvents } from "../../services/EventContext";

const BloodResultModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { form } = location.state || {};
  const { createDonationHistory } = useDonation();
  const { updateBloodDonationFormByStaff, fetchForms } = useEvents();
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState({
    result: "Đạt",
    location: form?.eventLocation || "",
    volume: "",
    bloodTypeId: "",
    bloodDonationFormId: form?.id || "",
    staffId: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null,
    memberId: form?.memberId || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHistoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitResult = async () => {
    try {
      setLoading(true);
      if (!historyData.volume || !historyData.bloodTypeId) {
        alert("Vui lòng nhập đầy đủ thể tích và nhóm máu!");
        return;
      }

      const historyResponse = await createDonationHistory(historyData);
      if (!historyResponse.success) {
        alert(`Lỗi khi tạo lịch sử hiến máu: ${historyResponse.error}`);
        return;
      }

      const payload = {
        formId: form.id,
        status: "COMPLETED",
        approvedByStaffId: historyData.staffId,
      };
      const updateResponse = await updateBloodDonationFormByStaff(payload);
      if (updateResponse.success) {
        alert("Tạo lịch sử hiến máu và cập nhật trạng thái thành công!");
        const updatedForms = await fetchForms();
        navigate("/staff/forms"); // Điều hướng về trang danh sách
      } else {
        alert(`Lỗi khi cập nhật trạng thái: ${updateResponse.error}`);
      }
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/staff/forms"); // Điều hướng về trang danh sách
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Nhập kết quả hiến máu</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Kết quả</label>
          <select
            name="result"
            value={historyData.result}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Đạt">Đạt</option>
            <option value="Không đạt">Không đạt</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
          <input
            type="text"
            name="location"
            value={historyData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập địa điểm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Thể tích (ml)</label>
          <input
            type="number"
            name="volume"
            value={historyData.volume}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập thể tích (ml)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">ID Nhóm máu</label>
          <select
            name="bloodTypeId"
            value={historyData.bloodTypeId}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Nhóm máu --</option>
            <option value="6">O-</option>
            <option value="7">O+</option>
            <option value="8">A-</option>
            <option value="9">A+</option>
            <option value="10">B-</option>
            <option value="11">B+</option>
            <option value="12">AB-</option>
            <option value="13">AB+</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmitResult}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};

export default BloodResultModal;