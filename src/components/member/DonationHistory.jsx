// src/pages/DonationHistory.jsx
import FeedbackList from "../../pages/FeedBackList";
import React from "react";

const DonationHistory = () => {
  // Dữ liệu giả
  const donationHistory = [
    {
      id: 1,
      component: "Máu toàn phần",
      date: "2024-01-10",
      status: "Thành công",
      volume: "450ml",
      admin_id: 2,
      blood_type_id: "O+",
      member_id: 5,
      staff_id: 3,
    },
    {
      id: 2,
      component: "Huyết tương",
      date: "2024-03-15",
      status: "Thành công",
      volume: "300ml",
      admin_id: 2,
      blood_type_id: "O+",
      member_id: 5,
      staff_id: 4,
    },
    {
      id: 3,
      component: "Tiểu cầu",
      date: "2024-06-05",
      status: "Thành công",
      volume: "250ml",
      admin_id: 2,
      blood_type_id: "O+",
      member_id: 5,
      staff_id: 6,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Lịch sử hiến máu của bạn</h2>
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
              <td className="border p-2">{donation.blood_type_id}</td>
              <td className="border p-2">{donation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <FeedbackList />
    </div>
  );
};

export default DonationHistory;
