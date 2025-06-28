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
    bloodTypes = [],
    session = "",
    donationMorningStart = "",
    donationMorningEnd = "",
    donationAfternoonStart = "",
    donationAfternoonEnd = "",
  } = location.state || {};
  console.log("State received:", location.state);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventId: eventId,
    memberId: user?.id || 0,
    donation_date: donation_date,
    location: eventLocation,
    volumeMl: "", // Thay blood_type bằng volumeMl
    session: "", // Thêm session (MORNING hoặc AFTERNOON)
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

    // Chuẩn bị payload khớp với BloodDonationFormCreateRequest
    const payload = {
      eventId: formData.eventId,
      memberId: formData.memberId,
      volumeMl: parseInt(formData.volumeMl),
      session: formData.session,
      donatedBefore: formData.donated_before === "co",
      currentlyIll: formData.current_illness === "co",
      illnessDetails: formData.illness_details || "",
      hadSeriousDisease: formData.past_diseases === "co" || formData.past_diseases === "benh_khac",
      diseaseDetails: formData.disease_details || "",
      hadMalariaOrOtherInfectious: formData.past_year?.includes("sot_ret") || false,
      receivedBlood: formData.past_year?.includes("truyen_mau") || false,
      gotVaccine: formData.past_year?.includes("tiem_vaccine") || false,
      noneOfAbove12Months: formData.past_year?.includes("khong") || false,
      tattooOrAcupuncture: formData.past_6months?.includes("xam_hinh") || false,
      hadSkinIssues: formData.past_6months?.includes("noi_mun") || false,
      usedAntibioticsOrAntiInflammatory: formData.past_month?.includes("nhan_thuoc") || false,
      symptomsPast2Weeks: formData.other_2weeks || "",
      symptomsPast1Week: formData.other_week || "",
      isMenstruating: formData.female_questions?.includes("dang_co_kinh") || false,
      isPregnantOrRecentlyDelivered: formData.female_questions?.includes("co_thai") || false,
      noneOfFemaleConditions: formData.female_questions?.includes("khong_nu") || false,
    };

    // Validate required fields
    if (
      !payload.eventId ||
      !payload.memberId ||
      !payload.volumeMl ||
      !payload.session ||
      !formData.donated_before ||
      !formData.current_illness ||
      !formData.past_diseases ||
      !formData.agreement
    ) {
      setFormError("Vui lòng điền đầy đủ các trường bắt buộc và đồng ý cam kết.");
      return;
    }

    console.log("Payload trước khi gửi:", payload); // Debug

    try {
      const result = await createBloodDonationForm(payload);
      if (result.success) {
        setFormSuccess(result.message);
        setFormData({
          eventId: eventId,
          memberId: user?.id || 0,
          donation_date: "",
          location: "",
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
          eventData={{
            bloodTypes,
            session,
            donationMorningStart,
            donationMorningEnd,
            donationAfternoonStart,
            donationAfternoonEnd,
          }}
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