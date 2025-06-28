import React from 'react';
import '../../assets/css/pages/DonationStep2.css'; // Import your CSS styles
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
    <div className="step-section">
      <h3>Câu hỏi sức khỏe</h3>

      <div className="mb-4">
        <p>1. Anh/chị từng hiến máu chưa?</p>
        <div className="volume-options">
          {['co', 'khong'].map((val) => (
            <label key={val}>
              <input type="radio" name="donated_before" value={val} checked={formData.donated_before === val} onChange={handleInputChange} />
              {val === 'co' ? 'Có' : 'Không'}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p>2. Hiện tại, anh/chị có mắc bệnh lý nào không?</p>
        <div className="volume-options">
          {['co', 'khong'].map((val) => (
            <label key={val}>
              <input type="radio" name="current_illness" value={val} checked={formData.current_illness === val} onChange={handleInputChange} />
              {val === 'co' ? 'Có' : 'Không'}
            </label>
          ))}
        </div>
        <textarea name="illness_details" value={formData.illness_details} onChange={handleInputChange} placeholder="Nếu có, ghi rõ" />
      </div>

      <div className="mb-4">
        <p>3. Từng mắc bệnh nguy hiểm?</p>
        <div className="volume-options">
          {['co', 'khong', 'benh_khac'].map((val) => (
            <label key={val}>
              <input type="radio" name="past_diseases" value={val} checked={formData.past_diseases === val} onChange={handleInputChange} />
              {val === 'co' ? 'Có' : val === 'khong' ? 'Không' : 'Bệnh khác'}
            </label>
          ))}
        </div>
        <textarea name="disease_details" value={formData.disease_details} onChange={handleInputChange} placeholder="Ghi rõ bệnh" />
      </div>

      <div className="mb-4">
        <p>4. Trong 12 tháng qua:</p>
        <div className="space-y-2">
          {['sot_ret', 'truyen_mau', 'tiem_vaccine', 'khong'].map((val) => (
            <label key={val}>
              <input type="checkbox" name="past_year" value={val} checked={formData.past_year?.includes(val)} onChange={handleInputChange} />
              {val === 'sot_ret' ? 'Mắc sốt rét...' : val === 'truyen_mau' ? 'Truyền máu' : val === 'tiem_vaccine' ? 'Tiêm vaccine' : 'Không'}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p>5. Trong 6 tháng qua:</p>
        <div className="space-y-2">
          {['xam_hinh', 'noi_mun'].map((val) => (
            <label key={val}>
              <input type="checkbox" name="past_6months" value={val} checked={formData.past_6months?.includes(val)} onChange={handleInputChange} />
              {val === 'xam_hinh' ? 'Xăm mình' : 'Nổi mụn'}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p>6. Trong 1 tháng qua:</p>
        <label>
          <input type="checkbox" name="past_month" value="nhan_thuoc" checked={formData.past_month?.includes('nhan_thuoc')} onChange={handleInputChange} />
          Dùng thuốc kháng sinh?
        </label>
      </div>

      <div className="mb-4">
        <p>7. Trong 2 tuần qua:</p>
        <textarea name="other_2weeks" value={formData.other_2weeks} onChange={handleInputChange} placeholder="Ghi rõ các triệu chứng (nếu có)" />
      </div>

      <div className="mb-4">
        <p>8. Trong 1 tuần qua:</p>
        <textarea name="other_week" value={formData.other_week} onChange={handleInputChange} placeholder="Ghi rõ các triệu chứng (nếu có)" />
      </div>

      <div className="mb-4">
        <p>9. Dành cho nữ giới:</p>
        <div className="space-y-2">
          {['dang_co_kinh', 'co_thai', 'khong_nu'].map((val) => (
            <label key={val}>
              <input type="checkbox" name="female_questions" value={val} checked={formData.female_questions?.includes(val)} onChange={handleInputChange} />
              {val === 'dang_co_kinh' ? 'Đang có kinh' : val === 'co_thai' ? 'Mang thai' : 'Không'}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 agreement">
        <label>
          <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleInputChange} />
          Tôi cam kết thông tin là chính xác và đồng ý hiến máu.
        </label>
      </div>

      <div className="button-group">
        <button type="button" onClick={onBack} className="btn-back">Quay lại</button>
        <button type="button" onClick={handleSubmit} className="btn-submit">Đăng ký</button>
      </div>
    </div>
  );
}
