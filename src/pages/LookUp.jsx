import React, { useState } from 'react';
import '../assets/css/pages/LookUp.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LookUp = () => {
  const [componentId, setComponentId] = useState(0);
  const [bloodTypeId, setBloodTypeId] = useState(0);
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (componentId === 0 && bloodTypeId === 0) return;
    setIsSearching(true);
    setResult(null);
    try {
      const res = await axios.get(`http://localhost:8080/swp391/lookup/${componentId}/${bloodTypeId}`);
      setResult(res.data.result);
    } catch (err) {
      console.error("Tra cứu thất bại:", err);
      alert("Không thể tra cứu dữ liệu.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="lookup-container">
      <div className="header-section">
        <div className="header-icon-wrapper">
          <span className="heart-icon">❤️</span>
        </div>
        <h1 className="header-title">Tra cứu tương thích máu</h1>
        <p className="header-description">
          Hệ thống tra cứu thông tin tương thích máu chính xác và nhanh chóng.  <br />
          Vui lòng chọn thành phần máu và nhóm máu bạn muốn tra cứu.
        </p>
      </div>
<div className="search-form">
          <label>
            Thành phần máu
            <select value={componentId} onChange={(e) => setComponentId(Number(e.target.value))}>
              <option value={0}>Chọn thành phần máu</option>
              <option value={1}>Toàn phần</option>
              <option value={2}>Hồng cầu</option>
              <option value={3}>Huyết tương</option>
              <option value={4}>Tiểu cầu</option>
            </select>
          </label>

          <label>
            Nhóm máu
            <select value={bloodTypeId} onChange={(e) => setBloodTypeId(Number(e.target.value))}>
              <option value={0}>Chọn nhóm máu</option>
              <option value={6}>O-</option>
              <option value={7}>O+</option>
              <option value={8}>A-</option>
              <option value={9}>A+</option>
              <option value={10}>B-</option>
              <option value={11}>B+</option>
              <option value={12}>AB-</option>
              <option value={13}>AB+</option>
            </select>
          </label>

          <button
            onClick={handleSearch}
            disabled={componentId === 0 && bloodTypeId === 0}
            className={`search-button ${(componentId !== 0 || bloodTypeId !== 0) ? 'enabled' : ''}`}
          >
            {isSearching ? "Đang tra cứu..." : "🔍 Tra cứu ngay"}
          </button>
        </div>
      

      {result && (
        <div className="results-card">
          <div className="results-header">🔎 Kết quả tra cứu</div>
          <div className="results-content">
            {result.componentName && <p><strong>Thành phần:</strong> {result.componentName}</p>}
            {result.bloodTypeName && <p><strong>Nhóm máu:</strong> {result.bloodTypeName}</p>}
            {result.description && <p><strong>Mô tả:</strong> {result.description}</p>}

<div className="compatibility-grid">
  <div className="compatibility-box donate">
    <h4>🟢 Có thể truyền cho</h4>
    {result.canDonateTo?.length > 0 ? (
      result.canDonateTo.map((item) => (
        <div key={item.id} className="blood-card">
          <div className="blood-type">{item.name}</div>
          <div><strong>Kháng nguyên:</strong> {item.antigens || "Không có"}</div>
          <div><strong>Kháng thể:</strong> {item.antibodies || "Không có"}</div>
          <div className="note">{item.description}</div>
        </div>
      ))
    ) : (
      <p className="no-data">Không có dữ liệu.</p>
    )}
  </div>

  <div className="compatibility-box receive">
    <h4>🔵 Có thể nhận từ</h4>
    {result.canReceiveFrom?.length > 0 ? (
      result.canReceiveFrom.map((item) => (
        <div key={item.id} className="blood-card">
          <div className="blood-type">{item.name}</div>
          <div><strong>Kháng nguyên:</strong> {item.antigens || "Không có"}</div>
          <div><strong>Kháng thể:</strong> {item.antibodies || "Không có"}</div>
          <div className="note">{item.description}</div>
        </div>
      ))
    ) : (
      <p className="no-data">Không có dữ liệu.</p>
    )}
  </div>
</div>

          </div>
        </div>
      )}

     <div className="cta-section">
  <div className="cta-card">
    <div className="cta-icon-container">
      <svg className="cta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 11a4 4 0 10-8 0 4 4 0 008 0zm6 0a4 4 0 10-8 0 4 4 0 008 0z" />
      </svg>
    </div>
    <h3 className="cta-title">Sẵn sàng giúp đỡ?</h3>
    <p className="cta-description">
      Đăng ký để trở thành người hiến máu hoặc tìm người hiến máu phù hợp
    </p>
    <button className="cta-button" onClick={() => navigate("/form")}>
      Đăng ký Cho/Nhận máu
    </button>
  </div>
</div>
    </div>
  );
};

export default LookUp;
