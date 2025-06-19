import React, { useState, useEffect } from "react";
import "../../assets/css/components/staff/EventManager.css";

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    status: "UPCOMING",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const mockEvents = [
        {
          id: 1,
          title: "Ngày hội hiến máu nhân đạo 2024",
          description: "Chương trình hiến máu lớn nhất trong năm",
          date: "2024-08-05",
          startTime: "08:00",
          endTime: "16:00",
          location: "Công viên Tao Đàn",
          status: "UPCOMING",
          imageUrl: "",
        },
        {
          id: 2,
          title: "Hiến máu tình nguyện tại trường ĐH",
          description: "Chương trình hiến máu cho sinh viên",
          date: "2024-08-10",
          startTime: "09:00",
          endTime: "15:00",
          location: "Đại học Bách Khoa",
          status: "UPCOMING",
          imageUrl: "",
        },
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Tạo URL xem trước
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });
      if (imageFile) {
        form.append("image", imageFile);
      }

      if (editingEvent) {
        // Update (giả lập)
        const updatedEvents = events.map((event) =>
          event.id === editingEvent.id
            ? {
                ...formData,
                id: editingEvent.id,
                imageUrl: previewUrl || event.imageUrl,
              }
            : event
        );
        setEvents(updatedEvents);
        alert("Cập nhật sự kiện thành công!");
      } else {
        // Create (giả lập)
        const newEvent = {
          ...formData,
          id: Date.now(),
          imageUrl: previewUrl,
        };
        setEvents([newEvent, ...events]);
        alert("Tạo sự kiện thành công!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      status: event.status,
    });
    setPreviewUrl(event.imageUrl || "");
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      try {
        setEvents(events.filter((event) => event.id !== eventId));
        alert("Xóa sự kiện thành công!");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Có lỗi xảy ra khi xóa sự kiện.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      status: "UPCOMING",
    });
    setImageFile(null);
    setPreviewUrl("");
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách sự kiện...</div>;
  }

  return (
    <div className="event-manager">
      <div className="page-header">
        <h1>Quản Lý Sự Kiện</h1>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Thêm Sự Kiện Mới
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingEvent ? "Chỉnh Sửa Sự Kiện" : "Thêm Sự Kiện Mới"}</h2>
              <button className="close-btn" onClick={resetForm}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
              <input
                type="text"
                name="title"
                placeholder="Tiêu đề"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Mô tả"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Địa điểm"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="event-image-preview"
                />
              )}
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="UPCOMING">Sắp diễn ra</option>
                <option value="ONGOING">Đang diễn ra</option>
                <option value="COMPLETED">Đã kết thúc</option>
              </select>
              <button type="submit">
                {editingEvent ? "Cập nhật" : "Tạo sự kiện"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.title}</h3>
              <div
                className={`status-badge status-${event.status.toLowerCase()}`}
              >
                {event.status === "UPCOMING"
                  ? "Sắp diễn ra"
                  : event.status === "ONGOING"
                  ? "Đang diễn ra"
                  : "Đã kết thúc"}
              </div>
            </div>

            <div className="event-content">
              <p className="description">{event.description}</p>
              <div className="event-details">
                <div>
                  <strong>Ngày:</strong> {event.date}
                </div>
                <div>
                  <strong>Giờ:</strong> {event.startTime} - {event.endTime}
                </div>
                <div>
                  <strong>Địa điểm:</strong> {event.location}
                </div>
              </div>
              {event.imageUrl && (
                <img src={event.imageUrl} alt="Event" className="event-image" />
              )}
            </div>

            <div className="event-actions">
              <button onClick={() => handleEdit(event)}>Chỉnh sửa</button>
              <button
                onClick={() => handleDelete(event.id)}
                className="delete-btn"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="no-data">
          <p>Chưa có sự kiện nào. Hãy tạo sự kiện đầu tiên!</p>
        </div>
      )}
    </div>
  );
};

export default EventManager;
