import React, { useState, useEffect } from "react";
import { donationService } from "../../../services/donationService";
import Pagination from "../../../pages/Pagination";
import { Link } from "react-router-dom";

const BloodFormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const member = JSON.parse(localStorage.getItem("user"));
  const memberId = member?.id;

  useEffect(() => {
    if (!memberId) {
      setError("Không tìm thấy thông tin người dùng.");
      setLoading(false);
      return;
    }

    const fetchForms = async () => {
      setLoading(true);
      try {
        const response = await donationService.getDonationRegistrationsByMember(memberId);
        setForms(response.data.result || []);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải danh sách đăng ký:", err);
        setError("Không thể tải danh sách đăng ký hiến máu.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [memberId]);

  const handleApprove = async (formId) => {
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        formId: formId,
        status: 'APPROVED'
      };
      await donationService.approveOrRejectForm(updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForms(forms.map(form =>
        form.id === formId ? { ...form, status: "APPROVED" } : form
      ));
      alert("Duyệt đơn thành công!");
    } catch (error) {
      console.error("Lỗi khi duyệt đơn:", error);
      alert("Duyệt đơn thất bại!");
    }
  };

  const handleReject = async (formId) => {
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        formId: formId,
        status: 'REJECTED'
      };
      await donationService.approveOrRejectForm(updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForms(forms.map(form =>
        form.id === formId ? { ...form, status: "REJECTED" } : form
      ));
      alert("Từ chối đơn thành công!");
    } catch (error) {
      console.error("Lỗi khi từ chối đơn:", error);
      alert("Từ chối đơn thất bại!");
    }
  };

  const handleComplete = async (formId) => {
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        formId: formId,
        status: 'COMPLETED'
      };
      await donationService.approveOrRejectForm(updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForms(forms.map(form =>
        form.id === formId ? { ...form, status: "COMPLETED" } : form
      ));
      alert("Đơn đã được hoàn thành!");
    } catch (error) {
      console.error("Lỗi khi hoàn thành đơn:", error);
      alert("Hoàn thành đơn thất bại!");
    }
  };

  const totalPages = Math.ceil(forms.length / itemsPerPage);

  const renderCards = () => {
    if (loading) return <div className="card">Đang tải dữ liệu...</div>;
    if (error) return <div className="card">Lỗi: {error}</div>;
    if (forms.length === 0) return <div className="card">Không có dữ liệu hiến máu nào.</div>;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedForms = forms.slice(startIdx, endIdx);

    return paginatedForms.map((entry) => (
      <div key={entry.id} className="register-card">
        <div className="card-content">
          <h4 className="event-title">{entry.eventTitle?.trim() || "Không xác định"}</h4>
          <p><i className="fas fa-user icon-left" /> Người đăng ký: {entry.memberName || "Không rõ"}</p>
          <p><i className="fas fa-map-marker-alt icon-left" /> Địa điểm: {entry.eventLocation || "Không xác định"}</p>
          <p><i className="fas fa-calendar-day icon-left" /> Ngày: {entry.eventDate || "Chưa rõ"}</p>
          <p><i className="fas fa-info-circle icon-left" /> Trạng thái: <strong>{entry.status || "Không rõ"}</strong></p>
        </div>
        <div className="card-action">
          <Link className="detail-link" to={`/staff/formDetail/${entry.id}`}>
            <i className="fas fa-info-circle"></i> Xem chi tiết
          </Link>
        </div>

        {/* Nút xử lý theo trạng thái */}
        {entry.status === "PENDING" && (
          <div className="card-buttons">
            <button className="approve-button" onClick={() => handleApprove(entry.id)}>Duyệt</button>
            <button className="reject-button" onClick={() => handleReject(entry.id)}>Từ chối</button>
          </div>
        )}

        {entry.status === "APPROVED" && (
          <div className="card-buttons">
            <button className="complete-button" onClick={() => handleComplete(entry.id)}>Hoàn thành</button>
          </div>
        )}

        {entry.status === "COMPLETED" && (
          <div className="card-buttons">
            <Link className="result-button" to={`/resultForm/${entry.id}`}>
              kết quả
            </Link>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="history-container">
      <h2 className="history-title">DANH SÁCH TẤT CẢ ĐƠN ĐĂNG KÝ HIẾN MÁU</h2>
      <div className="register-card-list">{renderCards()}</div>
      {forms.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default BloodFormList;
