import React from "react";
import { useParams } from "react-router-dom";
import { useDonation } from "../../services/DonationContext";
import "../../assets/css/member/DonationHistory.css";

const BloodDonationResults = () => {
  const { id } = useParams(); 
  const { donationHistories, loading, error } = useDonation();

  const donation = donationHistories.find((d) => d.id === parseInt(id));

  const isCompleted = (status) =>
    status?.toLowerCase() === "completed" || status?.toLowerCase() === "hoàn thành";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Kết quả hiến máu</h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : !donation ? (
        <p>Không tìm thấy kết quả hiến máu.</p>
      ) : !isCompleted(donation.status) ? (
        <p>Kết quả hiến máu chưa có sẵn do chưa hoàn thành.</p>
      ) : (
        <div className="card-container">
          <div className="card-item">
            <span className="card-label">Ngày hiến máu: </span>
            {donation.date || "Không xác định"}
          </div>
          <div className="card-item">
            <span className="card-label">Nhóm máu: </span>
            {donation.bloodType?.name || "Không rõ"}
          </div>
          <div className="card-item">
            <span className="card-label">Thể tích: </span>
            {donation.volume ? `${donation.volume} ml` : "Không xác định"}
          </div>
          <div className="card-item">
            <span className="card-label">Thành phần máu: </span>
            {donation.component || "Không rõ"}
          </div>
          <div className="card-item">
            <span className="card-label">Kết quả xét nghiệm: </span>
            {donation.testResult || "Không rõ"}
          </div>
          <div className="card-item">
            <span className="card-label">Đánh giá chỉ số: </span>
            {donation.resultMessesge || "Không rõ"}
          </div>
          <div className="card-item">
            <span className="card-label">Địa điểm hiến máu: </span>
            {donation.location || donation.facility || "Không rõ"}
          </div>
          <div className="card-item">
            <span className="card-label">Lần hiến máu tiếp theo: </span>
            {donation.nextEligibleDate || "Không rõ"}
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodDonationResults;
