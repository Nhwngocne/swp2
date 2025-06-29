import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDonation } from "../../services/DonationContext";
import FeedbackForm from "../../pages/FeedbackForm";
import "../../assets/css/member/DonationHistory.css";

const DonationHistory = () => {
  const { donationHistories, loading, error } = useDonation();
  const [selectedDonation, setSelectedDonation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("DonationHistory useEffect chạy:", loading, error);
  }, [loading, error]);

  const isCompleted = (status) =>
    status?.toLowerCase() === "completed" || status?.toLowerCase() === "hoàn thành";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Lịch sử hiến máu của bạn</h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : donationHistories.length === 0 ? (
        <p>Không có lịch sử hiến máu nào.</p>
      ) : (
        <>
          {donationHistories.map((donation) => (
            <div key={donation.id} className="card-container">
              <div className="card-item">
                <span className="card-label">Trạng thái: </span>
                <span
                  className={`card-badge ${isCompleted(donation.status) ? "completed-badge" : "pending-badge"
                    }`}
                >
                  {donation.status || "Không xác định"}
                </span>
              </div>

              <div className="card-item">
                <span className="card-label">Ngày hiến máu: </span>
                {donation.date || "Không xác định"}
              </div>
              <div className="card-item">
                <span className="card-label">Lượng máu đã hiến: </span>
                {donation.volume ? `${donation.volume} ml` : "Không xác định"}
              </div>
              <div className="card-item">
                <span className="card-label">Cơ sở tiếp nhận máu: </span>
                {donation.facility || "Không rõ"}
              </div>
              <div className="card-item">
                <span className="card-label">Địa chỉ: </span>
                {donation.address || "Không rõ"}
              </div>

              {isCompleted(donation.status) && (
                <>
                  <div className="card-item flex-buttons">
                    <button
                      className="view-result-btn"
                      onClick={() => navigate(`/donationBloodResult/${donation.id}`)}
                    >
                      Xem kết quả
                    </button>
                    <button
                      className="feedback-btn"
                      onClick={() =>
                        setSelectedDonation(
                          selectedDonation?.id === donation.id ? null : donation
                        )
                      }
                    >
                      {selectedDonation?.id === donation.id ? "Đóng đánh giá" : "Gửi đánh giá"}
                    </button>
                  </div>

                  {selectedDonation?.id === donation.id && (
                    <div className="card-item">
                      <FeedbackForm
                        donation={selectedDonation}
                        onClose={() => setSelectedDonation(null)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default DonationHistory;
