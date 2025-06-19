import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../services/EventContext'; // Import context
import '../../assets/css/components/guest/EventList.css';
import { useAuth } from '../../services/AuthContext';

const EventList = () => {
  const { user } = useAuth();
  const { events, loading, error } = useEvents(); // Lấy dữ liệu từ context
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
    if (!user) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang login với state để quay lại
      navigate('/login', { state: { from: '/donation-form', eventId } });
    } else {
      // Nếu đã đăng nhập, chuyển hướng đến donation-form
      navigate('/donation-form', { state: { eventId } });
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</div>;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Lỗi: {error}</div>;
  }

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
          { key: 'UPCOMING', label: 'Sắp diễn ra' },
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
                background: event.status === 'UPCOMING' ? '#2ecc71' : '#95a5a6',
                color: 'white',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}>
                {event.status === 'UPCOMING' ? 'SẮP DIỄN RA' : 'ĐÃ HOÀN THÀNH'}
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
                onClick={() => event.status === 'UPCOMING' && handleRegisterClick(event.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: event.status === 'UPCOMING' ? '#e74c3c' : '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: event.status === 'UPCOMING' ? 'pointer' : 'not-allowed',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (event.status === 'UPCOMING') {
                    e.target.style.background = '#c0392b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (event.status === 'UPCOMING') {
                    e.target.style.background = '#e74c3c';
                  }
                }}
              >
                {event.status === 'UPCOMING' ? 'Đăng ký tham gia' : 'Đã kết thúc'}
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
          boxShadow: '0 2 alone:10px rgba(0,0,0,0.1)'
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