import React, { useState, useEffect } from "react";
import { useEvents } from "../../services/EventContext";
import MyCKEditor from "../../services/MyCKEditor";
import "../../assets/css/components/admin/NewsManager.css";

const NewsManager = () => {
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
    image: "", // URL string
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    let imageUrl = formData.image;

    // Nếu chọn file hình -> upload trước để lấy URL
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
    setFormData({ ...item, image: "" }); // reset file ảnh khi chỉnh sửa
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>📋 Quản lý tin tức</h4>
        <button className="btn btn-danger" onClick={() => setShowForm(true)}>
          ➕ Tạo Mới
        </button>
      </div>

      {!showForm && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>STT</th>
                <th>Hình</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Ngày xuất bản</th>
                <th>Lượt xem</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {item.image && (
                      <img src={item.image} alt="thumb" width="50" />
                    )}
                  </td>
                  <td>
                    <a href={`/news/${item.id}`}>{item.title}</a>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.publishDate}</td>
                  <td>{item.views || 0}</td>
                  <td className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(item)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteBlog(item.id)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-8">
            <div className="card p-3">
              <h5>📝 {editing ? "Sửa bài viết" : "Thêm bài viết"}</h5>

              <div className="mb-3">
                <label>Hình đại diện</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              </div>

              <div className="mb-2">
                <label>Tiêu đề *</label>
                <input
                  className="form-control"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <label>Mô tả ngắn</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="mb-2">
                <label>Thông tin chi tiết</label>
                <MyCKEditor
                  value={formData.content}
                  onChange={(data) =>
                    setFormData({ ...formData, content: data })
                  }
                />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3">
              <label>Danh mục tin tức</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Tin công nghệ">Tin công nghệ</option>
                <option value="Tin sức khỏe">Tin sức khỏe</option>
              </select>

              <label className="mt-2">Ngày xuất bản</label>
              <input
                className="form-control"
                type="date"
                value={formData.publishDate}
                onChange={(e) =>
                  setFormData({ ...formData, publishDate: e.target.value })
                }
              />

              <label className="mt-2">Tác giả</label>
              <input
                className="form-control"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />

              <div className="form-check mt-3">
                <input
                  className="form-check-input"
                  type="radio"
                  checked
                  readOnly
                />
                <label className="form-check-label">Hiển thị</label>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-primary" type="submit">
                  💾 Lưu
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                >
                  ❌ Hủy
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {formError && <div className="alert alert-danger mt-3">{formError}</div>}
    </div>
  );
};

export default NewsManager;