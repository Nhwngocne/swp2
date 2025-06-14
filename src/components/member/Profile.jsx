import React, { useState, useEffect } from 'react';
import { useAuth } from "../../services/AuthContext";
import { authService } from "../../services/authService";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getProfile();
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
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await updateProfile(profileData);
      if (result.success) {
        alert("Cập nhật thành công");
        setIsEditing(false);
      } else {
        alert("Cập nhật thất bại: " + result.error);
      }
    } catch (err) {
      alert("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profileData) return <div>Đang tải...</div>;

  return (
    <div className="profile-container">
      <h2>Thông Tin Cá Nhân</h2>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Hủy" : "Chỉnh sửa"}
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Họ tên:</label>
          <input
            name="name"
            value={profileData.name || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            name="email"
            value={profileData.email || ""}
            disabled
          />
        </div>
        <div>
          <label>Số điện thoại:</label>
          <input
            name="phone"
            value={profileData.phone || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label>Địa chỉ:</label>
          <input
            name="address"
            value={profileData.address || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        {/* Thêm các trường khác nếu có */}
        {isEditing && <button type="submit">Lưu</button>}
      </form>
    </div>
  );
};

export default Profile;