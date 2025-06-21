import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { authService } from "../../services/authService";
import "../../assets/css/member/Certificate.css";

const Certificate = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((response) => {
        setUser(response.data.result?.user || response.data);
      })
      .catch((error) => console.error("Lỗi lấy người dùng:", error));
  }, []);

  const handleDownload = () => {
    const element = document.getElementById("certificate");
    html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: "giay-chung-nhan-hien-mau.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      })
      .save();
  };

  return (
    <>
      {user && (
        <div className="certificate-page">
          <div id="certificate" className="certificate-border">
            <div className="certificate-inner">
              <h2 className="cert-title">GIẤY CHỨNG NHẬN</h2>
              <p className="cert-subtitle">Trao tặng cho</p>
              <h1 className="cert-name">{(user?.name || "").toUpperCase()}</h1>
              <p className="cert-description">
                Vì đã tham gia <strong>hiến máu tình nguyện</strong> với tinh thần nhân đạo, góp phần cứu sống người bệnh.
              </p>
              <p className="cert-description">
                Chúng tôi ghi nhận và trân trọng nghĩa cử cao đẹp của {user?.gender === "Nam" ? "anh" : "chị"}.
              </p>
              <div className="cert-signatures">
                <div>
                  <p className="signature-name">NGUYỄN VĂN HÒA</p>
                  <p className="signature-title">Chủ tịch Hội Chữ Thập Đỏ</p>
                </div>
                <div>
                  <p className="signature-name">TRẦN THỊ LAN</p>
                  <p className="signature-title">Trưởng Ban Tổ Chức</p>
                </div>
              </div>
            </div>
          </div>
          <div className="download-section">
            <button className="download-btn" onClick={handleDownload}>
              Tải về PDF
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Certificate;
