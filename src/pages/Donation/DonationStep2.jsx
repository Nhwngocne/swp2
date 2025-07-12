import React, { useState } from 'react'; // Thêm useState
import '../../assets/css/pages/DonationStep2.css';

export default function DonationStep2({ formData, setFormData, onBack, onNext }) {
  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const prev = formData[name] || [];
      let updatedValues;
      if (value === 'khong' && checked) {
        // Nếu tích "Không", chỉ giữ "khong" và bỏ các lựa chọn khác
        updatedValues = ['khong'];
      } else if (value === 'khong' && !checked) {
        // Nếu bỏ tích "Không", xóa "khong" khỏi danh sách
        updatedValues = prev.filter((v) => v !== 'khong');
      } else if (checked) {
        // Nếu tích một lựa chọn khác, thêm nó vào và bỏ "khong"
        updatedValues = [...prev.filter((v) => v !== 'khong'), value];
      } else {
        // Nếu bỏ tích một lựa chọn khác, xóa nó
        updatedValues = prev.filter((v) => v !== value);
      }
      setFormData({ ...formData, [name]: updatedValues });
      setErrors((prev) => ({ ...prev, [name]: '' })); // Xóa lỗi khi thay đổi
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  const validateForm = () => {
    const newErrors = [];
    if (!['co', 'khong'].includes(formData.donated_before)) {
      newErrors.push('Câu 1: Vui lòng chọn Có hoặc Không.');
    }
    if (!['co', 'khong'].includes(formData.past_diseases)) {
      newErrors.push('Câu 2: Vui lòng chọn Có hoặc Không.');
    }
    if (!Array.isArray(formData.past_year) || formData.past_year.length === 0) {
      newErrors.push('Câu 3: Vui lòng chọn ít nhất một lựa chọn.');
    }
    if (!Array.isArray(formData.past_6months) || formData.past_6months.length === 0) {
      newErrors.push('Câu 4: Vui lòng chọn ít nhất một lựa chọn.');
    }
    if (!Array.isArray(formData.past_month) || formData.past_month.length === 0) {
      newErrors.push('Câu 5: Vui lòng chọn ít nhất một lựa chọn.');
    }
    if (!Array.isArray(formData.past_2weeks) || formData.past_2weeks.length === 0) {
      newErrors.push('Câu 6: Vui lòng chọn ít nhất một lựa chọn.');
    }
    if (!Array.isArray(formData.past_week) || formData.past_week.length === 0) {
      newErrors.push('Câu 7: Vui lòng chọn ít nhất một lựa chọn.');
    }
    if (!Array.isArray(formData.female_questions) || formData.female_questions.length === 0) {
      newErrors.push('Câu 8: Vui lòng chọn ít nhất một lựa chọn.');
    }
    if (!formData.agreement) {
      newErrors.push('Vui lòng đồng ý cam kết.');
    }
    // Kiểm tra điều kiện loại trừ
    const reasons = [];
    if (formData.past_diseases === 'co') {
      reasons.push('Bạn từng mắc các bệnh nguy hiểm như HIV, viêm gan B/C, v.v.');
    }
    if (formData.past_year?.includes('truyen_mau')) {
      reasons.push('Bạn đã được truyền máu trong 12 tháng qua.');
    }
    if (formData.past_6months?.includes('ma_tuy')) {
      reasons.push('Bạn có sử dụng ma túy trong 6 tháng qua.');
    }
    if (formData.past_6months?.includes('qhtd_nguy_co')) {
      reasons.push('Bạn có quan hệ tình dục với người có nguy cơ cao.');
    }
    if (formData.past_6months?.includes('qhtd_dong_gioi')) {
      reasons.push('Bạn có quan hệ đồng giới trong 6 tháng qua.');
    }
    if (formData.past_6months?.includes('song_chung_virusB')) {
      reasons.push('Bạn sống chung với người nhiễm virus viêm gan B.');
    }
    if (formData.past_month?.includes('vung_dich')) {
      reasons.push('Bạn từng đi vào vùng dịch bệnh trong 1 tháng qua.');
    }
    if (formData.past_2weeks?.includes('cum_cam_lanh')) {
      reasons.push('Bạn đang bị cảm, cúm, sốt, đau họng trong 2 tuần qua.');
    }
    if (formData.past_week?.includes('thuoc_khang_sinh')) {
      reasons.push('Bạn đang sử dụng thuốc kháng sinh/kháng viêm.');
    }
    if (formData.female_questions?.includes('co_thai')) {
      reasons.push('Bạn đang mang thai hoặc nuôi con dưới 12 tháng.');
    }
    if (reasons.length > 0) {
      newErrors.push('Bạn không đủ điều kiện hiến máu vì:\n' + reasons.map((r, i) => `${i + 1}. ${r}`).join('\n'));
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors.reduce((obj, err, index) => ({ ...obj, [`error${index}`]: err }), {})); // Lưu lỗi vào state
      alert(validationErrors.join('\n')); // Hiển thị tất cả lỗi qua alert
      return; // Chặn gọi onNext
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
        <p>2. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C,
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
      </div>

      {/* 3 */}
      <div className="mb-4">
        <p>3. Trong 12 tháng qua, anh/chị có:</p>
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

      {/* 4 */}
      <div className="mb-4">
        <p>4. Trong 6 tháng qua, anh/chị có:</p>
        <label><input type="checkbox" name="past_6months" value="thuong_han"
          checked={formData.past_6months?.includes('thuong_han')}
          onChange={handleInputChange} /> Khỏi bệnh sau các bệnh: thương hàn, nhiễm trùng máu, v.v.</label>
        <label><input type="checkbox" name="past_6months" value="sut_can"
          checked={formData.past_6months?.includes('sut_can')}
          onChange={handleInputChange} /> Sút cân nhanh không rõ nguyên nhân?</label>
        <label><input type="checkbox" name="past_6months" value="noi_hach"
          checked={formData.past_6months?.includes('noi_hach')}
          onChange={handleInputChange} /> Nổi hạch kéo dài?</label>
        <label><input type="checkbox" name="past_6months" value="thu_thuat"
          checked={formData.past_6months?.includes('thu_thuat')}
          onChange={handleInputChange} /> Thủ thuật y tế xâm lấn?</label>
        <label><input type="checkbox" name="past_6months" value="xam_xo"
          checked={formData.past_6months?.includes('xam_xo')}
          onChange={handleInputChange} /> Xăm, xỏ khuyên?</label>
        <label><input type="checkbox" name="past_6months" value="ma_tuy"
          checked={formData.past_6months?.includes('ma_tuy')}
          onChange={handleInputChange} /> Sử dụng ma túy?</label>
        <label><input type="checkbox" name="past_6months" value="kim_tiem"
          checked={formData.past_6months?.includes('kim_tiem')}
          onChange={handleInputChange} /> Tiếp xúc với máu, bị kim đâm?</label>
        <label><input type="checkbox" name="past_6months" value="song_chung_virusB"
          checked={formData.past_6months?.includes('song_chung_virusB')}
          onChange={handleInputChange} /> Sống chung người nhiễm virus B?</label>
        <label><input type="checkbox" name="past_6months" value="qhtd_nguy_co"
          checked={formData.past_6months?.includes('qhtd_nguy_co')}
          onChange={handleInputChange} /> Quan hệ với người có nguy cơ?</label>
        <label><input type="checkbox" name="past_6months" value="qhtd_dong_gioi"
          checked={formData.past_6months?.includes('qhtd_dong_gioi')}
          onChange={handleInputChange} /> Quan hệ đồng giới?</label>
        <label><input type="checkbox" name="past_6months" value="khong"
          checked={formData.past_6months?.includes('khong')}
          onChange={handleInputChange} /> Không</label>
      </div>

      {/* 5 */}
      <div className="mb-4">
        <p>5. Trong 1 tháng qua, anh/chị có dùng thuốc kháng sinh?</p>
        <label>
          <input type="checkbox" name="past_month" value="viem_duong_tiet_niu"
            checked={formData.past_month?.includes('viem_duong_tiet_niu')}
            onChange={handleInputChange} />
          Khỏi bệnh sau khi mắc bệnh viêm đường tiết niệu, viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, tả, Rubella?
        </label>
        <label>
          <input type="checkbox" name="past_month" value="vung_dich"
            checked={formData.past_month?.includes('vung_dich')}
            onChange={handleInputChange} />
          Đi vào vùng có dịch bệnh lưu hành (sốt rét, sốt xuất huyết, Zika,…)?
        </label>
        <label>
          <input type="checkbox" name="past_month" value="khong"
            checked={formData.past_month?.includes('khong')}
            onChange={handleInputChange} />
          Không
        </label>
      </div>

      {/* 6 */}
      {/* 6 */}
      <div className="mb-4">
        <p>6. Trong 2 tuần qua, anh/chị có:</p>
        <label>
          <input type="checkbox" name="past_2weeks" value="cum_cam_lanh"
            checked={formData.past_2weeks?.includes('cum_cam_lanh')}
            onChange={handleInputChange} />
          Bị cúm, cảm lạnh, ho, nhức đầu, sốt, đau họng?
        </label>
        <label>
          <input type="checkbox" name="past_2weeks" value="khong"
            checked={formData.past_2weeks?.includes('khong')}
            onChange={handleInputChange} />
          Không
        </label>
      </div>


      {/* 7 */}
      {/* 7 */}
      <div className="mb-4">
        <p>7. Trong 1 tuần qua, anh/chị có:</p>
        <label>
          <input type="checkbox" name="past_week" value="thuoc_khang_sinh"
            checked={formData.past_week?.includes('thuoc_khang_sinh')}
            onChange={handleInputChange} />
          Dùng thuốc kháng sinh, kháng viêm, Aspirin, Corticoid?
        </label>
        <label>
          <input type="checkbox" name="past_week" value="khong"
            checked={formData.past_week?.includes('khong')}
            onChange={handleInputChange} />
          Không
        </label>
      </div>


      {/* 8 */}
      <div className="mb-4">
        <p>8. Câu hỏi dành cho phụ nữ:</p>
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
        <button type="button" onClick={handleSubmit} className="btn-submit">Đăng kí</button>
      </div>
    </div>
  );
}
