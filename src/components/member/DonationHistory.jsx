import React, { useEffect } from "react";
import { useDonation } from "../../services/DonationContext";
import FeedbackForm from "../../pages/FeedbackForm";

const DonationHistory = () => {
  const { donationHistories, loading, error } = useDonation();

  useEffect(() => {
    console.log("DonationHistory useEffect chạy, loading:", loading, "error:", error);
  }, [loading, error]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Lịch sử hiến máu của bạn</h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : donationHistories.length === 0 ? (
        <p>Không có lịch sử hiến máu nào.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-red-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Thành phần</th>
              <th className="border p-2">Ngày hiến</th>
              <th className="border p-2">Thể tích</th>
              <th className="border p-2">Nhóm máu</th>
              <th className="border p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {donationHistories.map((donation, index) => (
              <tr key={donation.id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{donation.component || "Không xác định"}</td>
                <td className="border p-2">{donation.date || "Không xác định"}</td>
                <td className="border p-2">{donation.volume || "Không xác định"}</td>
                <td className="border p-2">{donation.bloodGroup || "Không rõ"}</td>
                <td className="border p-2">{donation.status || "Không xác định"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <FeedbackForm />
    </div>
  );
};

export default DonationHistory;