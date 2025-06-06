import React, { useState, useEffect } from 'react';

const ForumManager = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filter, setFilter] = useState('all');

  // Simulate fetching posts
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        title: 'Làm thế nào để chuẩn bị trước khi hiến máu?',
        author: 'nguyen_van_a',
        category: 'question',
        status: 'approved',
        replies: 12,
        createdAt: '2024-05-15T10:30:00',
        content: 'Tôi là người mới, muốn hỏi về việc chuẩn bị trước khi hiến máu...',
        reported: false,
        views: 245
      },
      {
        id: 2,
        title: 'Chia sẻ kinh nghiệm hiến máu lần đầu',
        author: 'tran_thi_b',
        category: 'experience',
        status: 'approved',
        replies: 8,
        createdAt: '2024-05-14T14:20:00',
        content: 'Hôm qua tôi đã hiến máu lần đầu tiên, muốn chia sẻ trải nghiệm...',
        reported: false,
        views: 189
      },
      {
        id: 3,
        title: 'Bài viết có nội dung không phù hợp',
        author: 'user123',
        category: 'discussion',
        status: 'pending',
        replies: 2,
        createdAt: '2024-05-13T09:15:00',
        content: 'Nội dung không phù hợp với quy định diễn đàn...',
        reported: true,
        views: 56
      }
    ];
    setPosts(mockPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'pending') return post.status === 'pending';
    if (filter === 'reported') return post.reported;
    if (filter === 'approved') return post.status === 'approved';
    return true;
  });

  const handleApprove = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status: 'approved' } : post
    ));
  };

  const handleReject = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status: 'rejected' } : post
    ));
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const handleResolveReport = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, reported: false } : post
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="forum-manager">
      <div className="header">
        <h2>Quản lý Diễn đàn</h2>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Tất cả ({posts.length})
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Chờ duyệt ({posts.filter(p => p.status === 'pending').length})
          </button>
          <button 
            className={filter === 'reported' ? 'active' : ''}
            onClick={() => setFilter('reported')}
          >
            Báo cáo ({posts.filter(p => p.reported).length})
          </button>
          <button 
            className={filter === 'approved' ? 'active' : ''}
            onClick={() => setFilter('approved')}
          >
            Đã duyệt ({posts.filter(p => p.status === 'approved').length})
          </button>
        </div>
      </div>

      <div className="forum-stats">
        <div className="stat-card">
          <h4>Tổng bài viết</h4>
          <span>{posts.length}</span>
        </div>
        <div className="stat-card">
          <h4>Chờ duyệt</h4>
          <span>{posts.filter(p => p.status === 'pending').length}</span>
        </div>
        <div className="stat-card">
          <h4>Báo cáo</h4>
          <span>{posts.filter(p => p.reported).length}</span>
        </div>
        <div className="stat-card">
          <h4>Hoạt động hôm nay</h4>
          <span>15</span>
        </div>
      </div>

      <div className="posts-container">
        <div className="posts-list">
          <div className="posts-table">
            <table>
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Tác giả</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                  <th>Phản hồi</th>
                  <th>Lượt xem</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => (
                  <tr key={post.id} className={post.reported ? 'reported' : ''}>
                    <td>
                      <div className="post-title">
                        {post.reported && <span className="report-flag">🚩</span>}
                        <span 
                          onClick={() => setSelectedPost(post)}
                          style={{ cursor: 'pointer', color: 'blue' }}
                        >
                          {post.title}
                        </span>
                      </div>
                    </td>
                    <td>{post.author}</td>
                    <td>{post.category}</td>
                    <td>
                      <span 
                        className="status-badge" 
                        style={{ color: getStatusColor(post.status) }}
                      >
                        {post.status === 'approved' ? 'Đã duyệt' : 
                         post.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                      </span>
                    </td>
                    <td>{post.replies}</td>
                    <td>{post.views}</td>
                    <td>{formatDate(post.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        {post.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(post.id)}
                              className="btn btn-sm btn-success"
                            >
                              Duyệt
                            </button>
                            <button 
                              onClick={() => handleReject(post.id)}
                              className="btn btn-sm btn-warning"
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        {post.reported && (
                          <button 
                            onClick={() => handleResolveReport(post.id)}
                            className="btn btn-sm btn-info"
                          >
                            Xử lý
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedPost && (
          <div className="post-detail-overlay">
            <div className="post-detail">
              <div className="post-header">
                <h3>{selectedPost.title}</h3>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="close-btn"
                >
                  ×
                </button>
              </div>
              <div className="post-meta">
                <span>Tác giả: {selectedPost.author}</span>
                <span>Danh mục: {selectedPost.category}</span>
                <span>Ngày tạo: {formatDate(selectedPost.createdAt)}</span>
                <span>Lượt xem: {selectedPost.views}</span>
              </div>
              <div className="post-content">
                <p>{selectedPost.content}</p>
              </div>
              <div className="post-actions">
                {selectedPost.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => {
                        handleApprove(selectedPost.id);
                        setSelectedPost(null);
                      }}
                      className="btn btn-success"
                    >
                      Duyệt bài viết
                    </button>
                    <button 
                      onClick={() => {
                        handleReject(selectedPost.id);
                        setSelectedPost(null);
                      }}
                      className="btn btn-warning"
                    >
                      Từ chối
                    </button>
                  </>
                )}
                {selectedPost.reported && (
                  <button 
                    onClick={() => {
                      handleResolveReport(selectedPost.id);
                      setSelectedPost(null);
                    }}
                    className="btn btn-info"
                  >
                    Đã xử lý báo cáo
                  </button>
                )}
                <button 
                  onClick={() => {
                    handleDelete(selectedPost.id);
                    setSelectedPost(null);
                  }}
                  className="btn btn-danger"
                >
                  Xóa bài viết
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumManager;