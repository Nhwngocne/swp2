import React, { useEffect } from "react";
import Slider from "react-slick";
import { useFeedbacks } from "../services/FeedbackContext";
import "../assets/css/pages/FeedbackList.css";

const FeedbackList = () => {
  const { feedbacks, loading, error, fetchFeedbacks } = useFeedbacks();

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const recentFeedbacks = feedbacks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <section className="feedback-section">
      <h3 className="section-title">Phản hồi nổi bật</h3>
      {loading ? (
        <p>Đang tải phản hồi...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : recentFeedbacks.length === 0 ? (
        <p>Chưa có phản hồi nào.</p>
      ) : (
        <>
          <p>{recentFeedbacks.length} phản hồi nổi bật</p>
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
            {recentFeedbacks.map((fb, idx) => (
              <div key={idx}>
                <div className="feedback-card">
                  <div className="feedback-content">“{fb.content}”</div>
                  <div className="feedback-user">
                    {fb.member.name ? `- ${fb.member.name}` : "- Ẩn danh"} | ★ {fb.rating || 5}/5
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

export default FeedbackList; // Export component đúng cách