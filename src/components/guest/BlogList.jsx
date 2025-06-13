import React, { useState, useEffect } from 'react';
import './BlogList.css'; // Import your CSS styles

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    // Simulate API call
    const fetchBlogs = async () => {
      setLoading(true);
      // Mock data
      const mockBlogs = [
        {
          id: 1,
          title: 'Lợi ích của việc hiến máu đối với sức khỏe',
          excerpt: 'Hiến máu không chỉ giúp cứu sống người khác mà còn mang lại nhiều lợi ích cho sức khỏe của người hiến...',
          author: 'BS. Nguyễn Văn A',
          publishDate: '2024-06-01',
          category: 'Sức khỏe',
          image: '/images/blog1.jpg',
          readTime: '5 phút'
        },
        {
          id: 2,
          title: 'Chuẩn bị gì trước khi hiến máu?',
          excerpt: 'Để quá trình hiến máu diễn ra thuận lợi và an toàn, bạn cần chuẩn bị một số điều quan trọng...',
          author: 'ThS. Trần Thị B',
          publishDate: '2024-05-28',
          category: 'Hướng dẫn',
          image: '/images/blog2.jpg',
          readTime: '7 phút'
        },
        {
          id: 3,
          title: 'Câu chuyện cảm động về những người hiến máu',
          excerpt: 'Những câu chuyện thật về lòng nhân ái và tinh thần tương thân tương ái của cộng đồng hiến máu...',
          author: 'Biên tập viên',
          publishDate: '2024-05-25',
          category: 'Câu chuyện',
          image: '/images/blog3.jpg',
          readTime: '10 phút'
        }
      ];
      
      setTimeout(() => {
        setBlogs(mockBlogs);
        setLoading(false);
      }, 1000);
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleReadMore = (blogId) => {
    console.log('Đọc thêm blog:', blogId);
    // Navigate to blog detail page
  };

  if (loading) {
    return (
      <div className="blog-list-container">
        <div className="loading">Đang tải danh sách blog...</div>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      <div className="blog-header">
        <h1>Blog Hiến Máu</h1>
        <p>Chia sẻ kiến thức và câu chuyện về hiến máu</p>
      </div>

      <div className="blog-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm blog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="blog-grid">
        {currentBlogs.map(blog => (
          <div key={blog.id} className="blog-card">
            <div className="blog-image">
              <img src={blog.image} alt={blog.title} />
              <div className="blog-category">{blog.category}</div>
            </div>
            
            <div className="blog-content">
              <h3>{blog.title}</h3>
              <p className="blog-excerpt">{blog.excerpt}</p>
              
              <div className="blog-meta">
                <span className="author">Tác giả: {blog.author}</span>
                <span className="read-time">{blog.readTime}</span>
              </div>
              
              <div className="blog-footer">
                <span className="publish-date">
                  {new Date(blog.publishDate).toLocaleDateString('vi-VN')}
                </span>
                <button 
                  className="read-more-btn"
                  onClick={() => handleReadMore(blog.id)}
                >
                  Đọc thêm
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Trước
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Sau
          </button>
        </div>
      )}

      {filteredBlogs.length === 0 && (
        <div className="no-results">
          <p>Không tìm thấy blog nào phù hợp.</p>
        </div>
      )}
    </div>
  );
};

export default BlogList;