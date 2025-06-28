import React, { useState, useEffect } from "react";
import { donationService } from "../../services/donationService";
import "../../assets/css/member/RegisterHistory.css";
import Pagination from "../../pages/Pagination";
import { Link } from "react-router-dom";

const RegisterHistory = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    let isMounted = true;

    const fetchForms = async () => {
      setLoading(true);
      try {
        const response = await donationService.getAllForms();
        if (isMounted) {
          setForms(response.data.result || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Lỗi gọi API getAllForms:", err);
          setError("Không thể tải dữ liệu form hiến máu.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchForms();

    return () => {
      isMounted = false;
    };
  }, []);

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
          <h4 className="event-title">{entry.event?.title?.trim() || "Không xác định"}</h4>
          <p><i className="fas fa-map-marker-alt icon-left" /> Địa điểm: {entry.event?.location || "Không xác định"}</p>
          <p><i className="fas fa-calendar-day icon-left" /> Ngày: {entry.event?.date || "Chưa rõ"}</p>
        </div>
        <div className="card-action">
          <Link className="detail-link" to={`/formDetail/${entry.id}`}>
            <i className="fas fa-info-circle"></i> Xem chi tiết
          </Link>
        </div>
      </div>
    ));
  };

  return (
    <div className="history-container">
      <h2 className="history-title">LỊCH SỬ ĐĂNG KÝ HIẾN MÁU</h2>
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

export default RegisterHistory;
