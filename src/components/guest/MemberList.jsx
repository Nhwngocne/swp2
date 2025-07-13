import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { eventService } from "../../services/eventService";

const MemberList = () => {
  const { id } = useParams(); // Lấy ID sự kiện từ URL
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchMembers = async () => {
    try {
      const res = await eventService.getBloodDonationFormsByEvent(id);
      setMembers(res.data.result.filter((item) => item.status === "APPROVED"));
 // 🟡 Lưu ý: có thể phải dùng .result nếu bạn dùng ApiResponse wrapper
    } catch (err) {
      console.error("❌ Lỗi khi gọi API:", err);
      setError("Không thể tải danh sách người đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchMembers();
  }
}, [id]);


  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
  <div style={{ padding: "20px" }}>
    <h2>Danh sách người đăng ký</h2>

    {members.length === 0 ? (
      <pre>{JSON.stringify(members, null, 2)}</pre> // Hiển thị dữ liệu thô nếu không có ai đăng ký
    ) : (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>STT</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Họ tên</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.id}>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{index + 1}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{member.memberName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

};

export default MemberList;
