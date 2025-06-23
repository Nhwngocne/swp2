import React, { useEffect, useState, useContext } from "react";
import { authService } from "../../services/authService";
import "../../assets/css/member/RegisterHistory.css";
import { useAuth } from "../../services/AuthContext";

const RegisterHistory = () => {
  const [history, setHistory] = useState([]);
  //const { user } = useContext(AuthContext);
  const { user } = useAuth(); 
  const memberId = user?.id;

//   useEffect(() => {
//     if (memberId) {
//       authService
//         .getDonationHistoryByMemberId(memberId)
//         .then((res) => setHistory(res.data))
//         .catch((err) => console.error("Lỗi lấy lịch sử:", err));
//     }
//   }, [memberId]);

    useEffect(() => {
    // ✅ Dữ liệu giả để hiển thị tạm thời
    const fakeData = [
      {
        id: 1,
        donate_date: "2025-05-10",
        component: "Máu toàn phần",
        bloodType: { name: "O+" },
        location: "Bệnh viện Chợ Rẫy",
        regis_time: "08:00 - 10:00",
        status: "Đã xác nhận",
      },
      {
        id: 2,
        donate_date: "2025-03-22",
        component: "Tiểu cầu",
        bloodType: { name: "A-" },
        location: "Trung tâm hiến máu Quốc gia",
        regis_time: "13:00 - 15:00",
        status: "Chờ xác nhận",
      },
    ];

    // Gán dữ liệu vào state
    setHistory(fakeData);
  }, []);

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
