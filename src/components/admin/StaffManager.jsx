import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContext";
import "../../assets/css/components/staff/userManager.css"; // ✅ thêm CSS nếu cần
const StaffManager = () => {
  const { getAllStaff, getStaffById, banAdminStaff } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await getAllStaff();
      if (response.success) {
        const result = response.staff || [];
        if (Array.isArray(result)) {
          const mappedStaff = result.map((staff) => ({
            ...staff,
            status: staff.status || "ACTIVE",
          }));
          setStaffList(mappedStaff);
        } else {
          setStaffList([]);
        }
      } else {
        setStaffList([]);
      }
    } catch (error) {
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffDetails = async (staffId) => {
    try {
      const response = await getStaffById(staffId);
      if (response.success) {
        setSelectedStaff({ ...response.staff, status: response.staff.status || "ACTIVE" });
      } else {
        alert(response.error);
      }
    } catch (error) {
      alert("Không thể lấy thông tin chi tiết nhân viên");
    }
  };

  const handleToggleBan = async (staffId, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
      const response = await banAdminStaff(staffId);
      if (response.success) {
        setStaffList((prevStaff) =>
          prevStaff.map((staff) =>
            staff.id === staffId ? { ...staff, status: newStatus } : staff
          )
        );
        if (selectedStaff && selectedStaff.id === staffId) {
          setSelectedStaff({ ...selectedStaff, status: newStatus });
        }
        alert(response.message);
      } else {
        alert(response.error);
      }
    } catch (error) {
      alert("Thay đổi trạng thái nhân viên thất bại");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="member-manager-container">
      <h2>Quản lý nhân viên</h2>
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
              {staffList.map((staff, index) => (
                <tr key={staff.id}>
                  <td>{index + 1}</td>
                  <td>{staff.name || "Không xác định"}</td>
                  <td>{staff.email || "Không có email"}</td>
                  <td className={staff.status === "BANNED" ? "status-banned" : "status-active"}>
                    {staff.status === "ACTIVE" ? "Hoạt động" : staff.status === "BANNED" ? "Đã ban" : "Không xác định"}
                  </td>
                  <td>
                    <span className="view-link" onClick={() => fetchStaffDetails(staff.id)}>
                      Xem chi tiết
                    </span>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={staff.status === "ACTIVE"}
                        onChange={() => handleToggleBan(staff.id, staff.status || "ACTIVE")}
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
              {staffList.length === 0 && (
                <tr>
                  <td colSpan="6">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>

          {selectedStaff && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-icon" onClick={() => setSelectedStaff(null)}>×</span>
                <h3>Thông tin chi tiết nhân viên</h3>
                <div className="detail-row">
                  <label>Họ tên</label>
                  <div className="detail-value">{selectedStaff.name || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Email</label>
                  <div className="detail-value">{selectedStaff.email || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Số CCCD</label>
                  <div className="detail-value">{selectedStaff.numberCccd || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Ngày sinh</label>
                  <div className="detail-value">{selectedStaff.dob || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Giới tính</label>
                  <div className="detail-value">{selectedStaff.gender || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Số điện thoại</label>
                  <div className="detail-value">{selectedStaff.phone || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Nghề nghiệp</label>
                  <div className="detail-value">{selectedStaff.job || "Không có"}</div>
                </div>
                <div className="detail-row">
                  <label>Trạng thái</label>
                  <div className="detail-value">{selectedStaff.status === "ACTIVE" ? "Hoạt động" : selectedStaff.status === "BANNED" ? "Đã ban" : "Không xác định"}</div>
                </div>
                <div className="modal-actions">
                  <button className="close-btn" onClick={() => setSelectedStaff(null)}>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StaffManager;