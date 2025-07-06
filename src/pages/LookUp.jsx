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

            <div className="compatibility-diagram-vertical" style={{ position: "relative", width: 800, height: 500, margin: "0 auto" }}>
              <svg width={800} height={500} style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}>
                <defs>
                  <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#f87171" />
                  </marker>
                  <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="10 0, 0 3.5, 10 7" fill="#60a5fa" />
                  </marker>
                </defs>
                {/* Đường từ trái (donate) vào trung tâm */}
                {result.canDonateTo?.map((item, idx, arr) => {
                  const total = arr.length || 1;
                  const y = 80 + (idx * (340 / (total - 1)) || 0); // Phân bố đều
                  return (
                    <path
                      key={item.id}
                      d={`M180,${y + 35} Q250,${y + 35} 350,250`}
                      markerEnd="url(#arrowhead-red)"
                      stroke="#f87171"
                      strokeWidth="3"
                      fill="none"
                    />
                  );
                })}
                {/* Đường từ phải (receive) vào trung tâm */}
                {result.canReceiveFrom?.map((item, idx, arr) => {
                  const total = arr.length || 1;
                  const y = 80 + (idx * (340 / (total - 1)) || 0); // Phân bố đều
                  return (
                    <path
                      key={item.id}
                      d={`M620,${y + 35} Q550,${y + 35} 450,250`}
                      markerEnd="url(#arrowhead-blue)"
                      stroke="#60a5fa"
                      strokeWidth="3"
                      fill="none"
                    />
                  );
                })}
              </svg>
              {/* Node trung tâm */}
              <div
                className="center-circle"
                style={{
                  position: "absolute",
                  left: 340,
                  top: 190,
                  width: 120,
                  height: 120,
                  background: "linear-gradient(135deg, #f87171 0%, #fb923c 100%)",
                  borderRadius: "50%",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "2.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 24px rgba(248, 113, 113, 0.2)",
                  border: "5px solid #fff",
                  zIndex: 2,
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                {result.bloodTypeName}
              </div>
              {/* Các node truyền cho (bên trái) */}
              {result.canDonateTo?.map((item, idx, arr) => {
                const total = arr.length || 1;
                const y = 80 + (idx * (340 / (total - 1)) || 0); // Phân bố đều
                return (
                  <div
                    key={item.id}
                    className="circle mindmap-circle"
                    style={{
                      position: "absolute",
                      left: 80,
                      top: y,
                      background: "linear-gradient(135deg, #f87171 0%, #fb923c 100%)",
                      border: "3px solid #fff",
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "1.3rem",
                      boxShadow: "0 4px 12px rgba(248, 113, 113, 0.15)",
                      width: 70,
                      height: 70,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 2,
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.15)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  >
                    {item.name}
                    <div className="circle-tooltip">
                      <div><strong>Kháng nguyên:</strong> {item.antigens || "Không có"}</div>
                      <div><strong>Kháng thể:</strong> {item.antibodies || "Không có"}</div>
                      <div className="note">{item.description}</div>
                    </div>
                  </div>
                );
              })}
              {/* Các node nhận từ (bên phải) */}
              {result.canReceiveFrom?.map((item, idx, arr) => {
                const total = arr.length || 1;
                const y = 80 + (idx * (340 / (total - 1)) || 0); // Phân bố đều
                return (
                  <div
                    key={item.id}
                    className="circle mindmap-circle"
                    style={{
                      position: "absolute",
                      left: 650,
                      top: y,
                      background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                      border: "3px solid #fff",
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "1.3rem",
                      boxShadow: "0 4px 12px rgba(96, 165, 250, 0.15)",
                      width: 70,
                      height: 70,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 2,
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.15)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  >
                    {item.name}
                    <div className="circle-tooltip">
                      <div><strong>Kháng nguyên:</strong> {item.antigens || "Không có"}</div>
                      <div><strong>Kháng thể:</strong> {item.antibodies || "Không có"}</div>
                      <div className="note">{item.description}</div>
                    </div>
                  </div>
                );
              })}
              {/* Nhãn chú thích */}
              <div style={{ position: "absolute", left: 20, top: 20, width: 200, textAlign: "center", color: "#f87171", fontWeight: 500, fontSize: "1.2rem" }}>
                Có thể truyền cho
              </div>
              <div style={{ position: "absolute", right: 20, top: 20, width: 200, textAlign: "center", color: "#60a5fa", fontWeight: 500, fontSize: "1.2rem" }}>
                Có thể nhận từ
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