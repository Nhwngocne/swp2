import React, { useState } from 'react';

const NewsList = () => {
  const [news] = useState([
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
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState(null);

  const categories = ['all', 'Sức khỏe', 'Hướng dẫn', 'Thông tin', 'Câu chuyện'];

  const filteredNews = news.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

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
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => setSelectedNews(null)}
          style={{
            padding: '10px 20px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          ← Quay lại danh sách
        </button>

        <article style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 15px',
            background: getCategoryColor(selectedNews.category),
            color: 'white',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            {selectedNews.category.toUpperCase()}
          </div>

          <h1 style={{
            fontSize: '2rem',
            color: '#2c3e50',
            marginBottom: '20px',
            lineHeight: '1.3'
          }}>
            {selectedNews.title}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '1px solid #eee',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: '#666' }}>
              👤 {selectedNews.author}
            </span>
            <span style={{ color: '#666' }}>
              📅 {formatDate(selectedNews.publishDate)}
            </span>
            <span style={{ color: '#666' }}>
              👁️ {selectedNews.views.toLocaleString()} lượt xem
            </span>
          </div>

          <div style={{
            height: '300px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '4rem',
            marginBottom: '30px'
          }}>
            📰
          </div>

          <div style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#2c3e50'
          }}>
            <p style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {selectedNews.summary}
            </p>
            <p>{selectedNews.content}</p>
          </div>
        </article>
      </div>
    );
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
          Tin tức
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#666',
          lineHeight: '1.6'
        }}>
          Cập nhật những thông tin mới nhất về hiến máu và sức khỏe cộng đồng
        </p>
      </div>

      {/* Category Filter */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '8px 16px',
              border: selectedCategory === category ? '2px solid #e74c3c' : '2px solid #ddd',
              background: selectedCategory === category ? '#e74c3c' : 'white',
              color: selectedCategory === category ? 'white' : '#333',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
          >
            {category === 'all' ? 'Tất cả' : category}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '25px'
      }}>
        {filteredNews.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedNews(item)}
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
            {/* News Image */}
            <div style={{
              height: '200px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '3rem'
            }}>
              📰
            </div>

            {/* News Content */}
            <div style={{ padding: '20px' }}>
              {/* Category Badge */}
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: getCategoryColor(item.category),
                color: 'white',
                borderRadius: '15px',
                fontSize: '11px',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}>
                {item.category.toUpperCase()}
              </div>

              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: '15px',
                lineHeight: '1.4'
              }}>
                {item.title}
              </h3>

              <p style={{
                color: '#7f8c8d',
                lineHeight: '1.5',
                marginBottom: '20px'
              }}>
                {item.summary}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '15px',
                borderTop: '1px solid #eee',
                fontSize: '13px',
                color: '#95a5a6'
              }}>
                <span>👤 {item.author}</span>
                <span>📅 {formatDate(item.publishDate)}</span>
                <span>👁️ {item.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📰</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
            Không có tin tức nào
          </h3>
          <p style={{ color: '#7f8c8d' }}>
            Hiện tại không có tin tức nào trong danh mục này
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsList;