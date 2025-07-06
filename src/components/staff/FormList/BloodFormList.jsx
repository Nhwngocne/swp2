import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../../services/EventContext";
import { useDonation } from "../../../services/DonationContext";

const BloodFormList = () => {
  const navigate = useNavigate();
  const { fetchForms, updateBloodDonationFormByStaff, loading, error } = useEvents();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const loadForms = async () => {
      const response = await fetchForms();
      if (response.success) {
        setForms(response.forms);
      }
    };
    loadForms();
  }, [fetchForms]);

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

  const handleEnterResult = (form) => {
    navigate(`/staff/formResult/${form.id}`, { state: { form } });
  };

  const handleViewDetail = (form) => {
    navigate(`/staff/formDetail/${form.id}`, { state: { form } });
  };

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
          {forms.map((form) => (
            <tr key={form.id}>
              <td className="px-4 py-2">{form.memberName || "N/A"}</td>
              <td className="px-4 py-2">{form.memberEmail || "N/A"}</td>
              <td className="px-4 py-2">{form.eventTitle || "N/A"}</td>
              <td className="px-4 py-2">{form.eventLocation || "N/A"}</td>
              <td className="px-4 py-2">
                {form.eventDate ? new Date(form.eventDate).toLocaleDateString("vi-VN") : "N/A"}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    form.status === "APPROVED"
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
                    : form.status === "REJECTED"
                    ? "Bị từ chối"
                    : form.status === "COMPLETED"
                    ? "Hoàn thành"
                    : "Đang chờ"}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="flex flex-col items-center gap-2">
                  {form.status === "PENDING" && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(form.id, "APPROVED")}
                        disabled={loading}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                      >
                        Đồng ý
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(form.id, "REJECTED")}
                        disabled={loading}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                  {form.status === "APPROVED" && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEnterResult(form)}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                      >
                        Nhập kết quả
                      </button>
                      <button
                        onClick={() => handleViewDetail(form)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  )}
                  {(form.status === "REJECTED" || form.status === "COMPLETED") && (
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
    </div>
  );
};

export default BloodFormList;