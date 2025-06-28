import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEvents } from "../../services/EventContext";
import { useAuth } from "../../services/AuthContext";
import "../../assets/css/member/RegisterHistory.css";
import Pagination from "../../pages/Pagination";

const RegisterHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { user } = useAuth();
  const { forms, loading, error, getFormsByMember } = useEvents();
  const memberId = useMemo(() => user?.id, [user]);
  const hasFetchedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (memberId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getFormsByMember(memberId)
        .catch((err) => {
          if (isMountedRef.current) console.error("Lỗi gọi API:", err);
        })
        .finally(() => {
          if (isMountedRef.current) hasFetchedRef.current = false;
        });

      return () => {
        isMountedRef.current = false;
      };
    }
  }, [memberId, getFormsByMember]);

  if (!memberId) {
    return (
      <div className="history-container">
        <h2 className="history-title">LỊCH SỬ ĐĂNG KÝ HIẾN MÁU</h2>
        <p>Vui lòng đăng nhập để xem lịch sử đăng ký.</p>
      </div>
    );
  }

const renderCards = () => {
  if (loading) {
    return <div className="card">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="card">Lỗi: {error}</div>;
  }

  if (forms.length === 0) {
    return <div className="card">Không có dữ liệu hiến máu nào.</div>;
  }

  // ⬇️ Phân trang
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedForms = forms.slice(startIdx, endIdx);

  return paginatedForms.map((entry) => (
    <div key={entry.id} className="register-card">
      {/* Giữ nguyên nội dung */}
      <div className="card-icon"><i className="fas fa-tint"></i></div>
      <div className="card-content">
        <h4 className="event-title">{entry.eventTitle?.trim() || "Không xác định"}</h4>
        <p><i className="fas fa-map-marker-alt icon-left" />{entry.eventLocation?.trim() || "Không xác định"}</p>
        <p><i className="fas fa-clock icon-left" />{entry.approvedDate || "Chưa xác định"}</p>
      </div>
      <div className="card-status">
        <span className={`status-tag ${entry.status === "Đã xác nhận" ? "confirmed" : entry.status === "Đã xoá" ? "deleted" : "pending"}`}>
          {entry.status}
        </span>
        {entry.status !== "Đã xoá" && (
          <a className="detail-link" href={`/chi-tiet-dang-ky/${entry.id}`}>
            <i className="fas fa-file-alt"></i> Xem chi tiết
          </a>
        )}
      </div>
    </div>
  ));
};


  return (
    <div className="history-container">
      <h2 className="history-title">LỊCH SỬ ĐĂNG KÝ HIẾN MÁU</h2>
      <div className="register-card-list">{renderCards()}</div>
      <Pagination
  currentPage={currentPage}
  totalItems={forms.length}
  itemsPerPage={itemsPerPage}
  onPageChange={(page) => setCurrentPage(page)}
/>
    </div>
  );
};

export default RegisterHistory;
