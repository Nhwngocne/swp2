import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { authService } from "../../services/authService";
import { certificateService } from "../../services/certificateService";
import "../../assets/css/member/Certificate.css";
import { useParams } from "react-router-dom";
import { useDonation } from "../../services/DonationContext";

const Certificate = () => {
  const { donationHistoryId } = useParams();
  const [user, setUser] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState("");
  const { donationHistories } = useDonation(); // lấy location, volume, ngày hiến

  // Lấy user từ backend
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((response) => {
        setUser(response.data.result?.user || response.data);
      })
      .catch((error) => {
        console.error("Lỗi lấy người dùng:", error);
        setError("Không thể lấy thông tin người dùng.");
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  // Lấy hoặc tạo chứng chỉ
  useEffect(() => {
    const fetchOrCreateCertificate = async () => {
      if (!donationHistoryId || !user || donationHistories.length === 0) return;

      try {
        setLoading(true);

        // 1. Thử lấy chứng chỉ
        const response = await certificateService.getCertificateByDonationHistoryId(donationHistoryId);
        setCertificate(response.data);
        setError("");
      } catch (err) {
        if (err.response?.status === 404) {
          try {
            // 2. Nếu chưa có thì tạo
            const donation = donationHistories.find(d => d.id === parseInt(donationHistoryId));
            if (!donation) {
              setError("Không tìm thấy thông tin hiến máu.");
              return;
            }

            const formData = new FormData();
            formData.append("donationHistoryId", donationHistoryId);
            formData.append("donorName", user.name);
            formData.append("donatedDate", new Date(donation.createdDate).toISOString().split("T")[0]);
            formData.append("location", donation.location || "Không rõ");
            formData.append("volume", donation.volume || 350);

            const uploadResponse = await certificateService.uploadCertificate(formData);
            setCertificate(uploadResponse.data);
            setError("");
          } catch (uploadErr) {
            setError("Không thể tạo chứng chỉ");
            console.error("Upload error:", uploadErr);
          }
        } else {
          setError("Không thể tải chứng chỉ");
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateCertificate();
  }, [donationHistoryId, user, donationHistories]);

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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date)
      ? "Không xác định"
      : date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  };

  if (loading || loadingUser) return <p>Đang tải chứng chỉ...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      {user && certificate && (
        <div className="certificate-page">
          <div id="certificate" className="certificate-border">
            <div className="certificate-inner">
              <h2 className="cert-title">GIẤY CHỨNG NHẬN</h2>
              <p className="cert-subtitle">Trao tặng cho</p>
              <h1 className="cert-name">{(certificate.donorName || "").toUpperCase()}</h1>
              <p className="cert-description">
                Vì đã tham gia <strong>hiến máu tình nguyện</strong> vào ngày{" "}
                <strong>{formatDate(certificate.donatedDate)}</strong> tại cơ sở{" "}
                <strong>{certificate.location}</strong>, với{" "}
                <strong>{certificate.volume}ml</strong>.
              </p>
              <p className="cert-description">
                Chúng tôi ghi nhận và trân trọng nghĩa cử cao đẹp của{" "}
                {user.gender === "Nam" ? "anh" : user.gender === "Nữ" ? "chị" : "bạn"}.
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
