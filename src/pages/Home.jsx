import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DonationBloodForm'; 
import '../assets/css/pages/Home.css';

const Home = () => {
  const [user, setUser] = useState(null);

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
    // Kiểm tra user từ localStorage hoặc sessionStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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

      // Giả lập dữ liệu
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

      {/* Các section khác giữ nguyên như cũ */}
    </div>
  );
};

export default Home;
