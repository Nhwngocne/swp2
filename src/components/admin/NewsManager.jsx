// ✅ Tổng hợp: NewsManager.jsx with CKEditor + Upload ảnh tự động

import React, { useState, useEffect } from "react";
import { useEvents } from "../../services/EventContext";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
    publishDate: new Date().toISOString().split("T")[0],
    image: null,
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      let imageUrl = "";
      if (formData.image) {
        const imageForm = new FormData();
        imageForm.append("file", formData.image);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: imageForm,
        });
        const result = await res.json();
        imageUrl = result.url;
      }

      const blogData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        publishDate: formData.publishDate,
        image: imageUrl,
      };

      const response = editingNews
        ? await updateBlog(editingNews.id, blogData)
        : await createBlog(blogData);

      if (!response.success) {
        setFormError(response.error || "Lỗi xử lý bài viết");
        return;
      }

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
      fetchBlogs();
    } catch (err) {
      setFormError("Lỗi gửi dữ liệu. Vui lòng thử lại.");
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setShowForm(true);
    setFormData({
      title: item.title,
      summary: item.summary,
      content: item.content,
      author: item.author,
      category: item.category,
      publishDate: item.publishDate,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      const res = await deleteBlog(id);
      if (!res.success) setFormError(res.error);
      else fetchBlogs();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Quản lý Tin tức</h3>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>➕ Thêm tin tức</button>
      </div>

      {formError && <div className="alert alert-danger">{formError}</div>}

      {showForm && (
        <div className="card p-4 mb-4">
          <h5>{editingNews ? "Sửa bài viết" : "Thêm bài viết"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label>Tiêu đề</label>
                <input className="form-control" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label>Tác giả</label>
                <input className="form-control" required value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
              </div>
              <div className="col-12">
                <label>Tóm tắt</label>
                <textarea className="form-control" rows="2" value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} />
              </div>
              <div className="col-12">
                <label>Nội dung</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={formData.content}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setFormData({ ...formData, content: data });
                  }}
                />
              </div>
              <div className="col-md-4">
                <label>Danh mục</label>
                <select className="form-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="general">Tin chung</option>
                  <option value="health">Sức khỏe</option>
                  <option value="campaign">Chiến dịch</option>
                  <option value="announcement">Thông báo</option>
                </select>
              </div>
              <div className="col-md-4">
                <label>Ngày xuất bản</label>
                <input className="form-control" type="date" value={formData.publishDate} onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label>Ảnh đại diện</label>
                <input className="form-control" type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
              </div>
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-primary">{editingNews ? "Cập nhật" : "Đăng bài"}</button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowForm(false);
                  setEditingNews(null);
                }}>Hủy</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Ngày</th>
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
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning" onClick={() => handleEdit(item)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsManager;