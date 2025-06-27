import React from "react";
import Slider from "react-slick";
import { useFeedbacks } from "../services/FeedbackContext"; // Import FeedbackContext
import "../assets/css/pages/FeedbackList.css";

const FeedbackList = () => {
  const { feedbacks, loading, error } = useFeedbacks(); // Lấy dữ liệu từ FeedbackContext

  return (
    <section className="feedback-section">
      <h3 className="section-title">Phản hồi từ người tham gia</h3>

      {loading ? (
        <p>Đang tải phản hồi...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <p>{feedbacks.length} phản hồi</p>
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
            {feedbacks.map((fb) => (
              <div key={fb.id}>
                <div className="feedback-card">
                  <div className="feedback-content">“{fb.content}”</div>
                  <div className="feedback-user">
                    {fb.member.name !== "Không xác định"
                      ? `- ${fb.member.name}`
                      : "- Ẩn danh"} | ★ {fb.rating}/5
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