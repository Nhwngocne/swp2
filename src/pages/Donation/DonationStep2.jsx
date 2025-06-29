import React from 'react';
import '../../assets/css/pages/DonationStep2.css';

export default function DonationStep2({ formData, setFormData, onBack, onNext }) {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const prev = formData[name] || [];
      if (checked) {
        setFormData({ ...formData, [name]: [...prev, value] });
      } else {
        setFormData({ ...formData, [name]: prev.filter(v => v !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
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

      {/* 1 */}
      <div className="mb-4">
        <p>1. Anh/chị từng hiến máu chưa?</p>
        <label>
          <input type="radio" name="donated_before" value="co"
            checked={formData.donated_before === 'co'}
            onChange={handleInputChange} /> Có
        </label>
        <label>
          <input type="radio" name="donated_before" value="khong"
            checked={formData.donated_before === 'khong'}
            onChange={handleInputChange} /> Không
        </label>
      </div>

      {/* 2 */}
      <div className="mb-4">
        <p>2. Hiện tại, anh/chị có mắc bệnh lý nào không?</p>
        <label>
          <input type="radio" name="current_illness" value="co"
            checked={formData.current_illness === 'co'}
            onChange={handleInputChange} /> Có
        </label>
        <label>
          <input type="radio" name="current_illness" value="khong"
            checked={formData.current_illness === 'khong'}
            onChange={handleInputChange} /> Không
        </label>
        <textarea name="illness_details"
          value={formData.illness_details || ''}
          onChange={handleInputChange}
          placeholder="Nếu có, ghi rõ" />
      </div>

      {/* 3 */}
      <div className="mb-4">
        <p>. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C, 
          HIV, vảy nến, phì đại tiền liệt tuyến, sốc phản vệ, tai biến mạch máu não, 
          nhồi máu cơ tim, lupus ban đỏ, động kinh, ung thư, hen, được cấy ghép mô tạng?</p>
        <label>
          <input type="radio" name="past_diseases" value="co"
            checked={formData.past_diseases === 'co'}
            onChange={handleInputChange} /> Có
        </label>
        <label>
          <input type="radio" name="past_diseases" value="khong"
            checked={formData.past_diseases === 'khong'}
            onChange={handleInputChange} /> Không
        </label>
        <label>
          <input type="radio" name="past_diseases" value="benh_khac"
            checked={formData.past_diseases === 'benh_khac'}
            onChange={handleInputChange} /> Bệnh khác
        </label>
        <textarea name="disease_details"
          value={formData.disease_details || ''}
          onChange={handleInputChange}
          placeholder="Ghi rõ bệnh nếu chọn trên" />
      </div>

      {/* 4 */}
      <div className="mb-4">
        <p>4. Trong 12 tháng qua, anh/chị có:</p>
        <label><input type="checkbox" name="past_year" value="sot_ret"
          checked={formData.past_year?.includes('sot_ret')}
          onChange={handleInputChange} /> Khỏi bệnh sau khi mắc một trong các bệnh: sốt rét,
           giang mai, lao, viêm não-màng não, uốn ván, phẫu thuật ngoại khoa?</label>
        <label><input type="checkbox" name="past_year" value="truyen_mau"
          checked={formData.past_year?.includes('truyen_mau')}
          onChange={handleInputChange} /> Được truyền máu hoặc chế phẩm máu</label>
        <label><input type="checkbox" name="past_year" value="tiem_vaccine"
          checked={formData.past_year?.includes('tiem_vaccine')}
          onChange={handleInputChange} /> Tiêm vaccine</label>
        <label><input type="checkbox" name="past_year" value="khong"
          checked={formData.past_year?.includes('khong')}
          onChange={handleInputChange} /> Không</label>
      </div>

      {/* 5 */}
      <div className="mb-4">
        <p>5. Trong 6 tháng qua, anh/chị có:</p>
        <label><input type="checkbox" name="past_6months" value="xam_hinh"
          checked={formData.past_6months?.includes('xam_hinh')}
          onChange={handleInputChange} /> Khỏi bệnh sau khi mắc một trong các bệnh: thương hàn, nhiễm trùng máu, bị rắn cắn, 
          viêm tắc động mạch, viêm tắc tĩnh mạch, viêm tụy, viêm tủy xương?</label>
        <label><input type="checkbox" name="past_6months" value="noi_mun"
          checked={formData.past_6months?.includes('noi_mun')}
          onChange={handleInputChange} /> Sút cân nhanh không rõ nguyên nhân?</label>
           <label><input type="checkbox" name="past_6months" value="noi_mun"
          checked={formData.past_6months?.includes('noi_mun')}
          onChange={handleInputChange} />Nổi hạch kéo dài?</label>
          
           <label><input type="checkbox" name="past_6months" value="noi_mun"
          checked={formData.past_6months?.includes('noi_mun')}
          onChange={handleInputChange} /> Thực hiện thủ thuật y tế xâm lấn (chữa răng, châm cứu, lăn kim, nội soi,…)?</label>
           <label><input type="checkbox" name="past_6months" value="noi_mun"
          checked={formData.past_6months?.includes('noi_mun')}
          onChange={handleInputChange} /> Xăm, xỏ lỗ tai, lỗ mũi hoặc các vị trí khác trên cơ thể?</label>
          <label><input type="checkbox" name="past_6months" value="noi_mun"
          checked={formData.past_6months?.includes('noi_mun')}
          onChange={handleInputChange} /> Sử dụng ma túy?</label>
          <label><input type="checkbox" name="past_6months" value="noi_mun"
          checked={formData.past_6months?.includes('noi_mun')}
          onChange={handleInputChange} /> Tiếp xúc trực tiếp với máu, dịch tiết của người khác hoặc bị thương bởi kim tiêm?</label>
          <label><input type="checkbox" name="past_6months" value="noi_mun"
          checked={formData.past_6months?.includes('noi_mun')}
          onChange={handleInputChange} /> Sinh sống chung với người nhiễm bệnh Viêm gan siêu vi B?</label>
          <label><input type="checkbox" name="past_6months" value="noi_mun"
          checked={formData.past_6months?.includes('noi_mun')}
          onChange={handleInputChange} /> Quan hệ tình dục với người nhiễm viêm gan siêu vi B, C, HIV, giang mai hoặc người có nguy cơ nhiễm viêm gan siêu vi B, C, HIV, giang mai?</label>
          <label><input type="checkbox" name="past_6months" value="noi_mun"
          checked={formData.past_6months?.includes('noi_mun')}
          onChange={handleInputChange} /> Quan hệ tình dục với người cùng giới?</label>
          <label><input type="checkbox" name="past_6months" value="noi_mun"
          checked={formData.past_6months?.includes('noi_mun')}
          onChange={handleInputChange} /> Không</label>
       
      </div>

      {/* 6 */}
      <div className="mb-4">
        <p>6. Trong 1 tháng qua, anh/chị có dùng thuốc kháng sinh?</p>
        <label><input type="checkbox" name="past_month" value="nhan_thuoc"
          checked={formData.past_month?.includes('nhan_thuoc')}
          onChange={handleInputChange} /> Khỏi bệnh sau khi mắc bệnh viêm đường tiết niệu,
           viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, tả, Rubella?</label>
           <label><input type="checkbox" name="past_month" value="nhan_thuoc"
          checked={formData.past_month?.includes('nhan_thuoc')}
          onChange={handleInputChange} /> Đi vào vùng có dịch bệnh lưu hành
           (sốt rét, sốt xuất huyết, Zika,…)?</label>
           <label><input type="checkbox" name="past_month" value="nhan_thuoc"
          checked={formData.past_month?.includes('nhan_thuoc')}
          onChange={handleInputChange} /> Không</label>
      </div>

      {/* 7 */}
      <div className="mb-4">
        <p>7. Trong 2 tuần qua, anh/chị có:</p>
         <label><input type="checkbox" name="past_month" value="nhan_thuoc"
          checked={formData.past_month?.includes('nhan_thuoc')}
          onChange={handleInputChange} /> Bị cúm, cảm lạnh, ho, nhức đầu, sốt, đau họng?</label>
           <label><input type="checkbox" name="past_month" value="nhan_thuoc"
          checked={formData.past_month?.includes('nhan_thuoc')}
          onChange={handleInputChange} /> Không</label>
        <textarea name="other_2weeks"
          value={formData.other_2weeks || ''}
          onChange={handleInputChange}
          placeholder="khác (Ghi rõ nếu có triệu chứng)" />
      </div>

      {/* 8 */}
      <div className="mb-4">
        <p>8. Trong 1 tuần qua, anh/chị có:</p>
        <label><input type="checkbox" name="past_month" value="nhan_thuoc"
          checked={formData.past_month?.includes('nhan_thuoc')}
          onChange={handleInputChange} /> Dùng thuốc kháng sinh, kháng viêm, Aspirin, Corticoid?</label>
          <label><input type="checkbox" name="past_month" value="nhan_thuoc"
          checked={formData.past_month?.includes('nhan_thuoc')}
          onChange={handleInputChange} /> Không</label>
        <textarea name="other_week"
          value={formData.other_week || ''}
          onChange={handleInputChange}
          placeholder="khác (Ghi rõ nếu có triệu chứng)" />
      </div>

      {/* 9 */}
      <div className="mb-4">
        <p>9. Câu hỏi dành cho phụ nữ:</p>
        <label><input type="checkbox" name="female_questions" value="dang_co_kinh"
          checked={formData.female_questions?.includes('dang_co_kinh')}
          onChange={handleInputChange} /> Đang có kinh nguyệt</label>
       <label>
  <input type="checkbox" name="female_questions" value="co_thai"
    checked={formData.female_questions?.includes('co_thai')}
    onChange={handleInputChange} />
  Đang mang thai hoặc nuôi con &lt;12 tháng
</label>

        <label><input type="checkbox" name="female_questions" value="khong"
          checked={formData.female_questions?.includes('khong')}
          onChange={handleInputChange} /> Không</label>
      </div>

      {/* Cam kết */}
      <div className="mb-4 agreement">
        <label>
          <input type="checkbox" name="agreement"
            checked={formData.agreement || false}
            onChange={handleInputChange} />
          Tôi cam kết thông tin là chính xác và đồng ý hiến máu.
        </label>
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button type="button" onClick={onBack} className="btn-back">Quay lại</button>
        <button type="button" onClick={handleSubmit} className="btn-submit">Tiếp theo</button>
      </div>
    </div>
  );
}
