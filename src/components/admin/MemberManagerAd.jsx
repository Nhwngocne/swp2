import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContext";
import "../../assets/css/components/staff/userManager.css"; // ✅ thêm CSS nếu cần
const MemberManager = () => {
  const { getAllUsers, getMemberById, banAdminMember } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

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
        } else {
          setMembers([]);
        }
      } else {
        setMembers([]);
      }
    } catch (error) {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberDetails = async (memberId) => {
    try {
      const response = await getMemberById(memberId);
      if (response.success) {
        setSelectedMember({ ...response.member, status: response.member.status || "ACTIVE" });
      } else {
        alert(response.error);
      }
    } catch (error) {
      alert("Không thể lấy thông tin chi tiết");
    }
  };

  const handleToggleBan = async (memberId, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
      const response = await banAdminMember(memberId);
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
      alert("Thay đổi trạng thái thất bại");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="member-manager-container">
      <h2>Quản lý thành viên</h2>
      {loading ? (
        <p>Đang tải danh sách...</p>
      ) : (
        <>
          <table className="member-table">
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
                  <td className={member.status === "BANNED" ? "status-banned" : "status-active"}>
                    {member.status === "ACTIVE" ? "Hoạt động" : member.status === "BANNED" ? "Đã ban" : "Không xác định"}
                  </td>
                  <td>
                    <span className="view-link" onClick={() => fetchMemberDetails(member.id)}>
                      Xem chi tiết
                    </span>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={member.status === "ACTIVE"}
                        onChange={() => handleToggleBan(member.id, member.status || "ACTIVE")}
                      />
                      <div className="slider"></div>
                      <div className="slider-card">
                        <div className="slider-card-face slider-card-front"></div>
                        <div className="slider-card-face slider-card-back"></div>
                      </div>
                    </label>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan="6">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>

          {selectedMember && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-icon" onClick={() => setSelectedMember(null)}>×</span>
                <h3>Thông tin chi tiết thành viên</h3>
                <div className="detail-row">
                  <label>Họ tên</label>
                  <div className="detail-value">{selectedMember.name || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Email</label>
                  <div className="detail-value">{selectedMember.email || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Số CCCD</label>
                  <div className="detail-value">{selectedMember.numberCccd || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Ngày sinh</label>
                  <div className="detail-value">{selectedMember.dob || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Giới tính</label>
                  <div className="detail-value">{selectedMember.gender || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Địa chỉ liên hệ</label>
                  <div className="detail-value">{selectedMember.address || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Số điện thoại</label>
                  <div className="detail-value">{selectedMember.phone || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Nghề nghiệp</label>
                  <div className="detail-value">{selectedMember.job || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Trạng thái</label>
                  <div className="detail-value">{selectedMember.status === "ACTIVE" ? "Hoạt động" : selectedMember.status === "BANNED" ? "Đã ban" : "Không xác định"}</div>
                </div>
              
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemberManager;