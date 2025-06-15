import React, { useState, useEffect } from 'react';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    address: '',
    capacity: '',
    requirements: '',
    contact: '',
    status: 'active'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const mockEvents = [
        {
          id: 1,
          title: 'Ngày hội hiến máu nhân đạo 2024',
          description: 'Chương trình hiến máu lớn nhất trong năm',
          date: '2024-04-15',
          time: '08:00',
          location: 'Công viên Tao Đàn',
          address: '37 Điện Biên Phủ, Quận 1, TP.HCM',
          capacity: 500,
          registered: 245,
          requirements: 'Độ tuổi 18-60, cân nặng trên 45kg',
          contact: '0901234567',
          status: 'active',
          createdAt: '2024-03-01T10:00:00Z'
        },
        {
          id: 2,
          title: 'Hiến máu tình nguyện tại trường ĐH',
          description: 'Chương trình hiến máu cho sinh viên',
          date: '2024-04-20',
          time: '09:00',
          location: 'Đại học Bách Khoa',
          address: '268 Lý Thường Kiệt, Quận 10, TP.HCM',
          capacity: 200,
          registered: 89,
          requirements: 'Sinh viên, độ tuổi 18-25',
          contact: '0987654321',
          status: 'active',
          createdAt: '2024-03-05T14:30:00Z'
        }
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const updatedEvents = events.map(event =>
          event.id === editingEvent.id
            ? { ...event, ...formData, id: editingEvent.id }
            : event
        );
        setEvents(updatedEvents);
        alert('Cập nhật sự kiện thành công!');
      } else {
        const newEvent = {
          ...formData,
          id: Date.now(),
          registered: 0,
          createdAt: new Date().toISOString()
        };
        setEvents([newEvent, ...events]);
        alert('Tạo sự kiện thành công!');
      }
      resetForm();
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
      time: event.time,
      location: event.location,
      address: event.address,
      capacity: event.capacity.toString(),
      requirements: event.requirements,
      contact: event.contact,
      status: event.status
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      try {
        setEvents(events.filter(event => event.id !== eventId));
        alert('Xóa sự kiện thành công!');
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
      time: '',
      location: '',
      address: '',
      capacity: '',
      requirements: '',
      contact: '',
      status: 'active'
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách sự kiện...</div>;
  }

  return (
    <div className="event-manager">
      <div className="page-header">
        <h1>Quản Lý Sự Kiện</h1>
        <button 
          className="add-btn"
          onClick={() => setShowForm(true)}
        >
          Thêm Sự Kiện Mới
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingEvent ? 'Chỉnh Sửa Sự Kiện' : 'Thêm Sự Kiện Mới'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
              {/* ... giữ nguyên phần form input giống như bạn đã viết */}
            </form>
          </div>
        </div>
      )}

      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.title}</h3>
              <div className={`status-badge status-${event.status}`}>
                {event.status === 'active' ? 'Hoạt động' : 
                 event.status === 'inactive' ? 'Tạm dừng' : 'Hoàn thành'}
              </div>
            </div>

            <div className="event-content">
              <p className="description">{event.description}</p>
              <div className="event-details">
                <div><strong>Thời gian:</strong> {event.date} lúc {event.time}</div>
                <div><strong>Địa điểm:</strong> {event.location}</div>
                <div><strong>Địa chỉ:</strong> {event.address}</div>
                <div><strong>Đăng ký:</strong> {event.registered}/{event.capacity} người</div>
                <div><strong>Liên hệ:</strong> {event.contact}</div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                />
              </div>
            </div>

            <div className="event-actions">
              <button onClick={() => handleEdit(event)}>Chỉnh sửa</button>
              <button onClick={() => handleDelete(event.id)} className="delete-btn">
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
