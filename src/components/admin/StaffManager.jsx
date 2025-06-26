import React, { useEffect, useState } from "react";
import { authService } from "../../services/authService"; // Giả sử authService đã được định nghĩa

const StaffManager = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      const response = await authService.getAllUsers();
      console.log("GET /members response:", response.data);

      const result = response.data?.result;
      if (Array.isArray(result)) {
        // Lọc những người có role là "staff"
        const staffs = result
          .filter((member) => member.role === "staff")
          .map((member) => ({
            ...member,
            banned: member.banned ?? false, // giả lập
          }));
        setStaffList(staffs);
      } else {
        console.error("Dữ liệu không đúng định dạng mảng:", result);
        setStaffList([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách staff:", error);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleToggleBan = (staffId) => {
    setStaffList((prevStaff) =>
      prevStaff.map((staff) =>
        staff.id === staffId ? { ...staff, banned: !staff.banned } : staff
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý nhân viên (Staff)</h2>
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
            {staffList.map((staff, index) => (
              <tr key={staff.id}>
                <td>{index + 1}</td>
                <td>{staff.fullName || staff.name}</td>
                <td>{staff.email}</td>
                <td style={{ color: staff.banned ? "red" : "green", fontWeight: "bold" }}>
                  {staff.banned ? "Đã bị cấm" : "Hoạt động"}
                </td>
                <td>
                  <button onClick={() => handleToggleBan(staff.id)}>
                    {staff.banned ? "Gỡ cấm" : "Cấm"}
                  </button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>Không có nhân viên nào</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffManager;
