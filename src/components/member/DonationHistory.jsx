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
    console.log("DonationHistory useEffect chạy:", {
      loading,
      error,
      donationHistories,
    });
  }, [loading, error, donationHistories]);

  const isCompleted = (result) => result?.toLowerCase() === "đạt";

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không rõ";
    // Xử lý định dạng dd-mm-yyyy
    if (typeof dateStr === "string" && dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = dateStr.split("-");
      const formattedDate = new Date(`${year}-${month}-${day}`);
      return isNaN(formattedDate) ? "Không xác định" : formattedDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    // Xử lý các định dạng khác (ISO hoặc null)
    const date = new Date(dateStr);
    return isNaN(date) ? "Không xác định" : date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
                <span className="card-label">Kết quả: </span>
                <span
                  className={`card-badge ${isCompleted(donation.result) ? "completed-badge" : "pending-badge"}`}
                >
                  {donation.result || "Không xác định"}
                </span>
              </div>

              <div className="card-item">
                <span className="card-label">Ngày hiến máu: </span>
                {formatDate(donation.createdDate)}
              </div>
              <div className="card-item">
                <span className="card-label">Lượng máu đã hiến: </span>
                {donation.volume ? `${donation.volume} ml` : "Không xác định"}
              </div>
              <div className="card-item">
                <span className="card-label">Loại máu: </span>
                {donation.bloodType || "Không rõ"}
              </div>
              <div className="card-item">
                <span className="card-label">Cơ sở tiếp nhận máu: </span>
                {donation.location || "Không rõ"}
              </div>
              <div className="card-item">
                <span className="card-label">Ngày có thể hiến lại: </span>
                {formatDate(donation.nextEligibleDate)}
              </div>

              {isCompleted(donation.result) && (
                <>
                  <div className="card-item flex-buttons">
                    <button
                      className="view-result-btn"
                      onClick={() => navigate(`/donation-result/${donation.id}`)}
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