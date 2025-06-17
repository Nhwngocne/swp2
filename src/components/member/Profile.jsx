import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";
import { authService } from "../../services/authService";
import "../../assets/css/member/profile.css";

const Profile = () => {
  const { updateProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getCurrentUser();
        setProfileData(response.data); // chứa name, email, phone, address,...
      } catch (error) {
        alert("Không thể tải thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fieldLabels = {
    address: "Địa chỉ liên hệ",
    phone: "Điện thoại di động",
    email: "Email",
    job: "Nghề nghiệp",
  };

  const validateProfileData = (data) => {
    const requiredFields = Object.keys(fieldLabels);

    for (let field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        return {
          success: false,
          message: `Vui lòng nhập trường: ${fieldLabels[field]}`,
        };
      }
    }

    return { success: true };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateProfileData(profileData);
    if (!validation.success) {
      alert(validation.message);
      return;
    }

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
          {renderField("Số CCCD", "citizenId", profileData.citizenId)}
          {renderField("Ngày sinh", "dob", profileData.dob)}
          {renderField("Giới tính", "gender", profileData.gender)}
        </div>

        <div className="profile-column">
          <div className="column-header">
            <h3>Thông tin liên hệ</h3>
            <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
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
      <div className="profile-field">
        <label>{label}</label>
        {isEditing && allowEdit ? (
          <input
            type="text"
            name={name}
            value={value || ""}
            onChange={handleInputChange}
          />
        ) : (
          <span className="field-value">{value || "-"}</span>
        )}
      </div>
    );
  }
};

export default Profile;
