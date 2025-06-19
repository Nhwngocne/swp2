import { useState } from 'react';
import '../assets/css/pages/DonationBloodForm.css';

export default function DonationBloodForm({ event }) {
  const [formData, setFormData] = useState({
    donation_date: event?.date || '',
    location: event?.location || '',
    blood_type: '',
    donated_before: '',
    current_illness: '',
    illness_details: '',
    past_diseases: '',
    disease_details: '',
    past_year: [],
    female_questions: [],
    agreement: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'agreement') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
            ? [...(prev[name] || []), value]
            : (prev[name] || []).filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Đăng ký hiến máu thành công!');
  };

  const handleReset = () => {
    setFormData({
      donation_date: event?.date || '',
      location: event?.location || '',
      blood_type: '',
      donated_before: '',
      current_illness: '',
      illness_details: '',
      past_diseases: '',
      disease_details: '',
      past_year: [],
      female_questions: [],
      agreement: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white donation-form-container">
      <h1 className="text-2xl font-bold text-center mb-6">FORM ĐĂNG KÝ HIẾN MÁU</h1>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Thông tin sự kiện</h3>
        <p><strong>Tiêu đề:</strong> {event?.title}</p>
        <p><strong>Ngày:</strong> {event?.date}</p>
        <p><strong>Địa điểm:</strong> {event?.location}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Nhóm máu của bạn:</label>
        <div className="flex flex-wrap gap-4">
          {['A', 'B', 'AB', 'O', 'unknown'].map(type => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="blood_type"
                value={type}
                checked={formData.blood_type === type}
                onChange={handleInputChange}
              />
              {type === 'unknown' ? 'Tôi không biết' : `Nhóm máu ${type}`}
            </label>
          ))}
        </div>
        {formData.donated_before === 'khong' && formData.blood_type === 'unknown' && (
          <p className="text-sm text-gray-500 mt-1 italic">
            Nếu bạn chưa từng xét nghiệm hoặc hiến máu, có thể bạn chưa biết nhóm máu của mình.
          </p>
        )}
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">1. Anh/chị từng hiến máu chưa?</p>
        <label className="mr-4">
          <input
            type="radio"
            name="donated_before"
            value="co"
            checked={formData.donated_before === 'co'}
            onChange={handleInputChange}
          /> Có
        </label>
        <label>
          <input
            type="radio"
            name="donated_before"
            value="khong"
            checked={formData.donated_before === 'khong'}
            onChange={handleInputChange}
          /> Không
        </label>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">2. Hiện tại, anh/chị có mắc bệnh lý nào không?</p>
        <label className="mr-4">
          <input type="radio" name="current_illness" value="co" checked={formData.current_illness === 'co'} onChange={handleInputChange} /> Có
        </label>
        <label>
          <input type="radio" name="current_illness" value="khong" checked={formData.current_illness === 'khong'} onChange={handleInputChange} /> Không
        </label>
        <textarea
          name="illness_details"
          placeholder="Nếu có, xin ghi rõ"
          value={formData.illness_details}
          onChange={handleInputChange}
          className="w-full border border-gray-300 mt-2 p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">3. Trước đây, anh/chị có từng mắc các bệnh nghiêm trọng?</p>
        <label className="mr-4">
          <input type="radio" name="past_diseases" value="co" checked={formData.past_diseases === 'co'} onChange={handleInputChange} /> Có
        </label>
        <label className="mr-4">
          <input type="radio" name="past_diseases" value="khong" checked={formData.past_diseases === 'khong'} onChange={handleInputChange} /> Không
        </label>
        <label>
          <input type="radio" name="past_diseases" value="benh_khac" checked={formData.past_diseases === 'benh_khac'} onChange={handleInputChange} /> Bệnh khác
        </label>
        <textarea
          name="disease_details"
          placeholder="Ghi rõ"
          value={formData.disease_details}
          onChange={handleInputChange}
          className="w-full border border-gray-300 mt-2 p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">4. Trong 12 tháng qua, anh/chị có:</p>
        {[
          { value: 'sot_ret', label: 'Bệnh sốt rét, lao, viêm não, uốn ván, phẫu thuật ngoại khoa' },
          { value: 'truyen_mau', label: 'Được truyền máu hoặc các chế phẩm máu' },
          { value: 'tiem_vaccine', label: 'Tiêm vaccine' },
          { value: 'khong', label: 'Không' }
        ].map(opt => (
          <div key={opt.value} className="mb-1">
            <label>
              <input
                type="checkbox"
                name="past_year"
                value={opt.value}
                checked={formData.past_year.includes(opt.value)}
                onChange={handleInputChange}
              />{' '}
              {opt.label}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">9. Đối với nữ giới:</p>
        {[
          { value: 'dang_co_kinh', label: 'Đang có kinh nguyệt (2-3 tháng gần đây)' },
          { value: 'co_thai', label: 'Có thai hoặc sẩy thai trong vòng 12 tháng' },
          { value: 'khong_nu', label: 'Không' }
        ].map(opt => (
          <div key={opt.value} className="mb-1">
            <label>
              <input
                type="checkbox"
                name="female_questions"
                value={opt.value}
                checked={formData.female_questions.includes(opt.value)}
                onChange={handleInputChange}
              />{' '}
              {opt.label}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            name="agreement"
            checked={formData.agreement}
            onChange={handleInputChange}
            required
          />
          <span>
            Tôi cam kết những thông tin trên là chính xác và đồng ý hiến máu tình nguyện.
          </span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Đăng ký hiến máu
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Làm lại
        </button>
      </div>
    </form>
  );
}
