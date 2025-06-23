import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import authService from "../services/authService";
import { useAuth } from "../services/AuthContext";
import "../assets/css/pages/FeedbackList.css";

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [formData, setFormData] = useState({ name: "", content: "", rating: 5 });
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load danh sách feedback khi component mount
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await authService.getAllFeedback();
        setFeedbackList(response.data.result || response.data);
      } catch (err) {
        console.error("Không thể tải danh sách feedback:", err);
        setError("Không thể tải danh sách phản hồi.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  // Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gửi feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.sendFeedback(formData);
      setSuccess(true);
      setError("");
      setFormData({ name: "", content: "", rating: 5 });
      setShowForm(false);

      // Reload feedback
      const response = await authService.getAllFeedback();
      setFeedbackList(response.data.result || response.data);
    } catch (err) {
      console.error("Lỗi khi gửi feedback:", err);
      setError("Đã xảy ra lỗi khi gửi feedback.");
      setSuccess(false);
    }
  };

  return (
    <section className="feedback-section">
      <h3 className="section-title">Phản hồi từ người tham gia</h3>

      {/* Trạng thái loading */}
      {loading ? (
        <p>Đang tải phản hồi...</p>
      ) : (
        <>
          <p>{feedbackList.length} phản hồi</p>
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            arrows={false}
            autoplay={true}
            autoplaySpeed={4000}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              { breakpoint: 600, settings: { slidesToShow: 1 } },
            ]}
          >
            {feedbackList.map((fb, idx) => (
              <div key={idx}>
                <div className="feedback-card">
                  <div className="feedback-content">“{fb.content}”</div>
                  <div className="feedback-user">
                    {fb.name ? `- ${fb.name}` : "- Ẩn danh"} | ★ {fb.rating || 5}/5
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </>
      )}

      {/* Nút gửi feedback */}
      {user && !showForm && (
        <div className="show-form-button">
          <button className="btn red" onClick={() => setShowForm(true)}>
            Gửi Feedback
          </button>
        </div>
      )}

      {/* Form gửi feedback */}
      {user && showForm && (
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
    </section>
  );
};

export default FeedbackList;