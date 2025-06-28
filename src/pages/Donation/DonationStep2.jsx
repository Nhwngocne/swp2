import React from 'react';

export default function DonationStep2({ formData, setFormData, onBack, onNext }) {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (Array.isArray(formData[name])) {
        setFormData((prev) => ({
          ...prev,
          [name]: checked
            ? [...(prev[name] || []), value]
            : (prev[name] || []).filter((item) => item !== value),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!formData.agreement) {
      alert('Bạn cần đồng ý cam kết trước khi đăng ký.');
      return;
    }
    onNext();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Câu hỏi sức khỏe</h3>

      <div className="mb-4">
        <p className="font-medium mb-2">1. Anh/chị từng hiến máu chưa?</p>
        <div className="flex gap-4">
          {['co', 'khong'].map((val) => (
            <label key={val} className="flex items-center gap-2">
              <input
                type="radio"
                name="donated_before"
                value={val}
                checked={formData.donated_before === val}
                onChange={handleInputChange}
              />
              {val === 'co' ? 'Có' : 'Không'}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p className="font-medium mb-2">2. Hiện tại, anh/chị có mắc bệnh lý nào không?</p>
        <div className="flex gap-4 mb-2">
          {['co', 'khong'].map((val) => (
            <label key={val} className="flex items-center gap-2">
              <input
                type="radio"
                name="current_illness"
                value={val}
                checked={formData.current_illness === val}
                onChange={handleInputChange}
              />
              {val === 'co' ? 'Có' : 'Không'}
            </label>
          ))}
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
        <p className="font-medium mb-2">3. Trước đây, anh/chị có từng mắc một trong các bệnh nguy hiểm không?</p>
        <div className="flex gap-4 mb-2">
          {['co', 'khong', 'benh_khac'].map((val) => (
            <label key={val} className="flex items-center gap-2">
              <input
                type="radio"
                name="past_diseases"
                value={val}
                checked={formData.past_diseases === val}
                onChange={handleInputChange}
              />
              {val === 'co' ? 'Có' : val === 'khong' ? 'Không' : 'Bệnh khác'}
            </label>
          ))}
        </div>
        <label className="block text-sm mb-2">Ghi rõ:</label>
        <textarea
          name="disease_details"
          value={formData.disease_details}
          onChange={handleInputChange}
          rows="2"
          className="w-full border border-gray-300 rounded px-3 py-2"
        ></textarea>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">4. Trong 12 tháng qua, anh/chị có:</p>
        <div className="space-y-2">
          {[
            { value: 'sot_ret', label: 'Mắc sốt rét, giang mai, lao, viêm não,...' },
            { value: 'truyen_mau', label: 'Được truyền máu hoặc chế phẩm' },
            { value: 'tiem_vaccine', label: 'Tiêm vaccine' },
            { value: 'khong', label: 'Không' },
          ].map((option) => (
            <label key={option.value} className="flex items-start gap-2">
              <input
                type="checkbox"
                name="past_year"
                value={option.value}
                checked={formData.past_year?.includes(option.value)}
                onChange={handleInputChange}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">5. Trong 6 tháng qua, anh/chị có:</p>
        <div className="space-y-2">
          {[
            { value: 'xam_hinh', label: 'Xăm mình / châm cứu' },
            { value: 'noi_mun', label: 'Nổi mụn nhọt, viêm da, lở loét...' },
          ].map((option) => (
            <label key={option.value} className="flex items-start gap-2">
              <input
                type="checkbox"
                name="past_6months"
                value={option.value}
                checked={formData.past_6months?.includes(option.value)}
                onChange={handleInputChange}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">6. Trong 1 tháng qua, anh/chị có:</p>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            name="past_month"
            value="nhan_thuoc"
            checked={formData.past_month?.includes('nhan_thuoc')}
            onChange={handleInputChange}
          />
          <span>Dùng thuốc kháng sinh hoặc kháng viêm?</span>
        </label>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">7. Trong 2 tuần qua, anh/chị có:</p>
        <textarea
          name="other_2weeks"
          value={formData.other_2weeks}
          onChange={handleInputChange}
          rows="2"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Ghi rõ các triệu chứng (nếu có)"
        ></textarea>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">8. Trong 1 tuần qua, anh/chị có:</p>
        <textarea
          name="other_week"
          value={formData.other_week}
          onChange={handleInputChange}
          rows="2"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Ghi rõ các triệu chứng (nếu có)"
        ></textarea>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">9. Đối với nữ giới:</p>
        <div className="space-y-2">
          {[
            { value: 'dang_co_kinh', label: 'Đang trong thời kỳ kinh nguyệt?' },
            { value: 'co_thai', label: 'Đang mang thai hoặc mới sinh/sảy thai?' },
            { value: 'khong_nu', label: 'Không' },
          ].map((option) => (
            <label key={option.value} className="flex items-start gap-2">
              <input
                type="checkbox"
                name="female_questions"
                value={option.value}
                checked={formData.female_questions?.includes(option.value)}
                onChange={handleInputChange}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            name="agreement"
            checked={formData.agreement || false}
            onChange={handleInputChange}
            required
          />
          <span>Tôi cam kết những thông tin trên là chính xác và đồng ý hiến máu tình nguyện.</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-500 text-white font-medium py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
}