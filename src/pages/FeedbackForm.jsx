import React, { useState } from "react";
import authService from "../services/authService";
import { useAuth } from "../services/AuthContext";
import "../assets/css/pages/FeedbackList.css";

const FeedbackForm = ({ onFeedbackSent }) => {
  const [formData, setFormData] = useState({ name: "", content: "", rating: 5 });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.sendFeedback(formData);
      setSuccess(true);
      setError("");
      setFormData({ name: "", content: "", rating: 5 });
      setShowForm(false);
      if (onFeedbackSent) onFeedbackSent(); // optional callback
    } catch (err) {
      console.error("Lỗi khi gửi feedback:", err);
      setError("Đã xảy ra lỗi khi gửi feedback.");
      setSuccess(false);
    }
  };

  if (!user) return null;

  return (
    <div className="feedback-form-container">
      {!showForm ? (
        <div className="show-form-button">
          <button className="btn red" onClick={() => setShowForm(true)}>
            Gửi Feedback
          </button>
        </div>
      ) : (
        <div className="add-feedback-form">
          <h4>Gửi Feedback của bạn</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Tên của bạn"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="content"
              placeholder="Nội dung feedback"
              value={formData.content}
              onChange={handleChange}
              required
            />
            <label>Đánh giá:</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
            >
              <option value={5}>5 - Rất hài lòng</option>
              <option value={4}>4 - Hài lòng</option>
              <option value={3}>3 - Bình thường</option>
              <option value={2}>2 - Không hài lòng</option>
              <option value={1}>1 - Rất tệ</option>
            </select>
            <button type="submit">Gửi Feedback</button>
            <button type="button" onClick={() => setShowForm(false)} className="close-button">
              Đóng
            </button>
            {success && <p className="success-message">Gửi thành công!</p>}
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
