import React, { useState } from 'react';
import { useEmergency } from '../../services/EmergencyContext';
import { useAuth } from '../../services/AuthContext';
import '../../assets/css/member/EmergencyList.css';

const EmergencyList = () => {
  const { user } = useAuth();
  const { emergencyRequests, loading, error, fetchEmergencyRequests } = useEmergency();
  const [filter, setFilter] = useState('all');

  const respondToEmergency = async (emergencyId) => {
    try {
      console.log('Phản hồi đơn khẩn cấp:', emergencyId);
      alert('Phản hồi của bạn đã được gửi! Bệnh viện sẽ liên hệ với bạn sớm.');
      await fetchEmergencyRequests(); // Làm mới sau khi phản hồi
    } catch (error) {
      console.error('Lỗi khi phản hồi:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const formatLabel = (label) => {
    const mapping = {
      id: "Mã yêu cầu",
      name: "Tên",
      phone: "Số điện thoại",
      location: "Địa điểm",
      component: "Thành phần",
      description: "Mô tả",
      status: "Trạng thái",
      bloodTypeName: "Nhóm máu",
      staffName: "Nhân viên",
      memberName: "Thành viên",
      adminName: "Quản trị viên",
    };
    return mapping[label] || label;
  };

  const formatValue = (key, value) => {
    if (!value) return "Không có";
    return value.toString();
  };

  const filteredEmergencies = emergencyRequests.filter(emergency => {
    if (filter === 'all') return true;
    if (filter === 'active') return emergency.status.toLowerCase() === 'pending';
    if (filter === 'fulfilled') return emergency.status.toLowerCase() === 'fulfilled';
    return emergency.bloodTypeName === filter;
  });

  if (loading) {
    return <div className="loading">Đang tải danh sách cấp cứu...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

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
        {filteredEmergencies.map(emergency => (
          <div key={emergency.id} className="emergency-card">
            <div className="emergency-header">
              <div className="blood-type-badge">
                {emergency.bloodTypeName || "Không xác định"}
              </div>
              <div className={`status-badge status-${emergency.status.toLowerCase()}`}>
                {emergency.status === 'PENDING' ? 'Đang cần' : 'Đã đủ'}
              </div>
            </div>

            <div className="emergency-content">
              <h3>{emergency.name || "Không xác định"}</h3>
              <p className="location">{emergency.location || "Không xác định"}</p>
              <p className="description">{emergency.description || "Không có mô tả"}</p>

              <div className="emergency-details">
                {Object.entries(emergency)
                  .filter(([key]) =>
                    !['staff', 'admin', 'member', 'bloodType'].includes(key)
                  )
                  .map(([key, value]) => (
                    <div className="detail-item" key={key}>
                      <strong>{formatLabel(key)}:</strong> {formatValue(key, value)}
                    </div>
                  ))}
              </div>
            </div>

            <div className="emergency-actions">
              {emergency.status.toLowerCase() === 'pending' && (
                <button
                  className="respond-btn"
                  onClick={() => respondToEmergency(emergency.id)}
                >
                  Tôi có thể giúp
                </button>
              )}
              <button className="contact-btn">
                <a href={`tel:${emergency.phone || '#'}`}>Gọi ngay</a>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmergencies.length === 0 && (
        <div className="no-data">
          <p>Không có yêu cầu cấp cứu nào phù hợp với bộ lọc.</p>
        </div>
      )}
    </div>
  );
};

export default EmergencyList;