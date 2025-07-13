import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { donationService } from "../../services/donationService";
import { useAuth } from "../../services/AuthContext";
import { FaCalendar, FaUser, FaHeartbeat } from 'react-icons/fa';
import "../../assets/css/member/FormDetail.css";




const FormDetail = () => {
  const { id } = useParams(); // ID của form từ URL
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { role, user } = useAuth();
  const memberId = user?.id;




  useEffect(() => {
  const fetchFormDetail = async () => {
    if (!id) {
      setError("Không có ID đơn đăng ký.");
      setLoading(false);
      return;
    }

    try {
      let selectedForm;

      if (role === "MEMBER") {
        if (!memberId) {
          setError("Không tìm thấy thông tin người dùng.");
          setLoading(false);
          return;
        }

        const response = await donationService.getDonationRegistrationsByMember(memberId);
        const forms = response.data.result || [];
        console.log("Forms (MEMBER):", forms);
        selectedForm = forms.find((f) => f.id.toString() === id.toString());
      } else if (role === "STAFF") {
        const response = await donationService.getDonationRegistrationById(id);
        selectedForm = response.data.result;
        console.log("Form (STAFF):", selectedForm);
      }

      if (selectedForm) {
        setForm(selectedForm);
        setError("");
      } else {
        setError("Không tìm thấy đơn đăng ký tương ứng.");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu chi tiết.");
    } finally {
      setLoading(false);
    }
  };

  fetchFormDetail();
}, [id, memberId, role]);


  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn đăng ký này?")) {
      try {
        await donationService.deleteDonationRegistration(id);
        alert("Xóa thành công!");
        navigate("/registerHistory");
      } catch (err) {
        console.error("Lỗi xóa:", err);
        alert("Xóa không thành công.");
      }
    }
  };

  if (loading) return <div className="form-detail-container">Đang tải dữ liệu...</div>;
  if (error) return <div className="form-detail-container">{error}</div>;
  if (!form) return <div className="form-detail-container">Không có dữ liệu hiển thị.</div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không rõ";
    // Xử lý định dạng dd-mm-yyyy
    if (typeof dateStr === "string" && dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = dateStr.split("-");
      const formattedDate = new Date(`${year}-${month}-${day}`);
      return isNaN(formattedDate) ? "Không xác định" : formattedDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    // Xử lý các định dạng khác (ISO hoặc null)
    const date = new Date(dateStr);
    return isNaN(date) ? "Không xác định" : date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
console.log("Role:", role);
console.log("User:", user);
  return (
    
    <div className="form-detail-container">
      <h2>Chi Tiết Đơn Đăng Ký Hiến Máu</h2>
      <div className="form-detail-grid">
        <div className="form-col">
          <section className="detail-section">
            <h3><FaCalendar /> Thông tin sự kiện</h3>
            <p><strong>Tên sự kiện:</strong> {form.eventTitle}</p>
            <p><strong>Địa điểm:</strong> {form.eventLocation}</p>
            <p><strong>Ngày tổ chức:</strong> {form.eventDate}</p>
          </section>
          <section className="detail-section">
            <h3><FaUser /> Thông tin người đăng ký</h3>
            <p><strong>Họ tên:</strong> {form.memberName}</p>
            <p><strong>Email:</strong> {form.memberEmail}</p>
            <p><strong>Thể tích đăng ký:</strong> {form.volumeMl} ml</p>
            <p><strong>Nhóm máu của bạn:</strong> {form.bloodTypeName} </p>
            <p><strong>Ngày đăng ký:</strong> {formatDate(form.createdAt)}</p>
          </section>
        </div>
        <div className="form-col">
          <section className="detail-section highlight-status">
            <p>
              <strong>Trạng thái:</strong> {form.status}
              <span className={`status-badge status-${form.status.toLowerCase()}`}>
                {form.status}
              </span>
            </p>
            
          </section>
          <section className="detail-section">
            <h3><FaHeartbeat /> Tình trạng sức khoẻ</h3>
            <p><strong>1.Đã từng hiến máu:</strong> {form.donatedBefore ? "Có" : "Không"}</p>
            <p><strong>Đang mắc bệnh:</strong> {form.currentlyIll ? `Có (${form.illnessDetails})` : "Không"}</p>
            <p><strong>Từng mắc bệnh nặng:</strong> {form.hadSeriousDisease ? `Có (${form.diseaseDetails})` : "Không"}</p>
            <p><strong>Từng mắc sốt rét/bệnh truyền nhiễm:</strong> {form.hadMalariaOrOtherInfectious ? "Có" : "Không"}</p>
            <p><strong>Đã từng nhận máu:</strong> {form.receivedBlood ? "Có" : "Không"}</p>
            <p><strong>Đã tiêm vaccine:</strong> {form.gotVaccine ? "Có" : "Không"}</p>
            <p><strong>Không thuộc các điều kiện trên trong 12 tháng:</strong> {form.noneOfAbove12Months ? "Đúng" : "Không"}</p>
            <p><strong>Có xăm hình/châm cứu:</strong> {form.tattooOrAcupuncture ? "Có" : "Không"}</p>
            <p><strong>Có vấn đề da liễu:</strong> {form.hadSkinIssues ? "Có" : "Không"}</p>
            <p><strong>Đang dùng kháng sinh/kháng viêm:</strong> {form.usedAntibioticsOrAntiInflammatory ? "Có" : "Không"}</p>
            <p><strong>Triệu chứng trong 2 tuần qua:</strong> {form.symptomsPast2Weeks || "Không có"}</p>
            <p><strong>Triệu chứng trong 1 tuần qua:</strong> {form.symptomsPast1Week || "Không có"}</p>
          </section>
          <section className="detail-section">
            <h3><FaHeartbeat /> Điều kiện dành cho nữ</h3>
            <p><strong>Đang có kinh nguyệt:</strong> {form.isMenstruating ? "Có" : "Không"}</p>
            <p><strong>Đang mang thai hoặc mới sinh:</strong> {form.isPregnantOrRecentlyDelivered ? "Có" : "Không"}</p>
            <p><strong>Không thuộc các điều kiện trên:</strong> {form.noneOfFemaleConditions ? "Đúng" : "Không"}</p>
          </section>
        </div>
      </div>
      {role === "MEMBER" && form.status == "APPROVED" && (
        <button className="delete-button" onClick={handleDelete}>Xóa đơn đăng ký</button>
      )}
      {role === "MEMBER" && (
        <button className="back-button" onClick={() => navigate("/registerHistory")}>
          Quay lại lịch sử đăng ký
        </button>
      )}
      {role === "STAFF" && (
        <button className="back-button" onClick={() => navigate("/bloodFormList")}>
          Quay lại danh sách đơn
        </button>
      )}
    </div>
  );
};

export default FormDetail;