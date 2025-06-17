import { useState } from 'react';
import DonationStep1 from './DonationStep1';
import DonationStep2 from './DonationStep2';

export default function DonationBloodForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
    agreement: false
  });

  const handleSubmitAll = () => {
    console.log('Tổng dữ liệu:', formData);
    alert('Đăng ký hiến máu thành công!');
    // Gửi dữ liệu API tại đây nếu cần
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      {step === 1 && (
        <DonationStep1 formData={formData} setFormData={setFormData} onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <DonationStep2 formData={formData} setFormData={setFormData} onBack={() => setStep(1)} onNext={handleSubmitAll} />
      )}
    </div>
  );
}