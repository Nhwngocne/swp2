import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {eventService} from "../../services/eventService"; // Sửa nếu bạn dùng service khác
import { useNavigate } from "react-router-dom";

const CheckIn = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // formId
  const [formData, setFormData] = useState({
    formId: id,
    donatedBefore: false,
    hadSeriousDisease: false,
    hadMalariaOrOtherInfectious: false,
    receivedBlood: false,
    gotVaccine: false,
    noneOfAbove12Months: false,
    tattooOrAcupuncture: false,
    hadSkinIssues: false,
    usedAntibioticsOrAntiInflammatory: false,
    symptomsPast2Weeks: false,
    symptomsPast1Week: false,
    isMenstruating: false,
    isPregnantOrRecentlyDelivered: false,
    noneOfFemaleConditions: false,
    weight: "",
    height: "",
    bloodPressure: "",
    note: "",
    status: "CHECKIN", // Hoặc "REJECTED" tùy theo logic của bạn
    approvedByStaffId: null,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Lấy staffId từ localStorage/context nếu có
      const staffId = JSON.parse(localStorage.getItem("user"))?.id;
      const payload = { ...formData, approvedByStaffId: staffId };

      await eventService.updateBloodDonationFormByStaff(payload);
      alert("Check-in thành công!");
      navigate("/events");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi check-in.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Check-In Tình Trạng Sức Khỏe</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Câu hỏi: Lịch sử hiến máu */}
        <div className="space-y-2">
          <label>
            <input type="checkbox" name="donatedBefore" checked={formData.donatedBefore} onChange={handleChange} />
            Đã từng hiến máu
          </label>

          <label>
            <input type="checkbox" name="hadSeriousDisease" checked={formData.hadSeriousDisease} onChange={handleChange} />
            Từng mắc bệnh nghiêm trọng
          </label>

          <label>
            <input type="checkbox" name="hadMalariaOrOtherInfectious" checked={formData.hadMalariaOrOtherInfectious} onChange={handleChange} />
            Từng bị sốt rét hoặc bệnh truyền nhiễm
          </label>

          <label>
            <input type="checkbox" name="receivedBlood" checked={formData.receivedBlood} onChange={handleChange} />
            Đã từng truyền máu
          </label>

          <label>
            <input type="checkbox" name="gotVaccine" checked={formData.gotVaccine} onChange={handleChange} />
            Đã tiêm vắc xin trong 12 tháng qua
          </label>

          <label>
            <input type="checkbox" name="noneOfAbove12Months" checked={formData.noneOfAbove12Months} onChange={handleChange} />
            Không có điều nào ở trên trong 12 tháng
          </label>
        </div>

        {/* Câu hỏi: Da, thuốc, xăm */}
        <div className="space-y-2">
          <label>
            <input type="checkbox" name="tattooOrAcupuncture" checked={formData.tattooOrAcupuncture} onChange={handleChange} />
            Có xăm hoặc châm cứu
          </label>

          <label>
            <input type="checkbox" name="hadSkinIssues" checked={formData.hadSkinIssues} onChange={handleChange} />
            Có vấn đề về da
          </label>

          <label>
            <input type="checkbox" name="usedAntibioticsOrAntiInflammatory" checked={formData.usedAntibioticsOrAntiInflammatory} onChange={handleChange} />
            Đã dùng kháng sinh/kháng viêm gần đây
          </label>
        </div>

        {/* Câu hỏi: Triệu chứng gần đây */}
        <div className="space-y-2">
          <label>
            <input type="checkbox" name="symptomsPast2Weeks" checked={formData.symptomsPast2Weeks} onChange={handleChange} />
            Có triệu chứng trong 2 tuần qua
          </label>

          <label>
            <input type="checkbox" name="symptomsPast1Week" checked={formData.symptomsPast1Week} onChange={handleChange} />
            Có triệu chứng trong 1 tuần qua
          </label>
        </div>

        {/* Câu hỏi dành cho nữ */}
        <div className="space-y-2">
          <label>
            <input type="checkbox" name="isMenstruating" checked={formData.isMenstruating} onChange={handleChange} />
            Đang trong kỳ kinh
          </label>

          <label>
            <input type="checkbox" name="isPregnantOrRecentlyDelivered" checked={formData.isPregnantOrRecentlyDelivered} onChange={handleChange} />
            Đang mang thai hoặc mới sinh
          </label>

          <label>
            <input type="checkbox" name="noneOfFemaleConditions" checked={formData.noneOfFemaleConditions} onChange={handleChange} />
            Không thuộc các điều kiện trên
          </label>
        </div>

        {/* Kiểm tra sức khỏe */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Cân nặng (kg)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Chiều cao (cm)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Huyết áp</label>
            <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} className="border rounded px-3 py-2 w-full" placeholder="VD: 120/80" />
          </div>
        </div>

        {/* Ghi chú & Trạng thái */}
        <div>
          <label className="block text-sm font-medium">Ghi chú</label>
          <textarea name="note" value={formData.note} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium">Trạng thái</label>
          <select name="status" value={formData.status} onChange={handleChange} className="border rounded px-3 py-2 w-full">
            <option value="CHECKIN">Chấp nhận</option>
            <option value="REJECTED">Từ chối</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Cập nhật Check-In
        </button>
      </form>
    </div>
  );
};

export default CheckIn;
