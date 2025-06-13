import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import image331 from '../assets/331.jpg';
import './Home.css';


const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      // Simulate API calls
      const [statsResponse, eventsResponse, newsResponse] = await Promise.all([
        fetch('/api/stats/homepage'),
        fetch('/api/events/upcoming?limit=3'),
        fetch('/api/news/latest?limit=3')
      ]);

      // Mock data for demonstration
      setStats({
        totalDonations: 12450,
        activeDonors: 3567,
        bloodUnits: 8920,
        livesHelped: 25380
      });

      setUpcomingEvents([
        {
          id: 1,
          title: 'Ngày hội hiến máu tình nguyện',
          date: '2024-12-15',
          location: 'Bệnh viện Chợ Rẫy',
          image: '/assets/event1.jpg'
        },
        {
          id: 2,
          title: 'Hiến máu cứu người - Chủ nhật đỏ',
          date: '2024-12-18',
          location: 'Trường ĐH Bách Khoa',
          image: '/assets/event2.jpg'
        },
        {
          id: 3,
          title: 'Tiếp sức mùa thi với giọt máu hồng',
          date: '2024-12-22',
          location: 'Hội trường Thống Nhất',
          image: '/assets/event3.jpg'
        }
      ]);

      setLatestNews([
        {
          id: 1,
          title: 'Tăng cường hoạt động hiến máu trong mùa dịch',
          excerpt: 'Các biện pháp an toàn mới được áp dụng để đảm bảo việc hiến máu diễn ra an toàn...',
          date: '2024-12-01',
          image: '/assets/news1.jpg'
        },
        {
          id: 2,
          title: 'Khánh thành trung tâm hiến máu mới tại TP.HCM',
          excerpt: 'Trung tâm hiến máu hiện đại với công nghệ tiên tiến nhất được đưa vào hoạt động...',
          date: '2024-11-28',
          image: '/assets/news2.jpg'
        },
        {
          id: 3,
          title: 'Chiến dịch "Giọt máu hồng - Tình người Việt" thành công',
          excerpt: 'Hơn 10,000 đơn vị máu đã được thu thập trong chiến dịch kéo dài 3 tháng...',
          date: '2024-11-25',
          image: '/assets/news3.jpg'
        }
      ]);

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
                  <button
                    className="btn btn-primary btn-large"
                    onClick={() => {
                      if (user) {
                        navigate('/donation/register'); // chuyển đến form đăng ký hiến máu
                      } else {
                        navigate('/login'); // chuyển đến login
                      }
                    }}
                  >
                    Đăng ký hiến máu
                  </button>
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
            <img src={image331} alt="331" />
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
            {upcomingEvents.map(event => (
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
            ))}
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
            {latestNews.map(news => (
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
            ))}
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
                <Link to="/register" className="btn btn-primary btn-large">
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

      {/* Blood Types Info Section */}
      <section className="blood-types-section">
        <div className="container">
          <h2 className="section-title">Nhóm máu và tương thích</h2>
          <div className="blood-types-grid">
            <div className="blood-type-card">
              <div className="blood-type-icon">🅾️</div>
              <h3>Nhóm O</h3>
              <p>Người hiến máu vạn năng</p>
              <div className="compatibility">
                <span className="can-donate">Có thể hiến cho: O, A, B, AB</span>
                <span className="can-receive">Có thể nhận từ: O</span>
              </div>
            </div>
            <div className="blood-type-card">
              <div className="blood-type-icon">🅰️</div>
              <h3>Nhóm A</h3>
              <p>Tương thích nhóm A và AB</p>
              <div className="compatibility">
                <span className="can-donate">Có thể hiến cho: A, AB</span>
                <span className="can-receive">Có thể nhận từ: O, A</span>
              </div>
            </div>
            <div className="blood-type-card">
              <div className="blood-type-icon">🅱️</div>
              <h3>Nhóm B</h3>
              <p>Tương thích nhóm B và AB</p>
              <div className="compatibility">
                <span className="can-donate">Có thể hiến cho: B, AB</span>
                <span className="can-receive">Có thể nhận từ: O, B</span>
              </div>
            </div>
            <div className="blood-type-card">
              <div className="blood-type-icon">🆎</div>
              <h3>Nhóm AB</h3>
              <p>Người nhận máu vạn năng</p>
              <div className="compatibility">
                <span className="can-donate">Có thể hiến cho: AB</span>
                <span className="can-receive">Có thể nhận từ: O, A, B, AB</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;