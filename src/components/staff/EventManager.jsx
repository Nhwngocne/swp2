import React, { useState, useEffect } from 'react';
import { useEvents } from '../../services/EventContext';
import { useAuth } from '../../services/AuthContext';
import '../../assets/css/components/staff/EventManager.css';

const EventManager = () => {
  const { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  const { isStaff, isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
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

  useEffect(() => {
    if (isStaff || isAdmin) {
      fetchEvents();
    } else {
      console.log('Unauthorized access to EventManager');
    }
  }, [isStaff, isAdmin]);

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
      let result;
      if (editingEvent) {
        result = await updateEvent(editingEvent.id, data);
      } else {
        result = await createEvent(data);
      }
      if (result.success) {
        alert(result.message);
        resetForm();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime.split(':').slice(0, 2).join(':'), // HH:mm
      endTime: event.endTime.split(':').slice(0, 2).join(':'), // HH:mm
      location: event.location,
      status: event.status,
    });
    setPreviewUrl(event.image || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      try {
        const result = await deleteEvent(eventId);
        if (result.success) {
          alert(result.message);
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Có lỗi xảy ra khi xóa sự kiện.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      status: 'UPCOMING',
    });
    setImageFile(null);
    setPreviewUrl('');
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!(isStaff || isAdmin)) {
    return <div>Bạn không có quyền truy cập trang này.</div>;
  }

  if (loading) {
    return <div className="loading">Đang tải danh sách sự kiện...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="event-manager">
      <div className="page-header">
        <h1>Quản Lý Sự Kiện</h1>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Thêm Sự Kiện Mới
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingEvent ? 'Chỉnh Sửa Sự Kiện' : 'Thêm Sự Kiện Mới'}</h2>
              <button className="close-btn" onClick={resetForm}>
                ×
              </button>
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
              <button type="submit">
                {editingEvent ? 'Cập nhật' : 'Tạo sự kiện'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.title}</h3>
              <div
                className={`status-badge status-${event.status.toLowerCase()}`}
              >
                {event.status === 'UPCOMING'
                  ? 'Sắp diễn ra'
                  : event.status === 'ONGOING'
                  ? 'Đang diễn ra'
                  : 'Đã kết thúc'}
              </div>
            </div>

            <div className="event-content">
              <p className="description">{event.description}</p>
              <div className="event-details">
                <div>
                  <strong>Ngày:</strong> {event.date}
                </div>
                <div>
                  <strong>Giờ:</strong> {event.time}
                </div>
                <div>
                  <strong>Địa điểm:</strong> {event.location}
                </div>
              </div>
              {event.image && (
                <img src={event.image} alt="Event" className="event-image" />
              )}
            </div>

            <div className="event-actions">
              <button onClick={() => handleEdit(event)}>Chỉnh sửa</button>
              <button
                onClick={() => handleDelete(event.id)}
                className="delete-btn"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="no-data">
          <p>Chưa có sự kiện nào. Hãy tạo sự kiện đầu tiên!</p>
        </div>
      )}
    </div>
  );
};

export default EventManager;