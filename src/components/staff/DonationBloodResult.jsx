import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Thêm dòng này
import { donationService } from "../../services/donationService";

function DonationBloodResult() {
  const { id } = useParams(); // <-- Lấy id từ URL

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    donationService.getDonationHistoryById(id)
      .then((response) => {
        setDonation(response.data.result);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết lịch sử hiến máu:", err);
        setError("Không thể tải thông tin lịch sử hiến máu.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  
  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!donation) return <p>Không có dữ liệu để hiển thị.</p>;

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Chi tiết lịch sử hiến máu</h2>

      <p><strong>ID:</strong> {donation.id}</p>
      <p><strong>Ngày hiến máu:</strong> {donation.createdDate}</p>
      <p><strong>Kết quả:</strong> {donation.result}</p>
      <p><strong>Cơ sở tiếp nhận:</strong> {donation.location}</p>
      <p><strong>Nhóm máu:</strong> {donation.bloodType}</p>
      <p><strong>Thể tích (ml):</strong> {donation.volume}</p>
      <p><strong>Ngày hiến tiếp theo:</strong> {donation.nextEligibleDate}</p>

      <p><strong>Người hiến:</strong> {donation.memberName} (ID: {donation.memberId})</p>

      {donation.staff && (
        <p><strong>Nhân viên tiếp nhận:</strong> {donation.staff.name || donation.staff.id}</p>
      )}

      <p><strong>Số giấy chứng nhận:</strong> {donation.certificateNumber || "Chưa cấp"}</p>

      {/* Phiếu hiến máu */}
      {donation.bloodDonationForm ? (
        <div style={{ marginTop: 20 }}>
          <h3>Phiếu hiến máu</h3>
          <p><strong>Họ tên:</strong> {donation.bloodDonationForm.fullName}</p>
          <p><strong>CCCD:</strong> {donation.bloodDonationForm.citizenId}</p>
          <p><strong>Giới tính:</strong> {donation.bloodDonationForm.gender}</p>
          <p><strong>Ngày sinh:</strong> {donation.bloodDonationForm.dateOfBirth}</p>
          <p><strong>Địa chỉ:</strong> {donation.bloodDonationForm.address}</p>
          {/* Thêm thông tin khác nếu cần */}
        </div>
      ) : (
        <p>Không có phiếu hiến máu.</p>
      )}

      {/* Phiếu đăng ký ý định */}
      {donation.bloodIntentFormResponse ? (
        <div style={{ marginTop: 20 }}>
          <h3>Phiếu đăng ký hiến máu</h3>
          <p><strong>Thời gian đăng ký:</strong> {donation.bloodIntentFormResponse.registerTime}</p>
          <p><strong>Địa điểm:</strong> {donation.bloodIntentFormResponse.location}</p>
          <p><strong>Phiên:</strong> {donation.bloodIntentFormResponse.session}</p>
          {/* Thêm thông tin nếu cần */}
        </div>
      ) : (
        <p>Không có phiếu đăng ký trước.</p>
      )}
    </div>
  );
}

export default DonationBloodResult;
