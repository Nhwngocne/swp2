import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { eventService } from '../../services/eventService';
import DonationStep1 from './DonationStep1';
import DonationStep2 from './DonationStep2';
import '../../assets/css/pages/DonationBloodForm.css';

export default function DonationBloodForm() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy đầy đủ dữ liệu từ state
  const { eventId = 0, donation_date = '', location: eventLocation = '' } = location.state || {};
  console.log('State received:', location.state);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventId: eventId,
    memberId: user?.id || 0,
    donation_date: donation_date,
    location: eventLocation,
    blood_type: '',
    donated_before: '',
    current_illness: '',
    illness_details: '',
    past_diseases: '',
    disease_details: '',
    past_year: [],
    past_6months: [],
    past_month: [],
    past_2weeks: [],
    other_2weeks: '',
    past_week: [],
    other_week: '',
    female_questions: [],
    agreement: false,
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Cập nhật memberId khi user thay đổi
  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({ ...prev, memberId: user.id }));
    }
  }, [user]);

  // Kiểm tra eventId hợp lệ
  useEffect(() => {
    if (!eventId) {
      setFormError('Không tìm thấy sự kiện. Vui lòng chọn sự kiện từ danh sách.');
      navigate('/events');
    }
  }, [eventId, navigate]);

  const handleSubmitAll = async () => {
    setFormError(null);
    setFormSuccess(null);

    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      setFormError('Vui lòng đăng nhập để đăng ký hiến máu.');
      navigate('/login', { state: { from: '/donation-blood-form', eventId } });
      return;
    }

    // Kiểm tra các trường bắt buộc
    if (
      !formData.eventId ||
      !formData.memberId ||
      !formData.blood_type ||
      !formData.donated_before ||
      !formData.current_illness ||
      !formData.past_diseases ||
      !formData.agreement
    ) {
      setFormError('Vui lòng điền đầy đủ các trường bắt buộc và đồng ý cam kết.');
      return;
    }

    // Chuẩn bị payload cho API
    const payload = {
      eventId: parseInt(formData.eventId),
      memberId: formData.memberId,
      bloodType: formData.blood_type,
      donatedBefore: formData.donated_before === 'co' ? 'Có' : 'Không', // Ánh xạ giá trị
      currentIllness: formData.current_illness === 'co' ? 'Có' : 'Không',
      illnessDetails: formData.illness_details || '',
      pastDiseases: formData.past_diseases === 'co' ? 'Có' : formData.past_diseases === 'khong' ? 'Không' : 'Bệnh khác',
      diseaseDetails: formData.disease_details || '',
      pastYearActivities: JSON.stringify(formData.past_year),
      femaleQuestions: JSON.stringify(formData.female_questions),
      // Gộp các trường bổ sung nếu backend hỗ trợ
      additionalInfo: JSON.stringify({
        past_6months: formData.past_6months,
        past_month: formData.past_month,
        past_2weeks: formData.past_2weeks,
        other_2weeks: formData.other_2weeks,
        past_week: formData.past_week,
        other_week: formData.other_week,
      }),
    };

    try {
      const response = await eventService.createBloodDonationForm(payload);
      console.log('API response:', response.data);
      setFormSuccess('Đăng ký hiến máu thành công!');
      setFormData({
        eventId: eventId,
        memberId: user?.id || 0,
        donation_date: '',
        location: '',
        blood_type: '',
        donated_before: '',
        current_illness: '',
        illness_details: '',
        past_diseases: '',
        disease_details: '',
        past_year: [],
        past_6months: [],
        past_month: [],
        past_2weeks: [],
        other_2weeks: '',
        past_week: [],
        other_week: '',
        female_questions: [],
        agreement: false,
      });
      setStep(1);
      navigate('/events');
    } catch (error) {
      console.error('Create form error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Đăng ký hiến máu thất bại. Vui lòng thử lại.';
      setFormError(errorMessage);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold text-center mb-6">FORM ĐĂNG KÝ HIẾN MÁU</h1>
        <p className="text-red-500 text-center">Vui lòng đăng nhập để đăng ký hiến máu.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
      {formSuccess && <p className="text-green-500 text-center mb-4">{formSuccess}</p>}
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