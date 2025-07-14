import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import dayjs from "dayjs";
import { donationService } from "../../../services/donationService";

const OfflineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Khai báo navigate

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
    <div className="offline-detail" style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>Chi tiết đơn đăng ký hiến máu ngoại tuyến</h2>

      <section style={{ marginBottom: 20 }}>
        <h3>Thông tin cá nhân</h3>
        <p><strong>Họ tên:</strong> {detail.name || "Chưa cập nhật"}</p>
        <p><strong>Số điện thoại:</strong> {detail.phone || "Chưa cập nhật"}</p>
        <p><strong>CCCD:</strong> {detail.numberCccd || "Chưa cập nhật"}</p>
        <p><strong>Địa chỉ:</strong> {detail.address || "Chưa cập nhật"}</p>
        <p><strong>Email:</strong> {detail.email || "Chưa cập nhật"}</p>
        <p><strong>Cân nặng (kg):</strong> {detail.weight ?? "Chưa cập nhật"}</p>
        <p><strong>Chiều cao (cm):</strong> {detail.height ?? "Chưa cập nhật"}</p>
        <p><strong>Huyết áp:</strong> {detail.bloodPressure || "Chưa cập nhật"}</p>
        <p><strong>Ngày đăng ký:</strong> {formatDate(detail.createdAt)}</p>
        <p><strong>Trạng thái:</strong> {detail.status || "Chưa cập nhật"}</p>
        <p><strong>Cơ sở tiếp nhận:</strong> {detail.location || "Chưa cập nhật"}</p>
        <p><strong>Nhân viên phụ trách:</strong> {detail.staffName || "Không rõ"}</p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <p><strong>Nhóm máu:</strong> {detail.bloodType || "Chưa xác định"}</p>
        <p><strong>Thể tích hiến (ml):</strong> {detail.volumeMl ?? "Chưa xác định"}</p>
        <p><strong>Kết quả:</strong> {detail.result || "Chưa có kết quả"}</p>
        <p><strong>Ghi chú:</strong> {detail.note || "Không có ghi chú"}</p>
      </section>

      <section>
        <h3>Câu hỏi sàng lọc</h3>
        <ul>
          {screeningQuestions.map(({ key, label }) => (
            <li key={key}>
              {label}: {yesNo(detail[key])}
            </li>
          ))}
        </ul>
      </section>

      <button
        onClick={() => navigate("/registerOff")}
        style={{
          marginTop: 30,
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        ← Quay lại danh sách
      </button>
    </div>
  );
};

export default OfflineDetail;
