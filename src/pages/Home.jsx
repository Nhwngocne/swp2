import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './DonationBloodForm'; 
import '../assets/css/pages/Home.css';

// Import dữ liệu từ EventList và NewsList
import { getEventsData } from '../components/guest/EventList';
import { getNewsData } from '../components/guest/NewsList';

const Home = () => {
  const { user } = useAuth(); 

  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonors: 0,
    bloodUnits: 0,
    livesHelped: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    // Fetch homepage data
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Lấy dữ liệu từ EventList và NewsList
      const eventsData = getEventsData();
      const newsData = getNewsData();

      // Lọc 3 sự kiện sắp tới
      const upcomingEventsData = eventsData
        .filter(event => event.status === 'upcoming')
        .slice(0, 3)
        .map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          image: event.image || '/assets/event-default.jpg'
        }));

      // Lấy 3 tin tức mới nhất
      const latestNewsData = newsData
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        .slice(0, 3)
        .map(news => ({
          id: news.id,
          title: news.title,
          excerpt: news.summary,
          date: news.publishDate,
          image: news.image || '/assets/news-default.jpg'
        }));

      // Mock data cho stats (có thể thay thế bằng API thực tế)
      setStats({
        totalDonations: 12450,
        activeDonors: 3567,
        bloodUnits: 8920,
        livesHelped: 25380
      });

      setUpcomingEvents(upcomingEventsData);
      setLatestNews(latestNewsData);

    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Hiến Máu Nhân Đạo
              <span className="hero-subtitle">Cứu người - Giúp đời</span>
            </h1>
            <p className="hero-description">
              Mỗi giọt máu bạn hiến tặng có thể cứu sống 3 người. 
              Hãy tham gia cùng chúng tôi để lan tỏa tình yêu thương và chia sẻ cuộc sống.
            </p>
            <div className="hero-actions">
              {!user ? (
                <>
                  <Link to="/donation-blood-form" className="btn btn-primary btn-large">
                    Đăng ký hiến máu
                  </Link>
                  <Link to="/events" className="btn btn-outline btn-large">
                    Xem sự kiện
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/events" className="btn btn-primary btn-large">
                    Tham gia sự kiện
                  </Link>
                  <Link to="/dashboard" className="btn btn-outline btn-large">
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <img src="/assets/hero-blood-donation.jpg" alt="Hiến máu nhân đạo" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Thành tựu của chúng ta</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🩸</div>
              <div className="stat-number">{stats.totalDonations.toLocaleString()}</div>
              <div className="stat-label">Lượt hiến máu</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number">{stats.activeDonors.toLocaleString()}</div>
              <div className="stat-label">Người hiến máu</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-number">{stats.bloodUnits.toLocaleString()}</div>
              <div className="stat-label">Đơn vị máu</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-number">{stats.livesHelped.toLocaleString()}</div>
              <div className="stat-label">Mạng sống được cứu</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="events-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sự kiện sắp tới</h2>
            <Link to="/events" className="section-link">Xem tất cả</Link>
          </div>
          <div className="events-grid">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <div className="event-date">
                      {new Date(event.date).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-location">
                      <span className="location-icon">📍</span>
                      {event.location}
                    </p>
                    <Link to={`/events/${event.id}`} className="btn btn-outline btn-small">
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events">
                <p>Hiện tại chưa có sự kiện nào sắp diễn ra</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="news-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tin tức mới nhất</h2>
            <Link to="/news" className="section-link">Xem tất cả</Link>
          </div>
          <div className="news-grid">
            {latestNews.length > 0 ? (
              latestNews.map(news => (
                <div key={news.id} className="news-card">
                  <div className="news-image">
                    <img src={news.image} alt={news.title} />
                  </div>
                  <div className="news-content">
                    <div className="news-date">
                      {new Date(news.date).toLocaleDateString('vi-VN')}
                    </div>
                    <h3 className="news-title">{news.title}</h3>
                    <p className="news-excerpt">{news.excerpt}</p>
                    <Link to={`/news/${news.id}`} className="news-link">
                      Đọc thêm →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-news">
                <p>Hiện tại chưa có tin tức mới</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Bạn đã sẵn sàng cứu sống một người?</h2>
            <p className="cta-description">
              Việc hiến máu không chỉ giúp cứu sống người khác mà còn có lợi cho sức khỏe của chính bạn. 
              Hãy tham gia cùng chúng tôi ngay hôm nay!
            </p>
            <div className="cta-actions">
              {!user ? (
                <Link to="/donation-blood-form" className="btn btn-primary btn-large">
                  Tham gia ngay
                </Link>
              ) : (
                <Link to="/events" className="btn btn-primary btn-large">
                  Tìm sự kiện gần bạn
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;