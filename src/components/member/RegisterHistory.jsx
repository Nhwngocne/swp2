import React, { useEffect, useState, useContext } from "react";
import { authService } from "../../services/authService";
import "../../assets/css/member/RegisterHistory.css";
import { useAuth } from "../../services/AuthContext";

const RegisterHistory = () => {
  const [history, setHistory] = useState([]);
  const { user } = useAuth(); // Lấy user từ AuthContext
  const memberId = user?.id;

  useEffect(() => {
  if (memberId) {
    authService
      .getAllDonationForms()
      .then((res) => {
        // Lọc theo memberId
        const allForms = res.data.result || []; // lấy từ `ApiResponse`
        const filtered = allForms.filter((form) => form.member.id === memberId);
        setHistory(filtered);
      })
      .catch((err) => {
        console.error("Lỗi lấy lịch sử:", err);
      });
  }
}, [memberId]);

  const renderRows = () => {
    if (history.length === 0) {
      return (
        <tr>
          <td colSpan="6">Không có dữ liệu hiến máu nào.</td>
        </tr>
      );
    }

    return history.map((entry) => (
      <tr key={entry.id}>
        <td>{entry.donate_date}</td>
        <td>{entry.component}</td>
        <td>{entry.bloodType?.name || "Không rõ"}</td>
        <td>{entry.location}</td>
        <td>{entry.regis_time}</td>
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
            <th>Thành phần</th>
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
