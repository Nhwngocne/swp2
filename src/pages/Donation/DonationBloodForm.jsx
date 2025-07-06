import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import { useEvents } from "../../services/EventContext";
import { useBlood } from "../../services/BloodContext";
import DonationStep1 from "./DonationStep1";
import DonationStep2 from "./DonationStep2";
import "../../assets/css/pages/DonationBloodForm.css";

export default function DonationBloodForm() {
  const { user, isAuthenticated } = useAuth();
  const { createBloodDonationForm } = useEvents();
  const { bloodTypes } = useBlood();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    eventId = 0,
    donation_date = "",
    location: eventLocation = "",
    bloodTypes: eventBloodTypes = [],
    session = "",
    donationMorningStart = "",
    donationMorningEnd = "",
    donationAfternoonStart = "",
    donationAfternoonEnd = "",
  } = location.state || {};
  console.log("State received:", location.state);

  const bloodTypeMap = {
    A: 2,
    B: 3,
    AB: 4,
    O: 5,
    "Không biết": 0, // Thêm tùy chọn "Không biết"
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventId: eventId,
    memberId: user?.id || 0,
    donation_date: donation_date,
    location: eventLocation,
    bloodTypeId: "", // Khởi tạo rỗng
    volumeMl: "",
    session: "",
    donated_before: "",
    current_illness: "",
    illness_details: "",
    past_diseases: "",
    disease_details: "",
    past_year: [],
    past_6months: [],
    past_month: [],
    past_2weeks: [],
    other_2weeks: "",
    past_week: [],
    other_week: "",
    female_questions: [],
    agreement: false,
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({ ...prev, memberId: user.id }));
    }
  }, [user]);

  useEffect(() => {
    if (!eventId) {
      setFormError("Không tìm thấy sự kiện. Vui lòng chọn sự kiện từ danh sách.");
      navigate("/events");
    }
  }, [eventId, navigate]);

  const handleSubmitAll = async () => {
    setFormError(null);
    setFormSuccess(null);

    if (!isAuthenticated) {
      setFormError("Vui lòng đăng nhập để đăng ký hiến máu.");
      navigate("/login", { state: { from: "/donation-blood-form", eventId } });
      return;
    }

    // Validation cơ bản
    let errors = [];
    if (!formData.eventId || isNaN(parseInt(formData.eventId))) {
      errors.push("ID sự kiện");
    }
    if (!formData.memberId || isNaN(parseInt(formData.memberId))) {
      errors.push("ID thành viên");
    }
    if (!formData.bloodTypeId && formData.bloodTypeId !== "0") {
      errors.push("Nhóm máu của bạn"); // Cho phép bloodTypeId là "0" (Không biết)
    }
    if (!formData.volumeMl || isNaN(parseInt(formData.volumeMl))) {
      errors.push("Thể tích máu");
    }
    if (!formData.session || !["MORNING", "AFTERNOON"].includes(formData.session)) {
      errors.push("Khung giờ hiến máu");
    }
    if (!["co", "khong"].includes(formData.donated_before)) {
      errors.push("Từng hiến máu");
    }
    if (!["co", "khong"].includes(formData.current_illness)) {
      errors.push("Bệnh lý hiện tại");
    }
    if (!["co", "khong", "benh_khac"].includes(formData.past_diseases)) {
      errors.push("Bệnh nguy hiểm");
    }
    if (!Array.isArray(formData.past_year)) {
      errors.push("Dữ liệu 12 tháng qua");
    }
    if (!Array.isArray(formData.past_6months)) {
      errors.push("Dữ liệu 6 tháng qua");
    }
    if (!Array.isArray(formData.past_month)) {
      errors.push("Dữ liệu 1 tháng qua");
    }
    if (!Array.isArray(formData.female_questions)) {
      errors.push("Dữ liệu câu hỏi nữ giới");
    }
    if (!formData.agreement) {
      errors.push("Cam kết");
    }

    if (errors.length > 0) {
      const errorMessage = `Vui lòng điền đầy đủ: ${errors.join(", ")}.`;
      setFormError(errorMessage);
      console.error("Validation lỗi trong handleSubmitAll:", errorMessage);
      return;
    }

    // Log formData để debug
    console.log("formData gửi đến createBloodDonationForm:", formData);

    try {
      const result = await createBloodDonationForm({
        ...formData,
        bloodTypeId: formData.bloodTypeId === "0" ? 0 : parseInt(formData.bloodTypeId), // Xử lý "Không biết"
      });
      if (result.success) {
        setFormSuccess(result.message);
        setFormData({
          eventId: eventId || 0,
          memberId: user?.id || 0,
          donation_date: "",
          location: "",
          bloodTypeId: "",
          volumeMl: "",
          session: "",
          donated_before: "",
          current_illness: "",
          illness_details: "",
          past_diseases: "",
          disease_details: "",
          past_year: [],
          past_6months: [],
          past_month: [],
          past_2weeks: [],
          other_2weeks: "",
          past_week: [],
          other_week: "",
          female_questions: [],
          agreement: false,
        });
        setStep(1);
        navigate("/events");
      } else {
        throw new Error(result.error || "Tạo biểu mẫu thất bại");
      }
    } catch (error) {
      console.error("Lỗi tạo biểu mẫu:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || error.message || "Đăng ký hiến máu thất bại. Vui lòng thử lại.";
      setFormError(errorMessage);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="donation-form-container">
        <h1 className="donation-form-title">FORM ĐĂNG KÝ HIẾN MÁU</h1>
        <p className="text-red-500 text-center">
          Vui lòng đăng nhập để đăng ký hiến máu.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      {formError && (
        <p className="text-red-500 text-center mb-4">{formError}</p>
      )}
      {formSuccess && (
        <p className="text-green-500 text-center mb-4">{formSuccess}</p>
      )}
      {step === 1 && (
        <DonationStep1
          formData={formData}
          setFormData={setFormData}
          onNext={() => setStep(2)}
          eventData={{
            bloodTypes: eventBloodTypes,
            session,
            donationMorningStart,
            donationMorningEnd,
            donationAfternoonStart,
            donationAfternoonEnd,
          }}
          bloodTypes={bloodTypes}
          bloodTypeMap={bloodTypeMap}
        />
      )}
      {step === 2 && (
        <DonationStep2
          formData={formData}
          setFormData={setFormData}
          onBack={() => setStep(1)}
          onNext={handleSubmitAll}
        />
      )}
    </div>
  );
}