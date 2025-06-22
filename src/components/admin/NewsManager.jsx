import React, { useState, useEffect } from "react";
import { useEvents } from "../../services/EventContext";

const NewsManager = () => {
  const {
    blogs,
    loading,
    error,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    author: "",
    category: "general",
    publishDate: new Date().toISOString().split("T")[0], // Mặc định ngày hiện tại
    image: null, // Để lưu file ảnh
  });
  const [formError, setFormError] = useState(null);

  // Lấy danh sách blog khi component mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      const blogData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        publishDate: formData.publishDate,
        image: formData.image, // Gửi file ảnh nếu có
      };

      if (editingNews) {
        // Cập nhật blog
        const { success, error: apiError } = await updateBlog(
          editingNews.id,
          blogData
        );
        if (!success) {
          setFormError(apiError || "Không thể cập nhật bài viết");
          return;
        }
        setEditingNews(null);
      } else {
        // Thêm blog mới
        const { success, error: apiError } = await createBlog(blogData);
        if (!success) {
          setFormError(apiError || "Không thể tạo bài viết");
          return;
        }
      }

      // Reset form sau khi thành công
      setFormData({
        title: "",
        summary: "",
        content: "",
        category: "general",
        publishDate: new Date().toISOString().split("T")[0],
        image: null,
      });
      setShowForm(false);
      fetchBlogs(); // Làm mới danh sách
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
      );
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      summary: newsItem.summary || "",
      content: newsItem.content,
      category: newsItem.category,
      publishDate:
        newsItem.publishDate || new Date().toISOString().split("T")[0],
      image: null, // Không tải lại ảnh cũ, người dùng phải chọn lại nếu cần
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tin tức này?")) {
      try {
        const { success, error: apiError } = await deleteBlog(id);
        if (success) {
          fetchBlogs(); // Làm mới danh sách
        } else {
          setFormError(apiError || "Không thể xóa bài viết");
        }
      } catch (err) {
        setFormError("Đã xảy ra lỗi khi xóa. Vui lòng thử lại.");
        console.error("Delete error:", err);
      }
    }
  };

  // Xóa hàm toggleStatus vì DTO không hỗ trợ trường status

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="news-manager">
      <div className="header">
        <h2>Quản lý Tin tức</h2>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          Thêm tin tức mới
        </button>
      </div>

      {formError && <div className="error-message">{formError}</div>}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingNews ? "Sửa tin tức" : "Thêm tin tức mới"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tiêu đề:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Tóm tắt:</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nội dung:</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Danh mục:</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="general">Tin tức chung</option>
                  <option value="campaign">Chiến dịch</option>
                  <option value="announcement">Thông báo</option>
                  <option value="health">Sức khỏe</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ngày xuất bản:</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) =>
                    setFormData({ ...formData, publishDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Ảnh đại diện:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingNews ? "Cập nhật" : "Thêm mới"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingNews(null);
                    setFormData({
                      title: "",
                      summary: "",
                      content: "",
                      category: "general",
                      publishDate: new Date().toISOString().split("T")[0],
                      image: null,
                    });
                    setFormError(null);
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
            <span>{blogs.length}</span>
          </div>
        </div>

        <div className="news-table">
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Ngày xuất bản</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.publishDate}</td>
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
