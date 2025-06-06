import React, { useState, useEffect } from 'react';

const ReportStats = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);

  // Mock data
  useEffect(() => {
    const mockStats = {
      donations: {
        total: 1245,
        thisMonth: 98,
        lastMonth: 87,
        growth: 12.6
      },
      donors: {
        total: 856,
        active: 234,
        new: 23,
        returning: 45
      },
      bloodTypes: {
        'O+': 325,
        'A+': 298,
        'B+': 187,
        'AB+': 89,
        'O-': 156,
        'A-': 98,
        'B-': 67,
        'AB-': 25
      },
      inventory: {
        'O+': { current: 45, needed: 60, status: 'low' },
        'A+': { current: 38, needed: 50, status: 'ok' },
        'B+': { current: 25, needed: 40, status: 'critical' },
        'AB+': { current: 15, needed: 20, status: 'ok' },
        'O-': { current: 8, needed: 25, status: 'critical' },
        'A-': { current: 12, needed: 20, status: 'low' },
        'B-': { current: 6, needed: 15, status: 'critical' },
        'AB-': { current: 3, needed: 8, status: 'critical' }
      },
      events: {
        total: 24,
        completed: 18,
        upcoming: 6,
        avgDonors: 42
      }
    };

    const mockChartData = [
      { month: 'T1', donations: 78, donors: 45 },
      { month: 'T2', donations: 85, donors: 52 },
      { month: 'T3', donations: 92, donors: 48 },
      { month: 'T4', donations: 87, donors: 56 },
      { month: 'T5', donations: 98, donors: 61 },
      { month: 'T6', donations: 105, donors: 58 }
    ];

    setStats(mockStats);
    setChartData(mockChartData);
  }, [timeRange]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return '#ff4444';
      case 'low': return '#ff8800';
      case 'ok': return '#44ff44';
      default: return '#888';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'critical': return 'Nguy hiểm';
      case 'low': return 'Thấp';
      case 'ok': return 'Ổn định';
      default: return 'Không xác định';
    }
  };

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      stats
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `blood_donation_report_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="report-stats">
      <div className="header">
        <h2>Báo cáo và Thống kê</h2>
        <div className="header-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="quarter">3 tháng qua</option>
            <option value="year">12 tháng qua</option>
          </select>
          <button onClick={exportReport} className="btn btn-primary">
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Tổng lượt hiến máu</h3>
            <span className="stat-trend positive">+{stats.donations?.growth}%</span>
          </div>
          <div className="stat-value">{stats.donations?.total}</div>
          <div className="stat-detail">
            Tháng này: {stats.donations?.thisMonth} | Tháng trước: {stats.donations?.lastMonth}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Người hiến máu</h3>
          </div>
          <div className="stat-value">{stats.donors?.total}</div>
          <div className="stat-detail">
            Hoạt động: {stats.donors?.active} | Mới: {stats.donors?.new}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Sự kiện hiến máu</h3>
          </div>
          <div className="stat-value">{stats.events?.total}</div>
          <div className="stat-detail">
            Hoàn thành: {stats.events?.completed} | Sắp tới: {stats.events?.upcoming}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>TB người/sự kiện</h3>
          </div>
          <div className="stat-value">{stats.events?.avgDonors}</div>
          <div className="stat-detail">
            Người hiến máu trung bình mỗi sự kiện
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Xu hướng hiến máu theo tháng</h3>
          <div className="simple-chart">
            <div className="chart-bars">
              {chartData.map((data, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar donations"
                      style={{ height: `${(data.donations / 120) * 100}%` }}
                      title={`${data.donations} lượt hiến máu`}
                    ></div>
                    <div 
                      className="chart-bar donors"
                      style={{ height: `${(data.donors / 120) * 100}%` }}
                      title={`${data.donors} người hiến máu`}
                    ></div>
                  </div>
                  <div className="chart-label">{data.month}</div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color donations"></span>
                <span>Lượt hiến máu</span>
              </div>
              <div className="legend-item">
                <span className="legend-color donors"></span>
                <span>Người hiến máu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blood Types Distribution */}
      <div className="blood-types-section">
        <h3>Phân bố nhóm máu</h3>
        <div className="blood-types-grid">
          {Object.entries(stats.bloodTypes || {}).map(([type, count]) => (
            <div key={type} className="blood-type-card">
              <div className="blood-type-header">
                <span className="blood-type">{type}</span>
                <span className="blood-count">{count}</span>
              </div>
              <div className="blood-percentage">
                {Math.round((count / stats.donations?.total) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blood Inventory Status */}
      <div className="inventory-section">
        <h3>Tình trạng kho máu</h3>
        <div className="inventory-grid">
          {Object.entries(stats.inventory || {}).map(([type, data]) => (
            <div key={type} className="inventory-card">
              <div className="inventory-header">
                <span className="blood-type">{type}</span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(data.status) }}
                >
                  {getStatusText(data.status)}
                </span>
              </div>
              <div className="inventory-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(data.current / data.needed) * 100}%`,
                      backgroundColor: getStatusColor(data.status)
                    }}
                  ></div>
                </div>
                <div className="progress-text">
                  {data.current} / {data.needed} đơn vị
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="detailed-reports">
        <h3>Báo cáo chi tiết</h3>
        <div className="report-tabs">
          <div className="report-section">
            <h4>Hiệu suất chiến dịch</h4>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Tên chiến dịch</th>
                  <th>Ngày</th>
                  <th>Mục tiêu</th>
                  <th>Thực tế</th>
                  <th>Tỷ lệ đạt</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chiến dịch Mùa hè 2024</td>
                  <td>15/05/2024</td>
                  <td>50</td>
                  <td>62</td>
                  <td className="success">124%</td>
                </tr>
                <tr>
                  <td>Hiến máu cứu người</td>
                  <td>08/05/2024</td>
                  <td>40</td>
                  <td>35</td>
                  <td className="warning">87.5%</td>
                </tr>
                <tr>
                  <td>Tình nguyện vì cộng đồng</td>
                  <td>01/05/2024</td>
                  <td>60</td>
                  <td>45</td>
                  <td className="danger">75%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="report-section">
            <h4>Top người hiến máu</h4>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Số lần hiến</th>
                  <th>Nhóm máu</th>
                  <th>Lần cuối</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nguyễn Văn A</td>
                  <td>15</td>
                  <td>O+</td>
                  <td>12/05/2024</td>
                </tr>
                <tr>
                  <td>Trần Thị B</td>
                  <td>12</td>
                  <td>A+</td>
                  <td>10/05/2024</td>
                </tr>
                <tr>
                  <td>Lê Văn C</td>
                  <td>10</td>
                  <td>B+</td>
                  <td>08/05/2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportStats;