import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bloodType: '',
    birthDate: '',
    gender: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [donationStats, setDonationStats] = useState({
    totalDonations: 0,
    lastDonation: null,
    nextEligibleDate: null
  });

  useEffect(() => {
    // Simulate API call to fetch profile data
    const fetchProfile = async () => {
      setLoading(true);
      // Mock data
      const mockProfile = {
        name: user?.name || 'Nguyễn Văn A',
        email: user?.email || 'nguyenvana@email.com',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        bloodType: 'O+',
        birthDate: '1990-01-01',
        gender: 'Nam',
        emergencyContact: 'Nguyễn Thị B',
        emergencyPhone: '0987654321',
        medicalHistory: 'Không có tiền sử bệnh lí đặc biệt',
        allergies: 'Không có dị ứng'
      };

      const mockStats = {
        totalDonations: 5,
        lastDonation: '2024-04-15',
        nextEligibleDate: '2024-07-15'
      };

      setTimeout(() => {
        setProfileData(mockProfile);
        setDonationStats(mockStats);
        setLoading(false);
      }, 1000);
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      console.log('Updating profile:', profileData);
      
      setTimeout(() => {
        setIsEditing(false);
        setLoading(false);
        alert('Cập nhật thông tin thành công!');
      }, 1000);
    } catch (error) {
      setLoading(false);
      alert('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  if (loading && !profileData.name) {
    return <div className="loading">Đang tải thông tin cá nhân...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Thông Tin Cá Nhân</h1>
        <button 
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      <div className="profile-content">
        {/* Donation Statistics */}
        <div className="donation-stats-card">
          <h3>Thống Kê Hiến Máu</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Tổng số lần hiến:</span>
              <span className="stat-value">{donationStats.totalDonations}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lần hiến gần nhất:</span>
              <span className="stat-value">
                {donationStats.lastDonation 
                  ? new Date(donationStats.lastDonation).toLocaleDateString('vi-VN')
                  : 'Chưa hiến'
                }
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Có thể hiến tiếp:</span>
              <span className="stat-value">
                {donationStats.nextEligibleDate 
                  ? new Date(donationStats.nextEligibleDate).toLocaleDateString('vi-VN')
                  : 'Ngay bây giờ'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="profile-form-card">
          <h3>Thông Tin Chi Tiết</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Họ và tên:</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nhóm máu:</label>
                <select
                  name="bloodType"
                  value={profileData.bloodType}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                >
                  <option value="">Chọn nhóm máu</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ngày sinh:</label>
                <input
                  type="date"
                  name="birthDate"
                  value={profileData.birthDate}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Giới tính:</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Địa chỉ:</label>
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="2"
                  required
                />
              </div>

              <div className="form-group">
                <label>Người liên hệ khẩn cấp:</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={profileData.emergencyContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>SĐT người liên hệ khẩn cấp:</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={profileData.emergencyPhone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group full-width">
                <label>Tiền sử bệnh lý:</label>
                <textarea
                  name="medicalHistory"
                  value={profileData.medicalHistory}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Dị ứng:</label>
                <textarea
                  name="allergies"
                  value={profileData.allergies}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="2"
                />
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Hủy
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;