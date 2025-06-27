import React, { useState } from 'react';
import { useEvents } from '../../services/EventContext';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/components/staff/EventManager.css';

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
    status: 'UPCOMING',
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const data = { ...formData, image: imageFile };
      const result = await createEvent(data);
      if (result.success) {
        alert(result.message);
        navigate('/eventManager'); // Chuyển hướng về trang quản lý sự kiện
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="event-manager">
      <div className="page-header">
        <h1>Thêm Sự Kiện Mới</h1>
      </div>
      <form onSubmit={handleSubmit} className="event-form">
        <input
          type="text"
          name="title"
          placeholder="Tiêu đề"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Mô tả"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Địa điểm"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
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
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="UPCOMING">Sắp diễn ra</option>
          <option value="ONGOING">Đang diễn ra</option>
          <option value="COMPLETED">Đã kết thúc</option>
        </select>
        <button type="submit">Tạo sự kiện</button>
      </form>
    </div>
  );
};

export default CreateEventPage;
