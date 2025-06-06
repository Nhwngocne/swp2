import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

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
      // Mock data - replace with actual API call
      const mockEmergencies = [
        {
          id: 1,
          bloodType: 'O-',
          urgency: 'Critical',
          hospital: 'Bệnh viện Chợ Rẫy',
          location: 'TP.HCM',
          contact: '0901234567',
          description: 'Cần gấp máu O- cho ca phẫu thuật khẩn cấp',
          createdAt: '2024-03-15T10:30:00Z',
          status: 'active'
        },
        {
          id: 2,
          bloodType: 'A+',
          urgency: 'High',
          hospital: 'Bệnh viện Bạch Mai',
          location: 'Hà Nội',
          contact: '0987654321',
          description: 'Bệnh nhân tai nạn giao thông cần máu A+',
          createdAt: '2024-03-15T08:15:00Z',
          status: 'active'
        },
        {
          id: 3,
          bloodType: 'B+',
          urgency: 'Medium',
          hospital: 'Bệnh viện Đa khoa Đồng Nai',
          location: 'Đồng Nai',
          contact: '0912345678',
          description: 'Cần máu B+ cho bệnh nhân ung thư',
          createdAt: '2024-03-14T16:45:00Z',
          status: 'fulfilled'
        }
      ];
      setEmergencies(mockEmergencies);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const respondToEmergency = async (emergencyId) => {
    try {
      // Mock API call
      console.log('Responding to emergency:', emergencyId);
      alert('Phản hồi của bạn đã được gửi! Bệnh viện sẽ liên hệ với bạn sớm.');
    } catch (error) {
      console.error('Error responding to emergency:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
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
                <div className="detail-item">
                  <strong>Liên hệ:</strong> {emergency.contact}
                </div>
                <div className="detail-item">
                  <strong>Thời gian:</strong> {new Date(emergency.createdAt).toLocaleString('vi-VN')}
                </div>
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