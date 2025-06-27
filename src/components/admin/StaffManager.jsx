import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContext";

const StaffManager = () => {
  const { getAllStaff, getStaffById, banAdminStaff } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Lấy danh sách nhân viên từ API
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await getAllStaff();
      if (response.success) {
        const result = response.staff || [];
        if (Array.isArray(result)) {
          const mappedStaff = result.map(staff => ({
            ...staff,
            status: staff.status || "ACTIVE"
          }));
          setStaffList(mappedStaff);
          console.log("Staff data:", mappedStaff); // Debug
        } else {
          console.error("Dữ liệu không đúng định dạng mảng:", result);
          setStaffList([]);
        }
      } else {
        console.error("Lỗi khi lấy danh sách nhân viên:", response.error);
        setStaffList([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin chi tiết của nhân viên theo ID
  const fetchStaffDetails = async (staffId) => {
    try {
      const response = await getStaffById(staffId);
      if (response.success) {
        setSelectedStaff({ ...response.staff, status: response.staff.status || "ACTIVE" });
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin chi tiết nhân viên:", error);
      alert("Không thể lấy thông tin chi tiết nhân viên");
    }
  };

  // Cấm/Gỡ cấm nhân viên
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
      console.error("Lỗi khi thay đổi trạng thái nhân viên:", error);
      alert("Thay đổi trạng thái nhân viên thất bại");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý nhân viên</h2>
      {loading ? (
        <p>Đang tải danh sách...</p>
      ) : (
        <>
          <table
            border="1"
            cellPadding="10"
            cellSpacing="0"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
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
                  <td
                    style={{
                      color: staff.status === "BANNED" ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {staff.status === "ACTIVE"
                      ? "Hoạt động"
                      : staff.status === "BANNED"
                      ? "Đã ban"
                      : "Không xác định"}
                  </td>
                  <td>
                    <button
                      onClick={() => fetchStaffDetails(staff.id)}
                      style={{ cursor: "pointer" }}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleBan(staff.id, staff.status || "ACTIVE")}
                      style={{
                        backgroundColor: staff.status === "ACTIVE" ? "#ff4444" : "#44ff44",
                        color: "white",
                      }}
                    >
                      {staff.status === "ACTIVE" ? "Cấm" : "Gỡ cấm"}
                    </button>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Modal hiển thị thông tin chi tiết */}
          {selectedStaff && (
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
              <h3>Thông tin chi tiết nhân viên ID: {selectedStaff.id}</h3>
              <p><strong>Họ tên:</strong> {selectedStaff.name || "Không xác định"}</p>
              <p><strong>Email:</strong> {selectedStaff.email || "Không có email"}</p>
              <p><strong>Số CCCD:</strong> {selectedStaff.numberCccd || "Không có"}</p>
              <p><strong>Ngày sinh:</strong> {selectedStaff.dob || "Không có"}</p>
              <p><strong>Giới tính:</strong> {selectedStaff.gender || "Không có"}</p>

              <p><strong>Số điện thoại:</strong> {selectedStaff.phone || "Không có"}</p>
              <p><strong>Nghề nghiệp:</strong> {selectedStaff.job || "Không có"}</p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {selectedStaff.status === "ACTIVE"
                  ? "Hoạt động"
                  : selectedStaff.status === "BANNED"
                  ? "Đã ban"
                  : "Không xác định"}
              </p>
              <button
                onClick={() => setSelectedStaff(null)}
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

export default StaffManager;