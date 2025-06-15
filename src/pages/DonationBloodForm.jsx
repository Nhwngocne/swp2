import { useState } from 'react';
import '../assets/css/pages/DonationBloodForm.css'; //// Assuming you have a CSS file for styling
export default function DonationBloodForm() {
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-center mb-6">FORM ĐĂNG KÝ HIẾN MÁU</h1>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Chọn thời gian và địa điểm hiến máu</h3>
        
        <div className="mb-4">
          <label className="block font-medium mb-2">Chọn ngày hiến máu:</label>
          <input 
            type="date" 
            name="donation_date" 
            value={formData.donation_date}
            onChange={handleInputChange}
            required 
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        
        <div className="mb-4">
          <label className="block font-medium mb-2">Địa điểm hiến máu:</label>
          <select 
            name="location" 
            value={formData.location}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Chọn địa điểm</option>
            <option value="hien_mau_466">Hiến máu - 466 Nguyễn Thị Minh Khai (thời gian làm việc từ 7g đến 11g)</option>
            <option value="benh_vien_a">Bệnh viện A</option>
            <option value="benh_vien_b">Bệnh viện B</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block font-medium mb-2">Nhóm máu cần hiến:</label>
          <div className="flex gap-4">
            {['A', 'B', 'AB', 'O'].map(type => (
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
                value="co"
                checked={formData.donated_before === 'co'}
                onChange={handleInputChange}
              /> Có
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="donated_before" 
                value="khong"
                checked={formData.donated_before === 'khong'}
                onChange={handleInputChange}
              /> Không
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
                value="co"
                checked={formData.current_illness === 'co'}
                onChange={handleInputChange}
              /> Có
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="current_illness" 
                value="khong"
                checked={formData.current_illness === 'khong'}
                onChange={handleInputChange}
              /> Không
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
          <p className="font-medium mb-2">3. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C, HIV, vây nến, phỏi đường hô huyết, sốt phân vì, sá bằng mạch máu não, phổi mao cơ tim, lupus ban đỏ, đông kinh, ung thư, hen, được cắp ghép mô tạng?</p>
          <div className="flex gap-4 mb-2">
            {[
              { value: 'co', label: 'Có' },
              { value: 'khong', label: 'Không' },
              { value: 'benh_khac', label: 'Bệnh khác' }
            ].map(option => (
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
              { value: 'sot_ret', label: 'Khởi bệnh sau khi mắc một trong các bệnh: sốt rét, giang mai, lao, viêm não, mang não, uốn ván, phải thuật ngoại khoa?' },
              { value: 'truyen_mau', label: 'Được truyền máu hoặc các chế phẩm máu?' },
              { value: 'tiem_vaccine', label: 'Tiêm Vaccine?' },
              { value: 'khong', label: 'Không' }
            ].map(option => (
              <label key={option.value} className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  name="past_year" 
                  value={option.value}
                  checked={formData.past_year.includes(option.value)}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="font-medium mb-2">9. Đối với nữ giới cho hỏi thêm:</p>
          <div className="space-y-2">
            {[
              { value: 'dang_co_kinh', label: 'Hiện đã đang trong thời kỳ có kinh có đạt (2-3 tháng qua)?' },
              { value: 'co_thai', label: 'Chắn đảo thí có trong 12 tháng qua đây mấy tháng phái thấy thai hoặc sẩy cạng?' },
              { value: 'khong_nu', label: 'Không' }
            ].map(option => (
              <label key={option.value} className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  name="female_questions" 
                  value={option.value}
                  checked={formData.female_questions.includes(option.value)}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <span className="text-sm">{option.label}</span>
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
      </div>
    </div>
  );
}