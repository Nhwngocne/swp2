import React, { useEffect, useMemo, useRef } from "react";
import { useEvents } from "../../services/EventContext"; // Đảm bảo đường dẫn đúng
import { useAuth } from "../../services/AuthContext";
import "../../assets/css/member/RegisterHistory.css";

const RegisterHistory = () => {
  const { user } = useAuth();
  const { forms, loading, error, getFormsByMember } = useEvents();
  const memberId = useMemo(() => user?.id, [user]);
  const hasFetchedRef = useRef(false);
  const isMountedRef = useRef(true); // Thêm useRef để theo dõi trạng thái mount

  useEffect(() => {
    console.log("useEffect chạy, memberId:", memberId, "hasFetched:", hasFetchedRef.current);
    if (memberId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getFormsByMember(memberId)
        .then(() => {
          if (isMountedRef.current) {
            console.log("API getFormsByMember hoàn tất, memberId:", memberId);
          }
        })
        .catch((err) => {
          if (isMountedRef.current) {
            console.error("Lỗi gọi getFormsByMember:", err);
          }
        })
        .finally(() => {
          if (isMountedRef.current) {
            hasFetchedRef.current = false; // Reset chỉ khi component còn mounted
          }
        });
      return () => {
        isMountedRef.current = false; // Đánh dấu component đã unmount
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

  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6">Đang tải dữ liệu...</td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="6">{error}</td>
        </tr>
      );
    }

    if (forms.length === 0) {
      return (
        <tr>
          <td colSpan="6">Không có dữ liệu hiến máu nào.</td>
        </tr>
      );
    }

    return forms.map((entry) => (
      <tr key={entry.id}>
        <td>{entry.eventDate}</td>
        <td>{entry.eventTitle?.trim() || "Không xác định"}</td>
        <td>{entry.bloodType || "Không rõ"}</td>
        <td>{entry.eventLocation?.trim() || "Không xác định"}</td>
        <td>{entry.approvedDate || "Chưa xác định"}</td>
        <td>
          <span
            className={`status ${
              entry.status === "Đã xác nhận" ? "confirmed" : "pending"
            }`}
          >
            {entry.status}
          </span>
        </td>
      </tr>
    ));
  };

  return (
    <div className="history-container">
      <h2 className="history-title">LỊCH SỬ ĐĂNG KÝ HIẾN MÁU</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Ngày đăng ký</th>
            <th>Tên sự kiện</th>
            <th>Nhóm máu</th>
            <th>Địa điểm</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
};

export default RegisterHistory;