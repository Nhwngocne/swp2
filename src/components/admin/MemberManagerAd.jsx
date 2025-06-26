import React, { useEffect, useState } from "react";
import { authService } from "../../services/authService"; // Giả sử authService đã được định nghĩa

const MemberManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách người dùng từ API
  const fetchMembers = async () => {
    try {
      const response = await authService.getAllUsers();
      console.log("GET /members response:", response.data);

      const result = response.data?.result;
      if (Array.isArray(result)) {
        // Clone và thêm trường banned nếu chưa có
        const initializedMembers = result.map((member) => ({
          ...member,
          banned: member.banned ?? false, // giả lập
        }));
        setMembers(initializedMembers);
      } else {
        console.error("Dữ liệu không đúng định dạng mảng:", result);
        setMembers([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Hàm giả lập ban/unban người dùng (chỉ thay đổi UI)
  const handleToggleBan = (memberId) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId
          ? { ...member, banned: !member.banned }
          : { ...member }
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý thành viên</h2>
      {loading ? (
        <p>Đang tải danh sách...</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member.id}>
                <td>{index + 1}</td>
                <td>{member.fullName || member.name}</td>
                <td>{member.email}</td>
                <td style={{ color: member.banned ? "red" : "green", fontWeight: "bold" }}>
                  {member.banned ? "Đã bị cấm" : "Hoạt động"}
                </td>
                <td>
                  <button onClick={() => handleToggleBan(member.id)}>
                    {member.banned ? "Gỡ cấm" : "Cấm"}
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberManager;
