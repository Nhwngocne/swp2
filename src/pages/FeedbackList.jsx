import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import authService from "../services/authService";
import "../assets/css/pages/FeedbackList.css";

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await authService.getAllFeedback();
        setFeedbackList(response.data.result || response.data || []);
      } catch (err) {
        console.error("Không thể tải danh sách feedback:", err);
        setError("Không thể tải danh sách phản hồi.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <section className="feedback-section">
      <h3 className="section-title">Phản hồi từ người tham gia</h3>

      {loading ? (
        <p>Đang tải phản hồi...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
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
    </section>
  );
};

export default FeedbackList;
