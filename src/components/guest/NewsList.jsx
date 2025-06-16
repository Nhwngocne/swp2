import React, { useState } from 'react';
import '../../assets/css/components/guest/NewsList.css';

// Dữ liệu tin tức
const newsData = [
  {
    id: 1,
    title: 'Tầm quan trọng của việc hiến máu định kỳ cho sức khỏe cộng đồng',
    summary: 'Hiến máu định kỳ không chỉ giúp cứu sống nhiều người mà còn mang lại lợi ích sức khỏe cho người hiến.',
    content: 'Theo các chuyên gia y tế, việc hiến máu định kỳ có thể giúp giảm nguy cơ mắc các bệnh tim mạch, ung thư và nhiều bệnh khác...',
    author: 'BS. Nguyễn Văn A',
    publishDate: '2024-06-01',
    category: 'Sức khỏe',
    views: 1250,
    image: '/api/placeholder/400/250'
  },
  {
    id: 2,
    title: 'Những điều cần biết khi hiến máu lần đầu',
    summary: 'Hướng dẫn chi tiết cho những người lần đầu tham gia hiến máu tình nguyện.',
    content: 'Hiến máu lần đầu có thể khiến nhiều người lo lắng. Dưới đây là những thông tin cần thiết để chuẩn bị tốt nhất...',
    author: 'BS. Trần Thị B',
    publishDate: '2024-05-28',
    category: 'Hướng dẫn',
    views: 980,
    image: '/api/placeholder/400/250'
  },
  {
    id: 3,
    title: 'Thành tựu của chương trình hiến máu tình nguyện năm 2024',
    summary: 'Cập nhật những con số ấn tượng và thành tựu đạt được trong chương trình hiến máu tình nguyện.',
    content: 'Trong năm 2024, chương trình hiến máu tình nguyện đã đạt được nhiều thành tựu đáng kể với sự tham gia của hàng nghìn tình nguyện viên...',
    author: 'Hội Chữ thập đỏ',
    publishDate: '2024-05-25',
    category: 'Thông tin',
    views: 1500,
    image: '/api/placeholder/400/250'
  },
  {
    id: 4,
    title: 'Câu chuyện cảm động về những người hiến máu thường xuyên',
    summary: 'Chia sẻ những câu chuyện đầy cảm động từ các tình nguyện viên hiến máu lâu năm.',
    content: 'Có những người đã hiến máu hàng chục lần, với họ đây không chỉ là hành động nhân đạo mà còn là trách nhiệm với cộng đồng...',
    author: 'Phóng viên',
    publishDate: '2024-05-20',
    category: 'Câu chuyện',
    views: 850,
    image: '/api/placeholder/400/250'
  }
];

// Export function để lấy dữ liệu news
export const getNewsData = () => {
  return newsData;
};

const NewsList = () => {
  const [news] = useState(newsData);
  const [selectedNews, setSelectedNews] = useState(null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Sức khỏe': '#2ecc71',
      'Hướng dẫn': '#3498db',
      'Thông tin': '#f39c12',
      'Câu chuyện': '#e74c3c'
    };
    return colors[category] || '#95a5a6';
  };

  if (selectedNews) {
    return (
      <div className="news-detail-container">
        <button className="back-button" onClick={() => setSelectedNews(null)}>
          ← Quay lại danh sách
        </button>

        <article className="news-article">
          <div
            className="news-category"
            style={{ background: getCategoryColor(selectedNews.category) }}
          >
            {selectedNews.category.toUpperCase()}
          </div>

          <h1 className="news-title">{selectedNews.title}</h1>

          <div className="news-meta">
            <span>👤 {selectedNews.author}</span>
            <span>📅 {formatDate(selectedNews.publishDate)}</span>
            <span>👁️ {selectedNews.views.toLocaleString()} lượt xem</span>
          </div>

          <div className="news-thumbnail">📰</div>

          <div className="news-body">
            <p className="news-summary">{selectedNews.summary}</p>
            <p>{selectedNews.content}</p>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>Tin tức</h1>
        <p>Cập nhật những thông tin mới nhất về hiến máu và sức khỏe cộng đồng</p>
      </div>
      
      <div className="news-grid">
        {news.map(item => (
          <div
            key={item.id}
            className="news-card"
            onClick={() => setSelectedNews(item)}
          >
            <div className="card-image">📰</div>

            <div className="card-content">
              <div
                className="card-category"
                style={{ background: getCategoryColor(item.category) }}
              >
                {item.category.toUpperCase()}
              </div>

              <h3>{item.title}</h3>
              <p>{item.summary}</p>

              <div className="card-meta">
                <span>👤 {item.author}</span>
                <span>📅 {formatDate(item.publishDate)}</span>
                <span>👁️ {item.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {news.length === 0 && (
        <div className="no-news">
          <div>📰</div>
          <h3>Không có tin tức nào</h3>
          <p>Hiện tại không có tin tức nào được hiển thị</p>
        </div>
      )}
    </div>
  );
};

export default NewsList;
