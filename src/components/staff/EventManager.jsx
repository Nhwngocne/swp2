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
    session: 'ALL',
    donationMorningStart: '',
    donationMorningEnd: '',
    donationAfternoonStart: '',
    donationAfternoonEnd: '',
    location: '',
    bloodTypeIds: [], // Thay đổi từ bloodTypes sang bloodTypeIds
    maxRegistrations: 0,
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

  // Ánh xạ tên nhóm máu sang ID (A → 2, B → 3, AB → 4, O → 5)
  const bloodTypeMap = {
    'A': 2,
    'B': 3,
    'AB': 4,
    'O': 5,
  };

  const handleBloodTypesChange = (bloodType) => {
    setFormData((prev) => {
      const id = bloodTypeMap[bloodType]; // Lấy ID tương ứng
      const newBloodTypeIds = prev.bloodTypeIds.includes(id)
        ? prev.bloodTypeIds.filter((item) => item !== id)
        : [...prev.bloodTypeIds, id];
      return { ...prev, bloodTypeIds: newBloodTypeIds };
    });
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
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      session: event.session || 'ALL',
      donationMorningStart: event.donationMorningStart || '',
      donationMorningEnd: event.donationMorningEnd || '',
      donationAfternoonStart: event.donationAfternoonStart || '',
      donationAfternoonEnd: event.donationAfternoonEnd || '',
      location: event.location,
      // Nếu event.bloodTypes là ID (số), giữ nguyên; nếu là chuỗi, ánh xạ sang ID
      bloodTypeIds: Array.isArray(event.bloodTypes) && event.bloodTypes.every(type => typeof type === 'number')
        ? event.bloodTypes // Giữ nguyên nếu là mảng ID
        : event.bloodTypes.map(type => bloodTypeMap[type] || 0), // Ánh xạ từ chuỗi sang ID
      maxRegistrations: event.maxRegistrations || 0,
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
      session: 'ALL',
      donationMorningStart: '',
      donationMorningEnd: '',
      donationAfternoonStart: '',
      donationAfternoonEnd: '',
      location: '',
      bloodTypeIds: [],
      maxRegistrations: 0,
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

  const bloodTypeOptions = ['A', 'B', 'O', 'AB'];

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
              <div className="form-group">
                <label htmlFor="title">Tiêu đề:</label>
                <input
                  type="text"
                  id="title"
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
                  id="description"
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
                  id="date"
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
                  id="startTime"
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
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="session">Chọn phiên hiến máu:</label>
                <select
                  id="session"
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
                  →
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
                  →
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
                <label htmlFor="location">Địa điểm:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Địa điểm"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
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
              <div className="form-group">
                <label htmlFor="maxRegistrations">Số lượng người đăng ký cho phép:</label>
                <input
                  type="number"
                  id="maxRegistrations"
                  name="maxRegistrations"
                  value={formData.maxRegistrations}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nhóm máu cần hiến:</label>
                <div className="blood-types-checkboxes">
                  {bloodTypeOptions.map((type) => (
                    <div key={type} className="checkbox-item">
                      <input
                        type="checkbox"
                        value={type}
                        checked={formData.bloodTypeIds.includes(bloodTypeMap[type])}
                        onChange={() => handleBloodTypesChange(type)}
                      />
                      <span>{type}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                <div><strong>Ngày:</strong> {event.date}</div>
                <div><strong>Thời gian:</strong> {event.startTime} - {event.endTime}</div>
                <div>
                  <strong>Buổi:</strong> {event.session}
                </div>
                <div>
                  <strong>Giờ hiến máu:</strong>
                  <ul>
                    {event.donationMorningStart && event.donationMorningEnd && (
                      <li>
                        Sáng: {event.donationMorningStart} → {event.donationMorningEnd}
                      </li>
                    )}
                    {event.donationAfternoonStart && event.donationAfternoonEnd && (
                      <li>
                        Chiều: {event.donationAfternoonStart} → {event.donationAfternoonEnd}
                      </li>
                    )}
                  </ul>
                </div>
                <div><strong>Địa điểm:</strong> {event.location}</div>
                <div><strong>Nhóm máu:</strong> {event.bloodTypes?.join(', ') || 'Không xác định'}</div>
                <div><strong>Số lượng người đăng ký cho phép:</strong> {event.maxRegistrations || 0}</div>
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