import React, { useState, useEffect } from "react";
import { useEvents } from "../../services/EventContext";
import MyCKEditor from "../../services/MyCKEditor";
import { useNavigate } from "react-router-dom"; 
import "../../assets/css/components/admin/NewsManager.css"; // ✅ thêm CSS nếu cần
const NewsManager = () => {
  const navigate = useNavigate();
  const {
    blogs,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  } = useEvents();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    author: "",
    category: "Tin công nghệ",
    publishDate: new Date().toISOString().split("T")[0],
    image: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    let imageUrl = formData.image;

    if (formData.image && formData.image instanceof File) {
      try {
        const formImage = new FormData();
        formImage.append("upload", formData.image);

        const res = await fetch("http://localhost:8080/swp391/blogs/upload-image", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formImage,
        });

        const data = await res.json();
        imageUrl = data.url;
      } catch (error) {
        console.error("Image upload failed:", error);
        setFormError("Không thể upload ảnh.");
        return;
      }
    }

    const blog = {
      ...formData,
      image: imageUrl,
    };

    const response = editing
      ? await updateBlog(editing.id, blog)
      : await createBlog(blog);

    if (!response.success) {
      setFormError(response.error);
    } else {
      fetchBlogs();
      setShowForm(false);
      setEditing(null);
      setFormData({
        title: "",
        summary: "",
        content: "",
        author: "",
        category: "Tin công nghệ",
        publishDate: new Date().toISOString().split("T")[0],
        image: "",
      });
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
    setFormData({ ...item, image: "" });
  };

  return (
    <div className="news-container">
      <div className="header">
        <h2>📋 Quản lý tin tức</h2>
        <button className="create-btn" onClick={() => setShowForm(true)}>
          ➕ Tạo Mới
        </button>
      </div>

      {!showForm && (
        <div className="table-responsive">
          <table className="news-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Hình</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Ngày xuất bản</th>
                <th>Lượt xem</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {item.image && (
                      <img
                        src={item.image}
                        alt="thumb"
                        className="thumb-img"
                      />
                    )}
                  </td>
                  <td>
                    <span
                      onClick={() => navigate(`/news/${item.id}`)}
                      className="news-link"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i>
                      {item.title}
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td>{new Date(item.publishDate).toLocaleDateString("vi-VN")}</td>
                  <td>{item.views || 0}</td>
                  <td className="text-center">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        title="Chỉnh sửa"
                        onClick={() => handleEdit(item)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Xoá bài"
                        onClick={() => deleteBlog(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="news-form">
          <div className="form-left">
            <div className="form-group">
              <label>Tiêu đề tin tức *</label>
              <input className="form-control" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Mô tả ngắn</label>
              <textarea className="form-control" rows={2} value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })}></textarea>
            </div>
            <div className="form-group">
              <label>Thông tin chi tiết</label>
              <MyCKEditor value={formData.content} onChange={(data) => setFormData({ ...formData, content: data })} />
            </div>
          </div>
          <div className="form-right">
            <div className="form-image-upload">
              <label>Hình đại diện</label>
              <input
                className="form-control"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFormData({ ...formData, image: e.target.files[0] });
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label>Danh mục tin tức</label>
              <select className="form-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="Tin công nghệ">Tin công nghệ</option>
                <option value="Tin sức khỏe">Tin sức khỏe</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ngày xuất bản</label>
              <input type="date" className="form-control" value={formData.publishDate} onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Tác giả</label>
              <input className="form-control" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
            </div>
            <div className="form-check mt-2">
              <input className="form-check-input" type="radio" checked readOnly />
              <label className="form-check-label">Hiển thị</label>
            </div>
            <div className="button-group mt-3">
              <button type="submit" className="save-cancel-btn btn-save">
                <div className="btn-text">Lưu</div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
              </button>
              <button
                type="button"
                className="save-cancel-btn btn-cancel"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                <div className="btn-text">Hủy</div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.29 13.29a1 1 0 0 1-1.41 1.41L12 13.41l-2.88 2.88a1 1 0 0 1-1.41-1.41L10.59 12 7.71 9.12a1 1 0 1 1 1.41-1.41L12 10.59l2.88-2.88a1 1 0 1 1 1.41 1.41L13.41 12l2.88 2.88z" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      )}

      {formError && <div className="alert alert-danger mt-3">{formError}</div>}
    </div>
  );
};

export default NewsManager;