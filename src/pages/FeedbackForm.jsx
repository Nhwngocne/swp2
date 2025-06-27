import React, { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useFeedbacks } from "../services/FeedbackContext"; // Import FeedbackContext
import "../assets/css/pages/FeedbackList.css";

const FeedbackForm = ({ onFeedbackSent }) => {
  const [formData, setFormData] = useState({ content: "", rating: 5 }); // Loại bỏ trường name
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { createFeedback } = useFeedbacks(); // Lấy createFeedback từ FeedbackContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createFeedback(formData); // Gọi createFeedback từ context
      if (response.success) {
        setSuccess(true);
        setError("");
        setFormData({ content: "", rating: 5 });
        setShowForm(false);
        if (onFeedbackSent) onFeedbackSent(); // Gọi callback nếu có
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error("Lỗi khi gửi feedback:", err);
      setError(err.message || "Đã xảy ra lỗi khi gửi feedback.");
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
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="close-button"
            >
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