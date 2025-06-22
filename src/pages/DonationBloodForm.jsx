

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/pages/DonationBloodForm.css';
import { useAuth } from '../services/AuthContext';
import { eventService } from '../services/eventService';

export default function DonationBloodForm() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy eventId từ state được truyền từ EventList
  const { eventId = 0 } = location.state || {};

  const [formData, setFormData] = useState({
    eventId: eventId,
    memberId: user?.id || 0,

    blood_type: '',
    donated_before: '',
    current_illness: '',
    illness_details: '',
    past_diseases: '',
    disease_details: '',
    past_year: [],
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

  // Kiểm tra eventId hợp lệ khi component mount
  useEffect(() => {
    if (!eventId) {
      setFormError('Không tìm thấy sự kiện. Vui lòng chọn sự kiện từ danh sách.');
      navigate('/events'); // Chuyển hướng về trang danh sách sự kiện nếu không có eventId
    }
  }, [eventId, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'agreement') {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: checked
            ? [...(prev[name] || []), value]
            : (prev[name] || []).filter((item) => item !== value),
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    // Chuẩn bị payload cho backend
    const payload = {
      eventId: parseInt(formData.eventId),
      memberId: formData.memberId,
      bloodType: formData.blood_type,
      donatedBefore: formData.donated_before,
      currentIllness: formData.current_illness,
      illnessDetails: formData.illness_details || '',
      pastDiseases: formData.past_diseases,
      diseaseDetails: formData.disease_details || '',
      pastYearActivities: JSON.stringify(formData.past_year),
      femaleQuestions: JSON.stringify(formData.female_questions),
    };

    try {
      const response = await eventService.createBloodDonationForm(payload);
      console.log('API response:', response.data);
      setFormSuccess('Đăng ký hiến máu thành công!');
      handleReset();
      navigate('/events'); // Chuyển hướng về trang danh sách sự kiện sau khi thành công
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

  const handleReset = () => {
    setFormData({
      eventId: eventId,
      memberId: user?.id || 0,
      blood_type: '',
      donated_before: '',
      current_illness: '',
      illness_details: '',
      past_diseases: '',
      disease_details: '',
      past_year: [],
      female_questions: [],
      agreement: false,
    });
    setFormError(null);
    setFormSuccess(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-2xl font-bold text-center mb-6">FORM ĐĂNG KÝ HIẾN MÁU</h1>
        <p className="text-red-500 text-center">Vui lòng đăng nhập để đăng ký hiến máu.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white donation-form-container">
      <h1 className="text-2xl font-bold text-center mb-6">FORM ĐĂNG KÝ HIẾN MÁU</h1>

      {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
      {formSuccess && <p className="text-green-500 text-center mb-4">{formSuccess}</p>}

      <div>
        <h3 className="text-lg font-semibold mb-4">Thông tin hiến máu</h3>

        <div className="mb-6">
          <label className="block font-medium mb-2">Nhóm máu cần hiến:</label>
          <div className="flex gap-4">
            {['A', 'B', 'AB', 'O'].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="blood_type"
                  value={type}
                  checked={formData.blood_type === type}
                  onChange={handleInputChange}
                />
                Nhóm máu {type}
              </label>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Câu hỏi sức khỏe</h3>

        <div className="mb-4">
          <p className="font-medium mb-2">1. Anh/chị từng hiến máu chưa?</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="donated_before"
                value="Có"
                checked={formData.donated_before === 'Có'}
                onChange={handleInputChange}
              />
              Có
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="donated_before"
                value="Không"
                checked={formData.donated_before === 'Không'}
                onChange={handleInputChange}
              />
              Không
            </label>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-2">2. Hiện tại, anh/chị có mắc bệnh lý nào không?</p>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="current_illness"
                value="Có"
                checked={formData.current_illness === 'Có'}
                onChange={handleInputChange}
              />
              Có
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="current_illness"
                value="Không"
                checked={formData.current_illness === 'Không'}
                onChange={handleInputChange}
              />
              Không
            </label>
          </div>
          <label className="block text-sm mb-2">Nếu có, xin ghi rõ:</label>
          <textarea
            name="illness_details"
            value={formData.illness_details}
            onChange={handleInputChange}
            rows="2"
            className="w-full border border-gray-300 rounded px-3 py-2"
          ></textarea>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-3">
            3. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C, HIV, vảy nến, phổi, bệnh lý đường hô hấp, sốt xuất huyết, sởi, bệnh lý mạch máu não, phổi, lupus ban đỏ, động kinh, ung thư, hen, hoặc được cấy ghép tạng?
          </p>
          <div className="flex gap-4 mb-2">
            {[
              { value: 'Có', label: 'Có' },
              { value: 'Không', label: 'Không' },
              { value: 'Bệnh khác Responds' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="past_diseases"
                  value={option.value}
                  checked={formData.past_diseases === option.value}
                  onChange={handleInputChange}
                />
                {option.label}
              </label>
            ))}
          </div>
          <label className="block text-sm font-medium mb-2">Ghi rõ:</label>
          <textarea
            name="disease_details"
            value={formData.disease_details}
            onChange={handleInputChange}
            rows="2"
            className="w-full border border-gray-300 rounded px-3 py-2"
          ></textarea>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-3">4. Trong 12 tháng qua, anh/chị có:</p>
          <div className="space-y-3">
            {[
              { value: 'sot_ret', label: 'Khởi bệnh sau khi mắc một trong các bệnh: sốt rét, giang mai, lao, viêm não, màng não, uốn ván, hoặc phẫu thuật ngoại khoa?' },
              { value: 'truyen_mau', label: 'Được truyền máu hoặc các chế phẩm máu?' },
              { value: 'tiem_vaccine', label: 'Tiêm Vaccine?' },
              { value: 'khong', label: 'Không' },
            ].map((item) => (
              <label key={item.value} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="past_year"
                  value={item.value}
                  checked={formData.past_year.includes(item.value)}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-3">5. Đối với nữ giới, cho hỏi thêm:</p>
          <div className="space-y-3">
            {[
              { value: 'dang_co_kinh', label: 'Hiện đang trong thời kỳ có kinh (2-3 tháng qua)?' },
              { value: 'co_thai', label: 'Có thai hoặc sảy thai trong 12 tháng qua?' },
              { value: 'khong_nu', label: 'Không' },
            ].map((item) => (
              <label key={item.value} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="female_questions"
                  value={item.value}
                  checked={formData.female_questions.includes(item.value)}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Cam kết</h3>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="agreement"
              checked={formData.agreement}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
            <span>Tôi cam kết những thông tin trên là chính xác và đồng ý hiến máu tình nguyện.</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
          >
            Đăng ký
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 text-white font-medium py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
          >
            Làm lại
          </button>
        </div>
      </div>

      
    </form>
  );
}
