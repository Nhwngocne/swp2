import React, { useState } from 'react';
import { useEvents } from '../../services/EventContext';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/components/staff/EventManager.css'; // Tạo file CSS riêng nếu cần

const CreateEventPage = () => {
  const { createEvent } = useEvents();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    session: 'ALL',
    donationMorningStart: '',
    donationMorningEnd: '',
    donationAfternoonStart: '',
    donationAfternoonEnd: '',
    bloodTypeIds: [],
    maxRegistrations: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Ánh xạ nhóm máu sang ID
  const bloodTypeMap = {
    'A': 2,
    'B': 3,
    'AB': 4,
    'O': 5,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBloodTypesChange = (bloodType) => {
    const id = bloodTypeMap[bloodType];
    setFormData((prev) => {
      const newBloodTypeIds = prev.bloodTypeIds.includes(id)
        ? prev.bloodTypeIds.filter((item) => item !== id)
        : [...prev.bloodTypeIds, id];
      return { ...prev, bloodTypeIds: newBloodTypeIds };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Xử lý donationTimes để ánh xạ sang donationMorningStart, donationAfternoonStart, v.v.
      let updatedFormData = { ...formData, image: imageFile };
      if (formData.session === 'MORNING' || formData.session === 'ALL') {
        updatedFormData.donationMorningStart = formData.donationMorningStart || '07:00';
        updatedFormData.donationMorningEnd = formData.donationMorningEnd || '11:00';
      }
      if (formData.session === 'AFTERNOON' || formData.session === 'ALL') {
        updatedFormData.donationAfternoonStart = formData.donationAfternoonStart || '13:00';
        updatedFormData.donationAfternoonEnd = formData.donationAfternoonEnd || '16:00';
      }

      const result = await createEvent(updatedFormData);
      if (result.success) {
        alert(result.message);
        navigate('/eventManager');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Lỗi khi tạo sự kiện:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const bloodTypeOptions = ['A', 'B', 'AB', 'O'];

  return (
    <div className="event-manager">
      <div className="page-header">
        <h1>Thêm Sự Kiện Mới</h1>
        <button className="close-btn" onClick={() => navigate('/eventManager')}>
          ×
        </button>
      </div>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Tiêu đề:</label>
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô tả:</label>
          <textarea
            name="description"
            placeholder="Mô tả"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Ngày:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Thời gian bắt đầu:</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endTime">Thời gian kết thúc:</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Địa điểm:</label>
          <input
            type="text"
            name="location"
            placeholder="Địa điểm"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="session">Chọn phiên hiến máu:</label>
          <select
            name="session"
            value={formData.session}
            onChange={handleInputChange}
          >
            <option value="ALL">Cả ngày</option>
            <option value="MORNING">Chỉ buổi sáng</option>
            <option value="AFTERNOON">Chỉ buổi chiều</option>
          </select>
        </div>
        {(formData.session === 'ALL' || formData.session === 'MORNING') && (
          <div className="form-group time-pair">
            <label>Giờ sáng:</label>
            <input
              type="time"
              name="donationMorningStart"
              value={formData.donationMorningStart}
              onChange={handleInputChange}
              required
            />
            <span>→</span>
            <input
              type="time"
              name="donationMorningEnd"
              value={formData.donationMorningEnd}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
        {(formData.session === 'ALL' || formData.session === 'AFTERNOON') && (
          <div className="form-group time-pair">
            <label>Giờ chiều:</label>
            <input
              type="time"
              name="donationAfternoonStart"
              value={formData.donationAfternoonStart}
              onChange={handleInputChange}
              required
            />
            <span>→</span>
            <input
              type="time"
              name="donationAfternoonEnd"
              value={formData.donationAfternoonEnd}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="maxRegistrations">Số lượng đăng ký tối đa:</label>
          <input
            type="number"
            name="maxRegistrations"
            value={formData.maxRegistrations}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label>Nhóm máu cần hiến:</label>
          <div className="checkbox-group">
            {bloodTypeOptions.map((blood) => (
              <label key={blood}>
                <input
                  type="checkbox"
                  value={blood}
                  checked={formData.bloodTypeIds.includes(bloodTypeMap[blood])}
                  onChange={() => handleBloodTypesChange(blood)}
                />
                {blood}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Ảnh:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="event-image-preview"
            />
          )}
        </div>
        <div className="form-actions">
          <button type="submit">Tạo sự kiện</button>
          <button type="button" onClick={() => navigate('/eventManager')}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;