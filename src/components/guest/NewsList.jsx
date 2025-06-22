import React, { useState, useEffect } from "react";
import "../../assets/css/components/guest/NewsList.css";
import { useEvents } from "../../services//EventContext";

const NewsList = () => {
  const { blogs, loading, error, fetchBlogs, getBlogById } = useEvents();
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetchBlogs(); // Gọi API để lấy danh sách blog khi component mount
  }, [fetchBlogs]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Sức khỏe": "#2ecc71",
      "Hướng dẫn": "#3498db",
      "Thông tin": "#f39c12",
      "Câu chuyện": "#e74c3c",
    };
    return colors[category] || "#95a5a6";
  };

  const handleBlogClick = async (blogId) => {
    const { success, blog } = await getBlogById(blogId);
    if (success) {
      setSelectedNews(blog);
    } else {
      console.error("Failed to fetch blog details");
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

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

          <img
            src={selectedNews.image}
            alt={selectedNews.title}
            className="news-thumbnail"
            onError={(e) => (e.target.src = "/assets/blog-default.jpg")} // Fallback nếu hình ảnh không tải được
          />

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
        {blogs.map((item) => (
          <div
            key={item.id}
            className="news-card"
            onClick={() => handleBlogClick(item.id)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="card-image"
              onError={(e) => (e.target.src = "/assets/blog-default.jpg")} // Fallback nếu hình ảnh không tải được
            />

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
                <span>👁️ {item.views.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
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