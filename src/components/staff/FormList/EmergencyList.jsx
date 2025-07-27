import React, { useState } from 'react';
import { useEmergency } from '../../../services/EmergencyContext';
import { useAuth } from '../../../services/AuthContext';
import "../../../assets/css/components/staff/EmergencyList.css";
import { emergencyService } from '../../../services/emergencyService';

const EmergencyList = () => {
  const { user } = useAuth();
  const { emergencyRequests, loading, error, fetchEmergencyRequests } = useEmergency();
  const [filter, setFilter] = useState('all');

  const handleRejectEmergency = async (emergencyId) => {
    try {
      if (!window.confirm(`Bạn có chắc chắn muốn từ chối (xoá) yêu cầu #${emergencyId} không?`)) {
        return;
      }
      await emergencyService.deleteEmergencyRequest(emergencyId);
      alert(`Đã từ chối (xoá) yêu cầu #${emergencyId}`);
      await fetchEmergencyRequests();
    } catch (error) {
      console.error('Lỗi khi xoá yêu cầu:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };
  const handleContactEmergency = async (emergencyId, emergency) => {
    try {
      if (!window.confirm(`Bạn có muốn liên hệ với người này không?`)) {
        return;
      }
      const payload = {
        status: "CONTACTED",
        location: emergency.location || "",
        name: emergency.name || "",
        memberId: emergency.memberId || 0, // Giả sử memberId có sẵn hoặc mặc định
        component: emergency.component || "",
        phone: emergency.phone || "",
        description: emergency.description || ""
      };
      await emergencyService.updateEmergencyRequest(emergencyId, payload);
      alert(`Đã liên hệ thành công.`);
      await fetchEmergencyRequests(); // Làm mới danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái liên hệ:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Không có";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        const [year, month, day] = date.split('-');
        const parsedDate = new Date(year, month - 1, day);
        if (isNaN(parsedDate.getTime())) return "Không hợp lệ";
        return parsedDate.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).split('/').join('-');
      }
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).split('/').join('-');
    } catch (error) {
      return "Không hợp lệ";
    }
  };

  const filteredEmergencies = emergencyRequests.filter(em => {
    if (filter === 'all') return true;
    if (filter === 'active') return em.status?.toLowerCase() === 'pending';
    if (filter === 'fulfilled') return em.status?.toLowerCase() === 'fulfilled';
    return em.bloodTypeName === filter;
  });

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div className="emergency-list">
      <div className="page-header">
        <h1>Danh Sách Cấp Cứu</h1>
        <p>Hãy giúp đỡ những người cần máu gấp</p>
      </div>

      <div className="filters">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang cần</option>
          <option value="fulfilled">Đã đủ</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>

      <div className="emergency-grid">
        {filteredEmergencies.map(em => (
          <div className="emergency-card" key={em.id}>
            <div className="emergency-header">
              <div className="blood-type-badge">{em.component || "?"}</div>
              <div className={`status-badge status-${em.status?.toLowerCase()}`}>
                {em.status === 'PENDING' ? 'Đang chờ' : em.status === "CONTACTED" ? "Đã liên hệ" : "Đã đủ"}
              </div>
            </div>

            <div className="emergency-content">
              <h3>{em.name || "Không rõ tên"}</h3>
              <p className="location">Địa điểm: {em.location || "Không rõ"}</p>
              <p className="description">Mô tả: {em.description || "Không có"}</p>

              <div className="emergency-details">
                <p><strong>Mã yêu cầu:</strong> {em.id}</p>
                <p><strong>Ngày tạo:</strong> {formatDate(em.createdAt)}</p>
                <p><strong>Số điện thoại:</strong> {em.phone || "Không có"}</p>
                <p><strong>Thành viên yêu cầu:</strong> {em.memberName || "Không rõ"}</p>
              </div>
            </div>

            <div className="emergency-actions">
            
              <button
                className="contact-btn"
                onClick={() => handleContactEmergency(em.id,em)}
                disabled={em.status !== "PENDING"}
              >Gọi ngay
              </button>
            </div>
          </div>
        ))}
      </div>

      {
        filteredEmergencies.length === 0 && (
          <div className="no-data">Không có yêu cầu cấp cứu phù hợp.</div>
        )
      }
    </div >
  );
};

export default EmergencyList;
