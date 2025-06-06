import React, { useState, useEffect } from 'react';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    status: 'draft',
    featured: false
  });

  // Simulate fetching news
  useEffect(() => {
    const mockNews = [
      {
        id: 1,
        title: 'Chiến dịch hiến máu mùa hè 2024',
        content: 'Chúng tôi sẽ tổ chức chiến dịch hiến máu lớn...',
        category: 'campaign',
        status: 'published',
        featured: true,
        createdAt: '2024-05-15',
        author: 'Admin'
      },
      {
        id: 2,
        title: 'Thông báo lịch nghỉ lễ',
        content: 'Trung tâm hiến máu sẽ nghỉ lễ...',
        category: 'announcement',
        status: 'published',
        featured: false,
        createdAt: '2024-05-10',
        author: 'Admin'
      }
    ];
    setNews(mockNews);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingNews) {
      // Update existing news
      setNews(news.map(item => 
        item.id === editingNews.id 
          ? { ...formData, id: editingNews.id, createdAt: item.createdAt, author: 'Admin' }
          : item
      ));
      setEditingNews(null);
    } else {
      // Add new news
      const newNews = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        author: 'Admin'
      };
      setNews([...news, newNews]);
    }
    
    setFormData({
      title: '',
      content: '',
      category: 'general',
      status: 'draft',
      featured: false
    });
    setShowForm(false);
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      category: newsItem.category,
      status: newsItem.status,
      featured: newsItem.featured
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tin tức này?')) {
      setNews(news.filter(item => item.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setNews(news.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'published' ? 'draft' : 'published' }
        : item
    ));
  };

  return (
    <div className="news-manager">
      <div className="header">
        <h2>Quản lý Tin tức</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          Thêm tin tức mới
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingNews ? 'Sửa tin tức' : 'Thêm tin tức mới'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tiêu đề:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nội dung:</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Danh mục:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="general">Tin tức chung</option>
                  <option value="campaign">Chiến dịch</option>
                  <option value="announcement">Thông báo</option>
                  <option value="health">Sức khỏe</option>
                </select>
              </div>

              <div className="form-group">
                <label>Trạng thái:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  Tin nổi bật
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingNews ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingNews(null);
                    setFormData({
                      title: '',
                      content: '',
                      category: 'general',
                      status: 'draft',
                      featured: false
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="news-list">
        <div className="news-stats">
          <div className="stat-card">
            <h4>Tổng tin tức</h4>
            <span>{news.length}</span>
          </div>
          <div className="stat-card">
            <h4>Đã xuất bản</h4>
            <span>{news.filter(n => n.status === 'published').length}</span>
          </div>
          <div className="stat-card">
            <h4>Bản nháp</h4>
            <span>{news.filter(n => n.status === 'draft').length}</span>
          </div>
        </div>

        <div className="news-table">
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Nổi bật</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {news.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>
                    <span 
                      className={`status ${item.status}`}
                      onClick={() => toggleStatus(item.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td>{item.featured ? '⭐' : ''}</td>
                  <td>{item.createdAt}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(item)}
                      className="btn btn-sm btn-primary"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsManager;