import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Thêm dòng này
import { useEvents } from "../../../services/EventContext";
import { useDonation } from "../../../services/DonationContext";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { eventService } from "../../../services/eventService";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat); // chỉnh lại đường dẫn nếu cần


const BloodFormList = () => {
  const { eventId } = useParams();
  const navigate = useNavigate(); // <-- Thêm dòng này
  const { fetchForms, updateBloodDonationFormByStaff, loading, error } = useEvents();
  const { createDonationHistory } = useDonation();
  const [forms, setForms] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [historyData, setHistoryData] = useState({
    result: "Đạt",
    location: "",
    volume: "",
    bloodTypeId: "",
    bloodDonationFormId: "",
    staffId: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null,
    memberId: "",
  });

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await eventService.getBloodDonationFormsByEvent(eventId);

        // Kiểm tra nếu có trường "result" là mảng
        if (response.data && Array.isArray(response.data.result)) {
          setForms(response.data.result);
          console.log("Dữ liệu đơn:", response.data.result);

        } else {
          console.warn("Dữ liệu không đúng định dạng:", response.data);
          setForms([]); // fallback để không lỗi .map
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn:", error);
        setForms([]);
      }
    };

    fetchForms();
  }, [eventId]);



  const handleUpdateStatus = async (formId, status) => {
    try {
      const payload = {
        formId,
        status,
        approvedByStaffId: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null,
      };
      const response = await updateBloodDonationFormByStaff(payload);
      if (response.success) {
        alert(`Cập nhật trạng thái thành công: ${status}`);
        const updatedForms = await fetchForms();
        if (updatedForms.success) {
          setForms(updatedForms.forms);
        }
      } else {
        alert(`Lỗi: ${response.error}`);
      }
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái: " + error.message);
    }
  };

  // <<<<<<< HEAD
  const openResultModal = (form) => {
    setSelectedForm(form);
    setHistoryData({
      result: "Đạt",
      location: form.eventLocation || "",
      volume: form.volumeMl || "",
      bloodTypeId: "",
      bloodDonationFormId: form.id,
      staffId: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null,
      memberId: form.memberId || "",
    });
    setIsModalOpen(true);
  };

  const closeResultModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
    setHistoryData({
      result: "Đạt",
      location: "",
      volume: "",
      bloodTypeId: "",
      bloodDonationFormId: "",
      staffId: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null,
      memberId: "",
    });
  };
  const handleCheckIn = (formId) => {
    navigate(`/staff/checkin/${formId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHistoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitResult = async () => {
  try {
    // Validate input
    if (!historyData.volume || !historyData.bloodTypeId) {
      alert("Vui lòng nhập đầy đủ thể tích và nhóm máu!");
      return;
    }

    // Thêm eventId vào payload lịch sử hiến máu
    const historyPayload = {
      ...historyData,
      eventId: selectedForm?.event?.id || selectedForm?.eventId, // tùy thuộc vào dữ liệu của bạn
    };

    console.log("Gửi createDonationHistory với payload:", historyPayload);

    // Gọi API tạo lịch sử hiến máu
    const historyResponse = await createDonationHistory(historyPayload);
    if (!historyResponse.success) {
      alert(`Lỗi khi tạo lịch sử hiến máu: ${historyResponse.error}`);
      return;
    }

    // Cập nhật trạng thái form thành COMPLETED
    const payload = {
      formId: selectedForm.id,
      status: "COMPLETED",
      approvedByStaffId: historyData.staffId,
    };
    const updateResponse = await updateBloodDonationFormByStaff(payload);
    if (updateResponse.success) {
      alert("Tạo lịch sử hiến máu và cập nhật trạng thái thành công!");
      // Cập nhật danh sách forms
      const updatedForms = await fetchForms();
      if (updatedForms.success) {
        setForms(updatedForms.forms);
      }
      closeResultModal();
    } else {
      alert(`Lỗi khi cập nhật trạng thái: ${updateResponse.error}`);
    }
  } catch (error) {
    alert("Lỗi: " + error.message);
  }
};

  if (loading) {
    return <p className="text-center text-gray-500">Đang tải...</p>;
  }
  // =======
  const handleViewDetail = (form) => {
    navigate(`/staff/formDetail/${form.id}`, { state: { form } });
  };
  // >>>>>>> dabc5e927256250315640f2ba6f1226be5667656


  if (loading) return <p className="text-center text-gray-500">Đang tải...</p>;
  if (error) return <p className="text-center text-red-500">Lỗi: {error}</p>;
  if (!forms || forms.length === 0) return <p className="text-gray-500 text-center">Chưa có đơn đăng ký nào.</p>;


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý đơn đăng ký hiến máu</h2>
      <table className="min-w-full divide-y divide-gray-200 text-center">
        <thead>
          <tr>
            <th className="px-4 py-2">Họ tên</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Tiêu đề sự kiện</th>
            <th className="px-4 py-2">Địa điểm</th>
            <th className="px-4 py-2">Ngày</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.isArray(forms) && forms.map(form => (
            <tr key={form.id}>
              <td className="px-4 py-2">{form.memberName || "N/A"}</td>
              <td className="px-4 py-2">{form.memberEmail || "N/A"}</td>
              <td className="px-4 py-2">{form.eventTitle || "N/A"}</td>
              <td className="px-4 py-2">{form.eventLocation || "N/A"}</td>
              <td className="px-4 py-2">
                {dayjs(form.eventDate, "DD-MM-YYYY").isValid()
                  ? dayjs(form.eventDate, "DD-MM-YYYY").format("DD/MM/YYYY")
                  : "Invalid Date"}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${form.status === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : form.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : form.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {form.status === "APPROVED"
                    ? "Đã duyệt"
                    : form.status === "CHECKIN"
                      ? "Đã tới"
                      : form.status === "REJECTED"
                        ? "Bị từ chối"
                        : form.status === "COMPLETED"
                          ? "Hoàn thành"
                          : "Đang chờ"}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="flex justify-center gap-2 flex-wrap">
                  {form.status === "APPROVED" && (
                    <button
                      onClick={() => handleCheckIn(form.id)}
                      disabled={loading}
                      className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
                    >
                      Check-in
                    </button>
                  )}
                  {form.status === "CHECKIN" && (
                    <button
                      onClick={() => openResultModal(form)}
                      disabled={loading}
                      className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
                    >
                      Nhập kết quả
                    </button>
                  )}
                  {(form.status === "APPROVED" || form.status === "CHECKIN" || form.status === "REJECTED" || form.status === "COMPLETED") && (
                    <button
                      onClick={() => handleViewDetail(form)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Xem chi tiết
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal để nhập kết quả hiến máu */}
      {isModalOpen && (
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
                onClick={closeResultModal}
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
      )}
    </div>
  );
};

export default BloodFormList;