import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MemberManager = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBloodType, setFilterBloodType] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockMembers = [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          phone: '0901234567',
          bloodType: 'O+',
          dateOfBirth: '1990-05-15',
          address: '123 Lê Lợi, Quận 1, TP.HCM',
          emergencyContact: '0987654321',
          status: 'active',
          joinDate: '2023-01-15',
          lastDonation: '2024-02-20',
          totalDonations: 8,
          eligibleDate: '2024-05-20',
          healthStatus: 'good',
          notes: 'Người hiến tích cực, luôn tham gia các hoạt động'
        },
        {
          id: 2,
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          phone: '0912345678',
          bloodType: 'A-',
          dateOfBirth: '1988-12-03',
          address: '456 Nguyễn Huệ, Quận 3, TP.HCM',
          emergencyContact: '0976543210',
          status: 'active',
          joinDate: '2023-03-20',
          lastDonation: '2024-03-10',
          totalDonations: 12,
          eligibleDate: '2024-06-10',
          healthStatus: 'good',
          notes: ''
        },
        {
          id: 3,
          name: 'Lê Văn C',
          email: 'levanc@email.com',
          phone: '0923456789',
          bloodType: 'B+',
          dateOfBirth: '1995-08-22',
          address: '789 Trần Hưng Đạo, Quận 5, TP.HCM',
          emergencyContact: '0965432109',
          status: 'suspended',
          joinDate: '2023-06-10',
          lastDonation: '2023-12-15',
          totalDonations: 3,
          eligibleDate: '2024-03-15',
          healthStatus: 'temporary_deferral',
          notes: 'Tạm hoãn hiến máu do vấn đề sức khỏe nhỏ'
        }
      ];
      setMembers(mockMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setShowDetails(true);
  };

  const handleUpdateStatus = async (memberId, newStatus) => {
    try {
      const updatedMembers = members.map(member =>
        member.id === memberId
          ? { ...member, status: newStatus }
          : member
      );
      setMembers(updatedMembers);
      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Error updating member status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const handleUpdateNotes = async (memberId, notes) => {
    try {
      const updatedMembers = members.map(member =>
        member.id === memberId
          ? { ...member, notes: notes }
          : member
      );
      setMembers(updatedMembers);
      setSelectedMember(prev => ({ ...prev, notes }));
      alert('Cập nhật ghi chú thành công!');
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Có lỗi xảy ra khi cập nhật ghi chú.');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesBloodType = filterBloodType === 'all' || member.bloodType === filterBloodType;
    
    return matchesSearch && matchesStatus && matchesBloodType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'suspended': return '#dc3545';
      case 'inactive': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getHealthStatusText = (status) => {
    switch (status) {
      case 'good': return 'Tốt';
      case 'temporary_deferral': return 'Tạm hoãn';
      case 'permanent_deferral': return 'Hoãn vĩnh viễn';
      default: return 'Chưa xác định';
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const isEligibleToDonate = (member) => {
    const eligibleDate = new Date(member.eligibleDate);
    const today = new Date();
    return today >= eligibleDate && member.status === 'active' && member.healthStatus === 'good';
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách thành viên...</div>;
  }

  return (
    <div className="member-manager">
      <div className="page-header">
        <h1>Quản Lý Thành Viên</h1>
        <div className="stats-summary">
          <span>Tổng: {members.length}</span>
          <span>Hoạt động: {members.filter(m => m.status === 'active').length}</span>
          <span>Có thể hiến: {members.filter(m => isEligibleToDonate(m)).length}</span>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="suspended">Tạm dừng</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          <select
            value={filterBloodType}
            onChange={(e) => setFilterBloodType(e.target.value)}
          >
            <option value="all">Tất cả nhóm máu</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="members-table">
        <table>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Nhóm máu</th>
              <th>Số điện thoại</th>
              <th>Lần hiến cuối</th>
              <th>Tổng lần hiến</th>
              <th>Trạng thái</th>
              <th>Có thể hiến</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => (
              <tr key={member.id}>
                <td>
                  <div className="member-info">
                    <div className="name">{member.name}</div>
                    <div className="email">{member.email}</div>
                  </div>
                </td>
                <td>
                  <span className="blood-type-badge">{member.bloodType}</span>
                </td>
                <td>{member.phone}</td>
                <td>{member.lastDonation ? new Date(member.lastDonation).toLocaleDateString('vi-VN') : 'Chưa hiến'}</td>
                <td>{member.totalDonations}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(member.status) }}
                  >
                    {member.status === 'active' ? 'Hoạt động' :
                     member.status === 'suspended' ? 'Tạm dừng' : 'Không hoạt động'}
                  </span>
                </td>
                <td>
                  <span className={`eligible-badge ${isEligibleToDonate(member) ? 'yes' : 'no'}`}>
                    {isEligibleToDonate(member) ? 'Có' : 'Không'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button onClick={() => handleViewDetails(member)}>Chi tiết</button>
                    <select
                      value={member.status}
                      onChange={(e) => handleUpdateStatus(member.id, e.target.value)}
                    >
                      <option value="active">Hoạt động</option>
                      <option value="suspended">Tạm dừng</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMembers.length === 0 && (
        <div className="no-data">
          <p>Không tìm thấy thành viên nào phù hợp với bộ lọc.</p>
        </div>
      )}

      {/* Member Details Modal */}
      {showDetails && selectedMember && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>Chi Tiết Thành Viên</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
            </div>

            <div className="member-details">
              <div className="details-grid">
                <div className="detail-section">
                  <h3>Thông Tin Cá Nhân</h3>
                  <div className="detail-item">
                    <label>Họ tên:</label>
                    <span>{selectedMember.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedMember.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Số điện thoại:</label>
                    <span>{selectedMember.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày sinh:</label>
                    <span>{new Date(selectedMember.dateOfBirth).toLocaleDateString('vi-VN')} ({calculateAge(selectedMember.dateOfBirth)} tuổi)</span>
                  </div>
                  <div className="detail-item">
                    <label>Địa chỉ:</label>
                    <span>{selectedMember.address}</span>
                  </div>
                  <div className="detail-item">
                    <label>Liên hệ khẩn cấp:</label>
                    <span>{selectedMember.emergencyContact}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Thông Tin Y Tế</h3>
                  <div className="detail-item">
                    <label>Nhóm máu:</label>
                    <span className="blood-type-badge">{selectedMember.bloodType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tình trạng sức khỏe:</label>
                    <span>{getHealthStatusText(selectedMember.healthStatus)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày có thể hiến tiếp:</label>
                    <span>{new Date(selectedMember.eligibleDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Lịch Sử Hiến Máu</h3>
                  <div className="detail-item">
                    <label>Ngày tham gia:</label>
                    <span>{new Date(selectedMember.joinDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Lần hiến cuối:</label>
                    <span>{selectedMember.lastDonation ? new Date(selectedMember.lastDonation).toLocaleDateString('vi-VN') : 'Chưa hiến'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tổng số lần hiến:</label>
                    <span>{selectedMember.totalDonations} lần</span>
                  </div>
                  <div className="detail-item">
                    <label>Trạng thái:</label>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedMember.status) }}
                    >
                      {selectedMember.status === 'active' ? 'Hoạt động' :
                       selectedMember.status === 'suspended' ? 'Tạm dừng' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="notes-section">
                <h3>Ghi Chú</h3>
                <textarea
                  value={selectedMember.notes}
                  onChange={(e) => setSelectedMember(prev => ({ ...prev, notes: e.target.value }))}
                  rows="4"
                  placeholder="Thêm ghi chú về thành viên..."
                />
                <button 
                  onClick={() => handleUpdateNotes(selectedMember.id, selectedMember.notes)}
                  className="save-notes-btn"
                >
                  Lưu Ghi Chú
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManager;