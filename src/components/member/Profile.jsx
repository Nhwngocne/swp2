import React, { useState, useEffect } from 'react';
import { GetInfoMemberAPI, UpdateInfoMemberAPI } from '../../services/member';
import Header from '../common/Navbar';
import Footer from '../common/Footer';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await GetInfoMemberAPI();
        setProfileData(response.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin cá nhân:", error);
        alert("Không thể tải thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await UpdateInfoMemberAPI(profileData);
      alert("Cập nhật thành công");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      alert("Đã có lỗi xảy ra khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải thông tin...</div>;
  if (!profileData) return <div className="error">Không có dữ liệu</div>;

  return (
    <>
      <Header />
      <div className="profile-container">
        <h2>Thông Tin Cá Nhân</h2>
        <button onClick={() => setIsEditing((prev) => !prev)} className="edit-button">
          {isEditing ? "Hủy" : "Chỉnh sửa"}
        </button>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Họ tên:</label>
            <input
              type="text"
              name="name"
              value={profileData.name || ''}
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
              value={profileData.email || ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={profileData.phone || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={profileData.address || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <button type="submit" className="save-button">
              Lưu
            </button>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
