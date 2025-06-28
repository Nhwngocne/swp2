import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContext";

const MemberManager = () => {
  const { getAllUsers, getMemberById, banStaff } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  // Lấy danh sách người dùng từ API
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      if (response.success) {
        const result = response.users?.result || [];
        if (Array.isArray(result)) {
          const mappedMembers = result.map((member) => ({
            ...member,
            status: member.status || "ACTIVE",
          }));
          setMembers(mappedMembers);
          console.log("Members data:", mappedMembers); // Debug
        } else {
          console.error("Dữ liệu không đúng định dạng mảng:", result);
          setMembers([]);
        }
      } else {
        console.error("Lỗi khi lấy danh sách người dùng:", response.error);
        setMembers([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin chi tiết của thành viên theo ID
  const fetchMemberDetails = async (memberId) => {
    try {
      const response = await getMemberById(memberId); // Sử dụng getMemberById từ useAuth
      if (response.success) {
        setSelectedMember({ ...response.member, status: response.member.status || "ACTIVE" });
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin chi tiết:", error);
      alert("Không thể lấy thông tin chi tiết");
    }
  };

  // Ban/Unban thành viên
  const handleToggleBan = async (memberId, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
      const response = await banStaff(memberId);
      if (response.success) {
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === memberId ? { ...member, status: newStatus } : member
          )
        );
        alert(response.message);
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
      alert("Thay đổi trạng thái thất bại");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý thành viên (Staff)</h2>
      {loading ? (
        <p>Đang tải danh sách...</p>
      ) : (
        <>
          <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Xem thông tin chi tiết</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>{member.name || "Không xác định"}</td>
                  <td>{member.email || "Không có email"}</td>
                  <td style={{ color: member.status === "BANNED" ? "red" : "green", fontWeight: "bold" }}>
                    {member.status === "ACTIVE" ? "Hoạt động" : member.status === "BANNED" ? "Đã ban" : "Không xác định"}
                  </td>
                  <td>
                    <button
                      onClick={() => fetchMemberDetails(member.id)}
                      style={{ cursor: "pointer" }}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleBan(member.id, member.status || "ACTIVE")}
                      style={{ backgroundColor: member.status === "ACTIVE" ? "#ff4444" : "#44ff44", color: "white" }}
                    >
                      {member.status === "ACTIVE" ? "Cấm" : "Gỡ cấm"}
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Modal hoặc popup hiển thị thông tin chi tiết */}
          {selectedMember && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                border: "1px solid #ccc",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                zIndex: 1000,
              }}
            >
              <h3>Thông tin chi tiết thành viên ID: {selectedMember.id}</h3>
              <p><strong>Họ tên:</strong> {selectedMember.name || "Không xác định"}</p>
              <p><strong>Email:</strong> {selectedMember.email || "Không có email"}</p>
              <p><strong>Số CCCD:</strong> {selectedMember.numberCccd || "Không có"}</p>
              <p><strong>Ngày sinh:</strong> {selectedMember.dob || "Không có"}</p>
              <p><strong>Giới tính:</strong> {selectedMember.gender || "Không có"}</p>
              <p><strong>Địa chỉ liên hệ:</strong> {selectedMember.address || "Không có"}</p>
              <p><strong>Số điện thoại:</strong> {selectedMember.phone || "Không có"}</p>
              <p><strong>Nghề nghiệp:</strong> {selectedMember.job || "Không có"}</p>
              <p><strong>Trạng thái:</strong> {selectedMember.status === "ACTIVE" ? "Hoạt động" : selectedMember.status === "BANNED" ? "Đã ban" : "Không xác định"}</p>
              <button
                onClick={() => setSelectedMember(null)}
                style={{ marginTop: "10px", backgroundColor: "#ff4444", color: "white" }}
              >
                Đóng
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemberManager;