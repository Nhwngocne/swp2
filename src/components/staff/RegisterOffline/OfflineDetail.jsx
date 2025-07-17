import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { donationService } from "../../../services/donationService";
import "../../../assets/css/components/staff/OfflineDetail.css";

const OfflineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfflineDetail = async (id) => {
      if (!id) {
        setError("ID không hợp lệ");
        setDetail(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await donationService.getRegisOfflineById(id);

        if (!response?.data?.result) {
          throw new Error("Không tìm thấy dữ liệu đơn đăng ký");
        }

        setDetail(response.data.result);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || "Không thể tải đơn đăng ký offline";
        setError(errorMessage);
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOfflineDetail(id);
    }
  }, [id]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;
  if (!detail) return <div>Không có dữ liệu</div>;

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = dayjs(dateString, "DD-MM-YYYY");
    if (!date.isValid()) return "Chưa cập nhật";
    return date.format("DD/MM/YYYY");
  };

  const yesNo = (value) => (value === true ? "Có" : value === false ? "Không" : "Chưa cập nhật");

  const screeningQuestions = [
    { key: "donatedBefore", label: "Bạn đã từng hiến máu trước đây chưa?" },
    { key: "hadSeriousDisease", label: "Bạn có từng mắc các bệnh nghiêm trọng như tim mạch, ung thư hoặc tiểu đường không?" },
    { key: "hadMalariaOrOtherInfectious", label: "Bạn đã từng bị sốt rét, viêm gan B/C hoặc các bệnh truyền nhiễm khác chưa?" },
    { key: "receivedBlood", label: "Bạn đã từng nhận truyền máu trong quá khứ chưa?" },
    { key: "gotVaccine", label: "Bạn có tiêm vaccine phòng bệnh (như COVID-19, cúm mùa) trong 14 ngày qua không?" },
    { key: "noneOfAbove12Months", label: "Trong 12 tháng qua, bạn không thuộc bất kỳ tình trạng nào ở trên?" },
    { key: "tattooOrAcupuncture", label: "Bạn có xăm hình hoặc châm cứu trong vòng 6 tháng qua không?" },
    { key: "hadSkinIssues", label: "Bạn có đang bị các bệnh ngoài da như nấm da, mụn mủ, zona hay vảy nến không?" },
    { key: "usedAntibioticsOrAntiInflammatory", label: "Bạn đang sử dụng kháng sinh hoặc thuốc chống viêm như amoxicillin, ibuprofen trong 1 tháng qua không?" },
    { key: "symptomsPast2Weeks", label: "Trong 2 tuần qua, bạn có bị sốt, ho, đau họng, hoặc mất vị giác không?" },
    { key: "symptomsPast1Week", label: "Trong 1 tuần qua, bạn có bị tiêu chảy, buồn nôn, hoặc phát ban không?" },
    { key: "isMenstruating", label: "Hiện bạn đang trong kỳ kinh nguyệt?" },
    { key: "isPregnantOrRecentlyDelivered", label: "Bạn đang mang thai hoặc đã sinh con trong vòng 6 tháng qua?" },
    { key: "noneOfFemaleConditions", label: "Bạn không thuộc bất kỳ tình trạng sức khỏe đặc thù nào của nữ kể trên?" },
  ];

  return (
    <div className="offline-detail">
      <h2>Chi tiết đơn đăng ký hiến máu ngoại tuyến</h2>
      <div className="content-wrapper">
        <section className="info-section">
          <h3>Thông tin cá nhân</h3>
          <div className="info-grid">
            <div className="info-label">Họ tên:</div>
            <div className="info-value">{detail.name || "Chưa cập nhật"}</div>
            <div className="info-label">Số điện thoại:</div>
            <div className="info-value">{detail.phone || "Chưa cập nhật"}</div>
            <div className="info-label">CCCD:</div>
            <div className="info-value">{detail.numberCccd || "Chưa cập nhật"}</div>
            <div className="info-label">Địa chỉ:</div>
            <div className="info-value">{detail.address || "Chưa cập nhật"}</div>
            <div className="info-label">Email:</div>
            <div className="info-value">{detail.email || "Chưa cập nhật"}</div>
            <div className="info-label">Cân nặng (kg):</div>
            <div className="info-value">{detail.weight ?? "Chưa cập nhật"}</div>
            <div className="info-label">Chiều cao (cm):</div>
            <div className="info-value">{detail.height ?? "Chưa cập nhật"}</div>
            <div className="info-label">Huyết áp:</div>
            <div className="info-value">{detail.bloodPressure || "Chưa cập nhật"}</div>
            <div className="info-label">Ngày đăng ký:</div>
            <div className="info-value">{formatDate(detail.createdAt)}</div>
            <div className="info-label">Trạng thái:</div>
            <div className="info-value">{detail.status || "Chưa cập nhật"}</div>
            <div className="info-label">Cơ sở tiếp nhận:</div>
            <div className="info-value">{detail.location || "Chưa cập nhật"}</div>
            <div className="info-label">Nhân viên phụ trách:</div>
            <div className="info-value">{detail.staffName || "Không rõ"}</div>
          </div>
          <div className="info-grid">
            <div className="info-label">Nhóm máu:</div>
            <div className="info-value">{detail.bloodType || "Chưa xác định"}</div>
            <div className="info-label">Thể tích hiến (ml):</div>
            <div className="info-value">{detail.volumeMl ?? "Chưa xác định"}</div>
            <div className="info-label">Kết quả:</div>
            <div className="info-value">{detail.result || "Chưa có kết quả"}</div>
            <div className="info-label">Ghi chú:</div>
            <div className="info-value">{detail.note || "Không có ghi chú"}</div>
          </div>
        </section>
        <section className="screening-section">
          <h3>Câu hỏi sàng lọc</h3>
          <ul className="screening-list">
            {screeningQuestions.map(({ key, label }) => (
              <li key={key}>
                <span className="question-label">{label}</span>: {yesNo(detail[key])}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <button className="back-btn" onClick={() => navigate("/registerOff")}>
        ← Quay lại danh sách
      </button>
    </div>
  );
};

export default OfflineDetail;