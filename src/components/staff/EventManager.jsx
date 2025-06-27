import React, { useEffect } from 'react';
import { useEvents } from '../../services/EventContext';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/components/staff/EventManager.css';

const EventManager = () => {
  const { events, loading, error, fetchEvents, deleteEvent } = useEvents();
  const { isStaff, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isStaff || isAdmin) {
      fetchEvents();
    } else {
      console.log('Unauthorized access to EventManager');
    }
  }, [isStaff, isAdmin]);

  const handleEdit = (event) => {
    // Chuyển sang trang chỉnh sửa sự kiện nếu bạn có route này
    navigate(`/staff/events/edit/${event.id}`);
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
        <button className="add-btn" onClick={() => navigate('/createEvent')}>
          Thêm Sự Kiện Mới
        </button>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.title}</h3>
              <div className={`status-badge status-${event.status.toLowerCase()}`}>
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
                <div><strong>Giờ:</strong> {event.time}</div>
                <div><strong>Địa điểm:</strong> {event.location}</div>
              </div>
              {event.image && (
                <img src={event.image} alt="Event" className="event-image" />
              )}
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
