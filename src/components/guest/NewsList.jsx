import React, { useState, useEffect } from "react";
import "../../assets/css/components/guest/NewsList.css";
import { useEvents } from "../../services/EventContext";
import Pagination from "../../pages/Pagination";
const NewsList = () => {
  const { blogs, loading, error, fetchBlogs, getBlogById } = useEvents();
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("vi-VN");

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
    if (success) setSelectedNews(blog);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  if (selectedNews) {
    return (
      <div className="news-detail-container">
        <button className="back-button" onClick={() => setSelectedNews(null)}>← Quay lại danh sách</button>
        <article className="news-article">
          <div className="news-category" style={{ background: getCategoryColor(selectedNews.category) }}>
            {selectedNews.category.toUpperCase()}
          </div>
          <h1 className="news-title">{selectedNews.title}</h1>
          <div className="news-meta">
            <span>👤 {selectedNews.author}</span>
            <span>📅 {formatDate(selectedNews.publishDate)}</span>
            <span>👁️ {selectedNews.views.toLocaleString()} lượt xem</span>
          </div>
          <img src={selectedNews.image} alt={selectedNews.title} className="news-thumbnail"
               onError={(e) => (e.target.src = "/assets/blog-default.jpg")} />
          <div className="news-body">
            <p className="news-summary">{selectedNews.summary}</p>
            <p>{selectedNews.content}</p>
          </div>
        </article>
      </div>
    );
  }

  const displayedBlogs = blogs.slice(1);
  const totalPages = Math.ceil(displayedBlogs.length / itemsPerPage);
  const currentBlogs = displayedBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="news-container">
      <div className="featured-news">
        {blogs.length > 0 && (
          <>
            <img
              src={blogs[0].image}
              alt={blogs[0].title}
              className="featured-image"
              onClick={() => handleBlogClick(blogs[0].id)}
              onError={(e) => (e.target.src = "/assets/blog-default.jpg")}
            />
            <div className="featured-content" onClick={() => handleBlogClick(blogs[0].id)}>
              <h2>{blogs[0].title}</h2>
              <p>{blogs[0].summary}</p>
              <div className="featured-meta">
                <span>Posted by {blogs[0].author}</span>
                <span>👁️ {blogs[0].views.toLocaleString()}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <h2 className="latest-news-title">Latest news</h2>
      <div className="news-grid">
        {currentBlogs.map((item) => (
          <div key={item.id} className="news-card" onClick={() => handleBlogClick(item.id)}>
            <img
              src={item.image}
              alt={item.title}
              className="card-image"
              onError={(e) => (e.target.src = "/assets/blog-default.jpg")}
            />
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
    </div>
  );
};

export default NewsList;