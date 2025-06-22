import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';

const DonationHistory = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchDonationHistory();
  }, [filterYear, sortOrder]);

  const fetchDonationHistory = async () => {
    setLoading(true);
    
    // Mock data
    const mockDonations = [
      {
        id: 1,
        date: '2024-04-15',
        location: 'Bệnh viện Chợ Rẫy',
        bloodType: 'O+',
        volume: 350,
        status: 'Hoàn thành',
        result: 'Đạt tiêu chuẩn',
        nextEligibleDate: '2024-07-15',
        certificate: 'GCN001234'
      },
      {
        id: 2,
        date: '2024-01-20',
        location: 'Trung tâm Huyết học TP.HCM',
        bloodType: 'O+',
        volume: 400,
        status: 'Hoàn thành',
        result: 'Đạt tiêu chuẩn',
        nextEligibleDate: '2024-04-20',
        certificate: 'GCN001100'
      },
      {
        id: 3,
        date: '2023-10-10',
        location: 'Bệnh viện Bình Dân',
        bloodType: 'O+',
        volume: 350,
        status: 'Hoàn thành',
        result: 'Đạt tiêu chuẩn',
        nextEligibleDate: '2024-01-10',
        certificate: 'GCN000987'
      },
      {
        id: 4,
        date: '2023-07-05',
        location: 'Xe lưu động hiến máu',
        bloodType: 'O+',
        volume: 350,
        status: 'Hoàn thành',
        result: 'Đạt tiêu chuẩn',
        nextEligibleDate: '2023-10-05',
        certificate: 'GCN000856'
      },
      {
        id: 5,
        date: '2023-03-18',
        location: 'Bệnh viện 115',
        bloodType: 'O+',
        volume: 400,
        status: 'Hoàn thành',
        result: 'Đạt tiêu chuẩn',
        nextEligibleDate: '2023-06-18',
        certificate: 'GCN000721'
      }
    ];

    setTimeout(() => {
      let filteredDonations = mockDonations.filter(donation => {
        const donationYear = new Date(donation.date).getFullYear();
        return donationYear === filterYear;
      });

      // Sort donations
      filteredDonations.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });

      setDonations(filteredDonations);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành': return 'green';
      case 'Đang xử lý': return 'orange';
      case 'Không đạt': return 'red';
      default: return 'gray';
    }
  };

  const calculateTotalVolume = () => {
    return donations.reduce((total, donation) => total + donation.volume, 0);
  };

  const downloadCertificate = (donationId, certificateNumber) => {
    console.log(`Tải giấy chứng nhận ${certificateNumber} cho lần hiến máu ${donationId}`);
    alert(`Đang tải giấy chứng nhận ${certificateNumber}...`);
  };

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
      years.push(year);
    }
    return years;
  };

  if (loading) {
    return <div className="loading">Đang tải lịch sử hiến máu...</div>;
  }

  return (
    <div className="donation-history-container">
      <div className="history-header">
        <h1>Lịch Sử Hiến Máu</h1>
        <div className="summary-stats">
          <div className="stat-card">
            <h3>Tổng số lần hiến</h3>
            <span className="stat-number">{donations.length}</span>
          </div>
          <div className="stat-card">
            <h3>Tổng lượng máu hiến</h3>
            <span className="stat-number">{calculateTotalVolume()} ml</span>
          </div>
        </div>
      </div>

      <div className="history-controls">
        <div className="filter-group">
          <label>Lọc theo năm:</label>
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(parseInt(e.target.value))}
          >
            <option value={0}>Tất cả các năm</option>
            {getAvailableYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="sort-group">
          <label>Sắp xếp:</label>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Mới nhất trước</option>
            <option value="asc">Cũ nhất trước</option>
          </select>
        </div>
      </div>

      <div className="donations-list">
        {donations.length === 0 ? (
          <div className="no-donations">
            <p>Không có lịch sử hiến máu trong năm {filterYear}</p>
          </div>
        ) : (
          donations.map(donation => (
            <div key={donation.id} className="donation-card">
              <div className="donation-header">
                <div className="donation-date">
                  <strong>{new Date(donation.date).toLocaleDateString('vi-VN')}</strong>
                </div>
                <div className={`donation-status ${getStatusColor(donation.status)}`}>
                  {donation.status}
                </div>
              </div>

              <div className="donation-details">
                <div className="detail-row">
                  <span className="label">Địa điểm:</span>
                  <span className="value">{donation.location}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Nhóm máu:</span>
                  <span className="value">{donation.bloodType}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Lượng máu:</span>
                  <span className="value">{donation.volume} ml</span>
                </div>
                <div className="detail-row">
                  <span className="label">Kết quả xét nghiệm:</span>
                  <span className="value">{donation.result}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Có thể hiến tiếp:</span>
                  <span className="value">
                    {new Date(donation.nextEligibleDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="donation-actions">
                <button 
                  className="download-btn"
                  onClick={() => downloadCertificate(donation.id, donation.certificate)}
                >
                  Tải giấy chứng nhận
                </button>
                <span className="certificate-number">
                  Số GCN: {donation.certificate}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {donations.length > 0 && (
        <div className="history-footer">
          <div className="next-donation-info">
            <h3>Thông tin hiến máu tiếp theo</h3>
            <p>
              Bạn có thể hiến máu tiếp theo từ ngày: {' '}
              <strong>
                {donations.length > 0 
                  ? new Date(donations[0].nextEligibleDate).toLocaleDateString('vi-VN')
                  : 'Ngay bây giờ'
                }
              </strong>
            </p>
            <p className="note">
              * Khoảng cách tối thiểu giữa 2 lần hiến máu là 3 tháng
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationHistory;