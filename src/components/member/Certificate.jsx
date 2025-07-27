import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useParams } from "react-router-dom";
import { authService } from "../../services/authService";
import "../../assets/css/member/Certificate.css";

const Certificate = () => {
  const { donationHistoryId } = useParams();
  const location = useLocation();
  const passedDonation = location.state?.donation;

  const [user, setUser] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy thông tin user (local hoặc từ backend nếu cần)
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((response) => {
        const u = response.data.result?.user || response.data;
        setUser(u);
      })
      .catch((error) => {
        console.error("Lỗi lấy người dùng:", error);
        setError("Không thể lấy thông tin người dùng.");
      });
  }, []);

  // Tạo dữ liệu chứng chỉ từ passedDonation
  useEffect(() => {
    if (!passedDonation) {
      setError("Không có dữ liệu hiến máu được truyền.");
      setLoading(false);
      return;
    }

    if (!user) return; // đợi user

    const cert = {
      donorName: user.name,
      donatedDate: passedDonation.createdDate,
      location: passedDonation.location || "Không rõ",
      volume: passedDonation.volume || 350,
    };
    setCertificate(cert);
    setLoading(false);
  }, [user, passedDonation]);

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

  const genderPrefix = (gender = "") => {
    const normalized = gender.toLowerCase();
    if (normalized.includes("nam")) return "anh";
    if (normalized.includes("nữ") || normalized.includes("nu")) return "chị";
    return "bạn";
  };

  const formatDate = (dateStr) => {
  if (!dateStr) return "Không xác định";

  // Nếu là dạng "dd-MM-yyyy"
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Nếu là dạng ISO hoặc Date string hợp lệ
  const date = new Date(dateStr);
  return isNaN(date)
    ? "Không xác định"
    : date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
};

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      {user && certificate && (
        <div className="certificate-page">
          <div id="certificate" className="certificate-border">
            <div className="certificate-inner">
              <h2 className="cert-title">GIẤY CHỨNG NHẬN</h2>
              <p className="cert-subtitle">Trao tặng cho</p>
              <h1 className="cert-name">{certificate.donorName.toUpperCase()}</h1>
              <p className="cert-description">
                Vì đã tham gia <strong>hiến máu tình nguyện</strong> vào ngày{" "}
                <strong>{formatDate(certificate.donatedDate)}</strong> tại cơ sở{" "}
                <strong>{certificate.location}</strong>, với{" "}
                <strong>{certificate.volume}ml</strong>.
              </p>
              <p className="cert-description">
                Chúng tôi ghi nhận và trân trọng nghĩa cử cao đẹp của{" "}
                <strong>{genderPrefix(user.gender)}</strong>.
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
