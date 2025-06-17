import React, { useState, useEffect } from 'react';

const MemberManager = () => {
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
      {/* ... giữ nguyên UI phần header, bộ lọc, bảng và modal */}
      {/* Để tiết kiệm không gian, phần này giống 100% với code bạn đã gửi nên không lặp lại */}
      {/* Nếu bạn cần mình xuất ra lại phần đó hoặc chia thành file riêng (ví dụ: ModalDetails.jsx), mình có thể làm giúp */}
    </div>
  );
};

export default MemberManager;
