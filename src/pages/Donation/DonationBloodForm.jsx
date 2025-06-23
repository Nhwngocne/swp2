import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import { useEvents } from "../../services/EventContext";
import DonationStep1 from "./DonationStep1";
import DonationStep2 from "./DonationStep2";
import "../../assets/css/pages/DonationBloodForm.css";

export default function DonationBloodForm() {
  const { user, isAuthenticated } = useAuth();
  const { createBloodDonationForm } = useEvents();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    eventId = 0,
    donation_date = "",
    location: eventLocation = "",
  } = location.state || {};
  console.log("State received:", location.state);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventId: eventId,
    memberId: user?.id || 0,
    donation_date: donation_date,
    location: eventLocation,
    blood_type: "",
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
      setFormError(
        "Không tìm thấy sự kiện. Vui lòng chọn sự kiện từ danh sách."
      );
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

    // Chuẩn bị formData an toàn
    const safeFormData = {
      ...formData,
      past_year: Array.isArray(formData.past_year) ? formData.past_year : [],
      past_6months: Array.isArray(formData.past_6months) ? formData.past_6months : [],
      past_month: Array.isArray(formData.past_month) ? formData.past_month : [],
      female_questions: Array.isArray(formData.female_questions) ? formData.female_questions : [],
      blood_type: formData.blood_type || "UNKNOWN",
      donated_before: formData.donated_before || "khong",
      current_illness: formData.current_illness || "khong",
      past_diseases: formData.past_diseases || "khong",
      illness_details: formData.illness_details || "",
      disease_details: formData.disease_details || "",
      other_2weeks: formData.other_2weeks || "",
      other_week: formData.other_week || "",
    };

    // Validate required fields
    if (
      !safeFormData.eventId ||
      !safeFormData.memberId ||
      !safeFormData.blood_type ||
      !safeFormData.donated_before ||
      !safeFormData.current_illness ||
      !safeFormData.past_diseases ||
      !Array.isArray(safeFormData.female_questions) ||
      !safeFormData.agreement
    ) {
      setFormError(
        "Vui lòng điền đầy đủ các trường bắt buộc và đồng ý cam kết."
      );
      return;
    }

    console.log("Safe FormData trước khi gửi:", safeFormData); // Log dữ liệu an toàn

    try {
      const result = await createBloodDonationForm(safeFormData);
      if (result.success) {
        setFormSuccess(result.message);
        setFormData({
          eventId: eventId,
          memberId: user?.id || 0,
          donation_date: "",
          location: "",
          blood_type: "",
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
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold text-center mb-6">
          FORM ĐĂNG KÝ HIẾN MÁU
        </h1>
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