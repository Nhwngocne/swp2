import React, { useEffect, useState } from "react";
import { authService } from "../../services/authService";
import FeedbackForm from "../../pages/FeedbackForm";

const DonationHistory = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonationHistories = async () => {
      try {
        const data = await getDonationHistories();
        setDonationHistory(data);
      } catch (error) {
        console.error("Error fetching donation history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistories();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Lịch sử hiến máu của bạn</h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : donationHistory.length === 0 ? (
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
            {donationHistory.map((donation, index) => (
              <tr key={donation.id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{donation.component}</td>
                <td className="border p-2">{donation.date}</td>
                <td className="border p-2">{donation.volume}</td>
                <td className="border p-2">{donation.bloodType}</td>
                <td className="border p-2">{donation.status}</td>
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
