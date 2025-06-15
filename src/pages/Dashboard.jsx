import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/pages/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalVolume: 0,
    upcomingEvents: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalDonations: user.role === 'member' ? 5 : 150,
          totalVolume: user.role === 'member' ? 2000 : 75000,
          upcomingEvents: 3,
          recentActivity: [
            {
              id: 1,
              type: 'donation',
              title: 'Hiến máu tại Bệnh viện Chợ Rẫy',
              date: '2024-01-15',
              status: 'completed'
            },
            {
              id: 2,
              type: 'event',
              title: 'Chương trình hiến máu tình nguyện',
              date: '2024-01-20',
              status: 'upcoming'
            },
            {
              id: 3,
              type: 'emergency',
              title: 'Cần máu khẩn cấp - Nhóm O-',
              date: '2024-01-18',
              status: 'urgent'
            }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-loading">
        <p>Vui lòng đăng nhập để xem bảng điều khiển.</p>
      </div>
    );
  }
}
export default Dashboard;
