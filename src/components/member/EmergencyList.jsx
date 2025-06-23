import React, { useState, useEffect } from 'react';
import { authService } from "../../services/authService";
import { useAuth } from "../../services/AuthContext"; 
import '../../assets/css/member/EmergencyList.css';

const EmergencyList = () => {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      setLoading(true);
      const response = await authService.getAllEmergencies();
      setEmergencies(response.data.result);
    } catch (error) {
      console.error('Lỗi khi tải danh sách cấp cứu:', error);
    } finally {
      setLoading(false);
    }
  };

  const respondToEmergency = async (emergencyId) => {
    try {
      console.log('Phản hồi đơn khẩn cấp:', emergencyId);
      alert('Phản hồi của bạn đã được gửi! Bệnh viện sẽ liên hệ với bạn sớm.');
    } catch (error) {
      console.error('Lỗi khi phản hồi:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const getUrgencyColor = (urgency) => {
    if (!urgency) return '#6c757d';
    switch (urgency.toLowerCase()) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatLabel = (label) => {
    const mapping = {
      bloodType: "Nhóm máu",
      urgency: "Mức độ khẩn cấp",
      status: "Trạng thái",
      hospital: "Bệnh viện",
      location: "Địa điểm",
      contact: "Liên hệ",
      createdAt: "Thời gian tạo",
      description: "Mô tả",
      component: "Thành phần",
      freeday: "Ngày rảnh",
      updatedAt: "Cập nhật lúc",
      id: "Mã yêu cầu",
    };
    return mapping[label] || label;
  };

  const formatValue = (key, value) => {
    if (key === 'createdAt' || key === 'freeday' || key === 'updatedAt') {
      return new Date(value).toLocaleString('vi-VN');
    }
    return value?.toString();
  };

  const filteredEmergencies = emergencies.filter(emergency => {
    if (filter === 'all') return true;
    if (filter === 'active') return emergency.status === 'active';
    if (filter === 'fulfilled') return emergency.status === 'fulfilled';
    return emergency.bloodType === filter;
  });

  if (loading) {
    return <div className="loading">Đang tải danh sách cấp cứu...</div>;
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
                {emergency.bloodType}
              </div>
              <div
                className="urgency-badge"
                style={{ backgroundColor: getUrgencyColor(emergency.urgency) }}
              >
                {emergency.urgency}
              </div>
              <div className={`status-badge status-${emergency.status}`}>
                {emergency.status === 'active' ? 'Đang cần' : 'Đã đủ'}
              </div>
            </div>

            <div className="emergency-content">
              <h3>{emergency.hospital}</h3>
              <p className="location">{emergency.location}</p>
              <p className="description">{emergency.description}</p>

              <div className="emergency-details">
                {Object.entries(emergency)
                  .filter(([key]) =>
                    !['staffName', 'adminName', 'staff', 'admin'].includes(key)
                  )
                  .map(([key, value]) => (
                    <div className="detail-item" key={key}>
                      <strong>{formatLabel(key)}:</strong> {formatValue(key, value)}
                    </div>
                  ))}
              </div>
            </div>

            <div className="emergency-actions">
              {emergency.status === 'active' && (
                <button
                  className="respond-btn"
                  onClick={() => respondToEmergency(emergency.id)}
                >
                  Tôi có thể giúp
                </button>
              )}
              <button className="contact-btn">
                <a href={`tel:${emergency.contact}`}>Gọi ngay</a>
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
