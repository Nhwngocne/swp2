import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/components/guest/EventList.css';

// Dữ liệu sự kiện
const eventsData = [
  {
    id: 1,
    title: 'Hiến máu nhân đạo tại Bệnh viện Chợ Rẫy',
    date: '2024-06-15',
    time: '08:00 - 17:00',
    location: '201B Nguyễn Chí Thanh, Q.5, TP.HCM',
    description: 'Chương trình hiến máu nhân đạo nhằm cứu giúp các bệnh nhân cần máu cấp cứu',
    image: '/api/placeholder/400/200',
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'Ngày hội hiến máu tình nguyện',
    date: '2024-06-20',
    time: '07:00 - 16:00',
    location: 'Công viên Tao Đàn, Q.1, TP.HCM',
    description: 'Ngày hội hiến máu lớn với sự tham gia của nhiều tình nguyện viên',
    image: '/api/placeholder/400/200',
    status: 'upcoming'
  },
  {
    id: 3,
    title: 'Hiến máu cứu người - Vì một cộng đồng khỏe mạnh',
    date: '2024-05-30',
    time: '08:30 - 16:30',
    location: 'Trường ĐH Bách khoa TP.HCM',
    description: 'Chương trình hiến máu tại trường đại học với sự tham gia của sinh viên',
    image: '/api/placeholder/400/200',
    status: 'completed'
  }
];

// Export function để lấy dữ liệu events
export const getEventsData = () => {
  return eventsData;
};

const EventList = () => {
  const [events] = useState(eventsData);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Hàm xử lý khi click đăng ký tham gia
  const handleRegisterClick = (eventId) => {
    // Chuyển hướng đến trang form hiến máu và truyền eventId
    navigate('/donation-form', { state: { eventId: eventId } });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#e74c3c', 
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          Sự kiện hiến máu
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#666',
          lineHeight: '1.6'
        }}>
          Tham gia các sự kiện hiến máu để góp phần cứu giúp những người cần máu
        </p>
      </div>

      {/* Filter Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'upcoming', label: 'Sắp diễn ra' },
          { key: 'completed', label: 'Đã hoàn thành' }
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            style={{
              padding: '10px 20px',
              border: filter === btn.key ? '2px solid #e74c3c' : '2px solid #ddd',
              background: filter === btn.key ? '#e74c3c' : 'white',
              color: filter === btn.key ? 'white' : '#333',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (filter !== btn.key) {
                e.target.style.borderColor = '#e74c3c';
                e.target.style.color = '#e74c3c';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== btn.key) {
                e.target.style.borderColor = '#ddd';
                e.target.style.color = '#333';
              }
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '25px'
      }}>
        {filteredEvents.map(event => (
          <div
            key={event.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            {/* Event Image */}
            <div style={{
              height: '200px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '3rem'
            }}>
              🩸
            </div>

            {/* Event Content */}
            <div style={{ padding: '20px' }}>
              {/* Status Badge */}
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: event.status === 'upcoming' ? '#2ecc71' : '#95a5a6',
                color: 'white',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}>
                {event.status === 'upcoming' ? 'SẮP DIỄN RA' : 'ĐÃ HOÀN THÀNH'}
              </div>

              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: '15px',
                lineHeight: '1.4'
              }}>
                {event.title}
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>📅</span>
                  <span style={{ color: '#666', fontWeight: '500' }}>
                    {formatDate(event.date)}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>⏰</span>
                  <span style={{ color: '#666' }}>{event.time}</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>📍</span>
                  <span style={{ color: '#666' }}>{event.location}</span>
                </div>
              </div>

              <p style={{
                color: '#7f8c8d',
                lineHeight: '1.5',
                marginBottom: '20px'
              }}>
                {event.description}
              </p>

              <button 
                onClick={() => event.status === 'upcoming' && handleRegisterClick(event.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: event.status === 'upcoming' ? '#e74c3c' : '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: event.status === 'upcoming' ? 'pointer' : 'not-allowed',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (event.status === 'upcoming') {
                    e.target.style.background = '#c0392b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (event.status === 'upcoming') {
                    e.target.style.background = '#e74c3c';
                  }
                }}
              >
                {event.status === 'upcoming' ? 'Đăng ký tham gia' : 'Đã kết thúc'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
            Không tìm thấy sự kiện nào
          </h3>
          <p style={{ color: '#7f8c8d' }}>
            Hiện tại không có sự kiện nào trong danh mục này
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;