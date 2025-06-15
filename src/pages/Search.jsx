import React, { useState } from 'react';
import '../assets/css/pages/Search.css'; //
const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data
  const mockData = {
    events: [
      { id: 1, title: 'Hiến máu nhân đạo tại Bệnh viện Chợ Rẫy', date: '2024-06-15', location: 'TP.HCM', type: 'event' },
      { id: 2, title: 'Ngày hội hiến máu tình nguyện', date: '2024-06-20', location: 'Hà Nội', type: 'event' },
    ],
    news: [
      { id: 3, title: 'Tầm quan trọng của việc hiến máu định kỳ', content: 'Hiến máu định kỳ giúp...', type: 'news' },
      { id: 4, title: 'Những lưu ý khi hiến máu lần đầu', content: 'Khi hiến máu lần đầu...', type: 'news' },
    ],
    blogs: [
      { id: 5, title: 'Câu chuyện của một người hiến máu tình nguyện', author: 'Nguyễn Văn A', type: 'blog' },
      { id: 6, title: 'Lợi ích sức khỏe từ việc hiến máu', author: 'Trần Thị B', type: 'blog' },
    ]
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    setTimeout(() => {
      let searchResults = [];
      
      if (searchType === 'all' || searchType === 'events') {
        searchResults = [...searchResults, ...mockData.events.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )];
      }
      
      if (searchType === 'all' || searchType === 'news') {
        searchResults = [...searchResults, ...mockData.news.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )];
      }
      
      if (searchType === 'all' || searchType === 'blogs') {
        searchResults = [...searchResults, ...mockData.blogs.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )];
      }
      
      setResults(searchResults);
      setIsSearching(false);
    }, 500);
  };

  const renderResult = (item) => {
    switch(item.type) {
      case 'event':
        return (
          <div key={item.id} className="search-result event-result">
            <div className="result-type">Sự kiện</div>
            <h3>{item.title}</h3>
            <p><strong>Ngày:</strong> {item.date}</p>
            <p><strong>Địa điểm:</strong> {item.location}</p>
          </div>
        );
      case 'news':
        return (
          <div key={item.id} className="search-result news-result">
            <div className="result-type">Tin tức</div>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </div>
        );
      case 'blog':
        return (
          <div key={item.id} className="search-result blog-result">
            <div className="result-type">Blog</div>
            <h3>{item.title}</h3>
            <p><strong>Tác giả:</strong> {item.author}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Tìm kiếm</h1>
        <p>Tìm kiếm sự kiện, tin tức và bài viết về hiến máu</p>
      </div>

      <div className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Nhập từ khóa tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={!searchTerm.trim()}>
            {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </div>

        <div className="search-filters">
          <label>
            <input
              type="radio"
              value="all"
              checked={searchType === 'all'}
              onChange={(e) => setSearchType(e.target.value)}
            />
            Tất cả
          </label>
          <label>
            <input
              type="radio"
              value="events"
              checked={searchType === 'events'}
              onChange={(e) => setSearchType(e.target.value)}
            />
            Sự kiện
          </label>
          <label>
            <input
              type="radio"
              value="news"
              checked={searchType === 'news'}
              onChange={(e) => setSearchType(e.target.value)}
            />
            Tin tức
          </label>
          <label>
            <input
              type="radio"
              value="blogs"
              checked={searchType === 'blogs'}
              onChange={(e) => setSearchType(e.target.value)}
            />
            Blog
          </label>
        </div>
      </div>

      <div className="search-results">
        {isSearching && (
          <div className="loading">Đang tìm kiếm...</div>
        )}
        
        {!isSearching && results.length > 0 && (
          <>
            <h2>Kết quả tìm kiếm ({results.length})</h2>
            {results.map(renderResult)}
          </>
        )}
        
        {!isSearching && searchTerm && results.length === 0 && (
          <div className="no-results">
            <p>Không tìm thấy kết quả nào cho "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;