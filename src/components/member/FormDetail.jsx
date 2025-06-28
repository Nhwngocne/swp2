import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { donationService } from "../../services/donationService";

const FormDetail = () => {
  const { id } = useParams(); // Lấy ID form từ URL
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const fakeForm = {
  id: 1,
  eventTitle: "Ngày hội hiến máu nhân đạo",
  eventLocation: "Trường Đại học Kyoto - Nhật Bản",
  eventDate: "2025-07-15",
  memberName: "Nguyễn Văn A",
  memberEmail: "nguyenvana@example.com",
  volumeMl: 350,
  createdAt: "2025-06-25T10:30:00Z",
  donatedBefore: true,
  currentlyIll: false,
  illnessDetails: "",
  hadSeriousDisease: true,
  diseaseDetails: "Tiểu đường",
  hadMalariaOrOtherInfectious: false,
  receivedBlood: false,
  gotVaccine: true,
  noneOfAbove12Months: true,
  tattooOrAcupuncture: false,
  hadSkinIssues: false,
  usedAntibioticsOrAntiInflammatory: false,
  symptomsPast2Weeks: "Không có",
  symptomsPast1Week: "Mệt nhẹ",
  isMenstruating: false,
  isPregnantOrRecentlyDelivered: false,
  noneOfFemaleConditions: true,
  status: "Chờ duyệt",
  approvedDate: null,
  approvedByStaffName: null
};


  useEffect(() => {
  const fetchFormDetail = async () => {
    try {
      // const response = await donationService.getDonationRegistrationById(id);
      // setForm(response.data);

      // Dùng fake data để test
      const fakeForm = {
        id: 1,
        eventTitle: "Ngày hội hiến máu nhân đạo",
        eventLocation: "Trường Đại học Kyoto - Nhật Bản",
        eventDate: "2025-07-15",
        memberName: "Nguyễn Văn A",
        memberEmail: "nguyenvana@example.com",
        volumeMl: 350,
        createdAt: "2025-06-25T10:30:00Z",
        donatedBefore: true,
        currentlyIll: false,
        illnessDetails: "",
        hadSeriousDisease: true,
        diseaseDetails: "Tiểu đường",
        hadMalariaOrOtherInfectious: false,
        receivedBlood: false,
        gotVaccine: true,
        noneOfAbove12Months: true,
        tattooOrAcupuncture: false,
        hadSkinIssues: false,
        usedAntibioticsOrAntiInflammatory: false,
        symptomsPast2Weeks: "Không có",
        symptomsPast1Week: "Mệt nhẹ",
        isMenstruating: false,
        isPregnantOrRecentlyDelivered: false,
        noneOfFemaleConditions: true,
        status: "Chờ duyệt",
        approvedDate: null,
        approvedByStaffName: null
      };
      setForm(fakeForm);
    } catch (err) {
      setError("Không thể tải dữ liệu chi tiết.");
    } finally {
      setLoading(false);
    }
  };

  fetchFormDetail();
}, [id]);

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn đăng ký này?")) {
      try {
        await donationService.deleteDonationRegistration(id);
        alert("Xóa thành công!");
        navigate("/member/register-history");
      } catch (err) {
        console.error("Lỗi xóa:", err);
        alert("Xóa không thành công.");
      }
    }
  };

  if (loading) return <div className="form-detail-container">Đang tải dữ liệu...</div>;
  if (error) return <div className="form-detail-container">{error}</div>;
  if (!form) return <div className="form-detail-container">Không có dữ liệu hiển thị.</div>;

  return (
    <div className="form-detail-container">
      <h2>Chi Tiết Đơn Đăng Ký Hiến Máu</h2>

      <section className="detail-section">
        <h3>📅 Thông tin sự kiện</h3>
        <p><strong>Tên sự kiện:</strong> {form.eventTitle}</p>
        <p><strong>Địa điểm:</strong> {form.eventLocation}</p>
        <p><strong>Ngày tổ chức:</strong> {form.eventDate}</p>
      </section>

      <section className="detail-section">
        <h3>👤 Thông tin người đăng ký</h3>
        <p><strong>Họ tên:</strong> {form.memberName}</p>
        <p><strong>Email:</strong> {form.memberEmail}</p>
        <p><strong>Thể tích đăng ký:</strong> {form.volumeMl} ml</p>
        <p><strong>Ngày đăng ký:</strong> {form.createdAt}</p>
      </section>

      <section className="detail-section">
        <h3>📝 Tình trạng sức khoẻ</h3>
        <p><strong>Đã từng hiến máu:</strong> {form.donatedBefore ? "Có" : "Không"}</p>
        <p><strong>Đang mắc bệnh:</strong> {form.currentlyIll ? `Có (${form.illnessDetails})` : "Không"}</p>
        <p><strong>Từng mắc bệnh nặng:</strong> {form.hadSeriousDisease ? `Có (${form.diseaseDetails})` : "Không"}</p>
        <p><strong>Từng mắc sốt rét/bệnh truyền nhiễm:</strong> {form.hadMalariaOrOtherInfectious ? "Có" : "Không"}</p>
        <p><strong>Đã từng nhận máu:</strong> {form.receivedBlood ? "Có" : "Không"}</p>
        <p><strong>Đã tiêm vaccine:</strong> {form.gotVaccine ? "Có" : "Không"}</p>
        <p><strong>Không thuộc các điều kiện trên trong 12 tháng:</strong> {form.noneOfAbove12Months ? "Đúng" : "Không"}</p>
        <p><strong>Có xăm hình/châm cứu:</strong> {form.tattooOrAcupuncture ? "Có" : "Không"}</p>
        <p><strong>Có vấn đề da liễu:</strong> {form.hadSkinIssues ? "Có" : "Không"}</p>
        <p><strong>Đang sử dụng kháng sinh:</strong> {form.usedAntibioticsOrAntiInflammatory ? "Có" : "Không"}</p>
        <p><strong>Triệu chứng trong 2 tuần qua:</strong> {form.symptomsPast2Weeks}</p>
        <p><strong>Triệu chứng trong 1 tuần qua:</strong> {form.symptomsPast1Week}</p>
      </section>

      <section className="detail-section">
        <h3>💁‍♀️ Điều kiện dành cho nữ</h3>
        <p><strong>Đang có kinh nguyệt:</strong> {form.isMenstruating ? "Có" : "Không"}</p>
        <p><strong>Đang mang thai hoặc mới sinh:</strong> {form.isPregnantOrRecentlyDelivered ? "Có" : "Không"}</p>
        <p><strong>Không thuộc các điều kiện trên:</strong> {form.noneOfFemaleConditions ? "Đúng" : "Không"}</p>
      </section>

      <section className="detail-section">
        <h3>📋 Phê duyệt</h3>
        <p><strong>Trạng thái:</strong> {form.status}</p>
        <p><strong>Ngày phê duyệt:</strong> {form.approvedDate || "Chưa phê duyệt"}</p>
        <p><strong>Người phê duyệt:</strong> {form.approvedByStaffName || "Chưa có"}</p>
      </section>

      {/* Chỉ hiển thị nút xóa nếu đơn chưa được duyệt */}
      {form.status?.toLowerCase() !== "chấp nhận" && (
        <button className="delete-button" onClick={handleDelete}>
          Xóa đơn đăng ký
        </button>
      )}

      {/* Nút quay lại */}
      <button className="back-button" onClick={() => navigate("/member/register-history")}>
         Quay lại lịch sử đăng ký
      </button>
    </div>
  );
};

export default FormDetail;
