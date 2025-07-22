import React, { useEffect } from 'react';
import { useEvents } from '../../services/EventContext';
import { useAuth } from "../../services/AuthContext";
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
    if (event.status === 'ONGOING') {
      alert('Không thể chỉnh sửa sự kiện đang diễn ra.');
      return;
    }
    navigate(`/staff/events/edit/${event.id}`);
  };

  const handleDelete = async (event) => {
    if (event.status === 'ONGOING') {
      alert('Không thể xóa sự kiện đang diễn ra.');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      try {
        const result = await deleteEvent(event.id);
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
         <div tabIndex="0" className="plusButton" onClick={() => navigate('/createEvent')}>
          <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
            <g mask="url(#mask0_21_345)">
              <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
            </g>
          </svg>
        </div>
      </div>

      <div className="events-grid">
        {events.map((event) => (
<div key={event.id} className="event-card">
  {event.image && (
    <img src={event.image} alt="Event" className="event-image" />
  )}        
              <div className="event-content">

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
                    
              {/* <p className="description">{event.description}</p> */}
              <div className="event-details">
                <div><strong>Ngày:</strong> {event.date}</div>
                <div><strong>Giờ:</strong> {event.time}</div>
                <div><strong>Địa điểm:</strong> {event.location}</div>
                <div><strong>Phiên hiến máu:</strong> {event.session === 'ALL' ? 'Cả ngày' : event.session === 'MORNING' ? 'Buổi sáng' : 'Buổi chiều'}</div>
                {(event.session === 'ALL' || event.session === 'MORNING') && (
                  <div><strong>Giờ sáng:</strong> {event.donationMorningStart} - {event.donationMorningEnd}</div>
                )}
                {(event.session === 'ALL' || event.session === 'AFTERNOON') && (
                  <div><strong>Giờ chiều:</strong> {event.donationAfternoonStart} - {event.donationAfternoonEnd}</div>
                )}
                <div><strong>Số lượng đăng ký:</strong> {event.registeredMemberCount} / {event.maxRegistrations}</div>
                <div><strong>Người tạo:</strong> {event.createdBy}</div>
              </div>
            
            </div>

            <div className="event-actions">
              <button
                className="editBtn"
                onClick={() => handleEdit(event)}
                disabled={event.status === 'ONGOING'}
                title={event.status === 'ONGOING' ? 'Không thể chỉnh sửa sự kiện đang diễn ra' : ''}
              >
                <svg height="1em" viewBox="0 0 512 512">
                  <path
                    d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                  ></path>
                </svg>
              </button>
              <button
                className="bin-button"
                onClick={() => handleDelete(event)}
                disabled={event.status === 'ONGOING'}
                title={event.status === 'ONGOING' ? 'Không thể xóa sự kiện đang diễn ra' : ''}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 39 7"
                  className="bin-top"
                >
                  <line strokeWidth="4" stroke="white" y2="5" x2="39" y1="5"></line>
                  <line
                    strokeWidth="3"
                    stroke="white"
                    y2="1.5"
                    x2="26.0357"
                    y1="1.5"
                    x1="12"
                  ></line>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 33 39"
                  className="bin-bottom"
                >
                  <mask fill="white" id="path-1-inside-1_8_19">
                    <path
                      d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                    ></path>
                  </mask>
                  <path
                    mask="url(#path-1-inside-1_8_19)"
                    fill="white"
                    d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                  ></path>
                  <path strokeWidth="4" stroke="white" d="M12 6L12 29"></path>
                  <path strokeWidth="4" stroke="white" d="M21 6V29"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 89 80"
                  className="garbage"
                >
                  <path
                    fill="white"
                    d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                  ></path>
                </svg>
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