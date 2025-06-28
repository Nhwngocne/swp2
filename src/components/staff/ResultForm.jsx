import React, { useState } from 'react';
import { donationService } from '../../services/donationService'; // Import service to handle API calls
import { useLocation, useParams } from 'react-router-dom';



const ResultForm = () => {
  const [testResult, setTestResult] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [message, setMessage] = useState('');

   const { registrationId } = useParams(); // 👈 lấy ID từ URL
  const location = useLocation(); // 👈 lấy state truyền qua
  const memberId = location.state?.memberId || 1;

  const bloodTypeOptions = [
    { label: 'A+', id: 1 },
    { label: 'A-', id: 2 },
    { label: 'B+', id: 3 },
    { label: 'B-', id: 4 },
    { label: 'O+', id: 5 },
    { label: 'O-', id: 6 },
    { label: 'AB+', id: 7 },
    { label: 'AB-', id: 8 },
  ];

  const getBloodTypeId = (label) => {
    const found = bloodTypeOptions.find((b) => b.label === label);
    return found ? found.id : null;
  };

  const getResultMessage = (result) => {
    return result === 'Đạt'
      ? 'Chỉ số xét nghiệm bình thường'
      : 'Chỉ số xét nghiệm không đạt yêu cầu';
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    const bloodTypeId = getBloodTypeId(bloodType);
    const resultMessage = getResultMessage(testResult);

    const formData = {
      volume: 350,
      component: 'Hồng cầu',
      status: 'Hoàn thành',
      location: 'Hà Nội',
      testResult,
      resultMessage,
      date: new Date().toISOString().slice(0, 10),
      nextEligibleDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      staffId: 1, // 👈 nếu bạn đang đăng nhập thì lấy từ localStorage
      memberId,   // 👈 từ location.state
      bloodTypeId,
      registrationId: parseInt(registrationId), // 👈 liên kết đúng đơn đăng ký
    };

     try {
      const response = await donationService.createDonationHistory(formData);
      setMessage('✔️ Lưu kết quả hiến máu thành công!');
      setTestResult('');
      setBloodType('');
    } catch (error) {
      console.error('Lỗi khi lưu kết quả:', error);
      setMessage('❌ Lưu kết quả thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Kết quả hiến máu</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Nhóm máu:</label>
        <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} required>
          <option value="">-- Chọn nhóm máu --</option>
          {bloodTypeOptions.map((type) => (
            <option key={type.id} value={type.label}>{type.label}</option>
          ))}
        </select>

        <label>Kết quả xét nghiệm:</label>
        <select value={testResult} onChange={(e) => setTestResult(e.target.value)} required>
          <option value="">-- Chọn kết quả --</option>
          <option value="Đạt">Đạt</option>
          <option value="Không đạt">Không đạt</option>
        </select>

        <button type="submit">Lưu kết quả</button>
      </form>
      {message && <p style={{ marginTop: '15px' }}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '30px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f8f8f8'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  }
};

export default ResultForm;
