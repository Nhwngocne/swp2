import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DonationBloodResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Giả sử có api get kết quả theo id
    fetch(`/api/donationResults/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Không tìm thấy kết quả');
        return res.json();
      })
      .then(data => {
        setResult(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Đang tải kết quả...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Kết quả hiến máu #{id}</h2>
      {/* Hiển thị chi tiết result theo dữ liệu trả về */}
      <p>Ngày hiến máu: {result.date}</p>
      <p>Lượng máu: {result.volume} ml</p>
      <p>Nhóm máu: {result.bloodType}</p>
      <p>Kết quả xét nghiệm: {result.testResult}</p>
      <p>Thông báo: {result.resultMessage}</p>
      {/* ... các thông tin khác */}
    </div>
  );
};

export default DonationBloodResult;
