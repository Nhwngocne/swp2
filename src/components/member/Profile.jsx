import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";
import { authService } from "../../services/authService";
import "../../assets/css/member/Profile.css";

const Profile = () => {
  const { updateProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getCurrentUser();
        const userData = response.data.result.user;
        setProfileData(userData);
        setOriginalProfile(userData);
      } catch (error) {
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

  if (loading) return <div className="loading">Đang tải thông tin...</div>;
  if (!profileData) return <div className="error">Không có dữ liệu</div>;

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit}>
        <div className="profile-grid">
          <div className="profile-column">
            <h3>Thông tin cá nhân</h3>
            {renderField("Họ và tên", "name", profileData.name)}
            {renderField("Số CCCD", "numberCccd", profileData.numberCccd)}
            {renderField("Ngày sinh", "dob", profileData.dob)}
            {renderField("Giới tính", "gender", profileData.gender)}
          </div>

          <div className="profile-column">
            <div className="column-header">
              <h3>Thông tin liên hệ</h3>
              <button
                type="button"
                className="edit-btn"
                onClick={() => {
                  setProfileData(originalProfile);
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? "Hủy" : (<><i className="fa-solid fa-pen"></i> Chỉnh sửa</>)}
              </button>
            </div>
            {renderField("Địa chỉ liên hệ", "address", profileData.address, true)}
            {renderField("Điện thoại di động", "phone", profileData.phone, true)}
            {renderField("Email", "email", profileData.email, true)}
            {renderField("Nghề nghiệp", "job", profileData.job, true)}
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="submit" className="save-btn">Lưu thay đổi</button>
          </div>
        )}
      </form>
    </div>
  );

function renderField(label, name, value, allowEdit = false) {
  return (
    <div className="profile-field-inline">
      <span className="label">{label}</span>
      <span className="colon">:</span>
      {isEditing && allowEdit ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={handleInputChange}
        />
      ) : (
        <span className="value">{value || "-"}</span>
      )}
    </div>
  );
}
};

export default Profile;
