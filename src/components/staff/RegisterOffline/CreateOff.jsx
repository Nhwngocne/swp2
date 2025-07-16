import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../services/AuthContext";
import { donationService } from "../../../services/donationService";
import "../../../assets/css/components/staff/CreateOff.css";


const CreateOff = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    numberCccd: "",
    address: "",
    email: "",
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
    location: "",
    staffId: user?.id || null,
    weight: "",
    height: "",
    bloodPressure: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await donationService.createRegisOffline(formData);
      alert("Nộp đơn đăng ký thành công!");
      navigate("/registerOff");
    } catch (error) {
      console.error("Lỗi khi gửi đơn đăng ký offline:", error);
      alert("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
      <div className="create-off-container">

      <h2>Đăng ký hiến máu trực tiếp</h2>
      <form onSubmit={handleSubmit}>
        {/* Thông tin cá nhân */}
        <input type="text" name="name" placeholder="Họ và tên" value={formData.name} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required />
        <input type="text" name="numberCccd" placeholder="Số CCCD" value={formData.numberCccd} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

        {/* Địa điểm và Staff */}
        <input type="text" name="location" placeholder="Địa điểm tổ chức" value={formData.location} onChange={handleChange} required />

        {/* Câu hỏi sàng lọc */}
        <h4>Câu hỏi sàng lọc</h4>

        <h5>Tiền sử hiến máu & bệnh lý</h5>
        {[
          { label: "Bạn đã từng hiến máu trước đây chưa?", name: "donatedBefore" },
          { label: "Bạn có từng mắc các bệnh nghiêm trọng như tim mạch, tiểu đường hoặc ung thư không?", name: "hadSeriousDisease" },
          { label: "Bạn đã từng bị sốt rét, viêm gan B/C hoặc bệnh truyền nhiễm khác chưa?", name: "hadMalariaOrOtherInfectious" },
          { label: "Bạn đã từng nhận máu từ người khác chưa?", name: "receivedBlood" },
          { label: "Bạn đang hoặc gần đây có dùng thuốc kháng sinh như Amoxicillin hoặc thuốc chống viêm như Ibuprofen không?", name: "usedAntibioticsOrAntiInflammatory" },
          { label: "Trong 2 tuần qua, bạn có các triệu chứng như sốt, ho, đau họng, tiêu chảy, mất vị giác… không?", name: "symptomsPast2Weeks" },
          { label: "Trong 1 tuần qua, bạn có gặp tình trạng như tiêu chảy, buồn nôn, hoặc phát ban không?", name: "symptomsPast1Week" },
        ].map(({ label, name }) => (
          <label key={name}>
            <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} />
            {label}
          </label>
        ))}

        <h5>Hoạt động gần đây</h5>
        {[
          { label: "Bạn có tiêm vaccine như COVID-19, cúm mùa… trong 14 ngày qua không?", name: "gotVaccine" },
          { label: "Trong 12 tháng qua, bạn không thực hiện bất kỳ hoạt động nào thuộc các mục ở trên?", name: "noneOfAbove12Months" },
          { label: "Bạn có xăm hình, châm cứu hoặc thủ thuật xuyên da trong 6 tháng qua không?", name: "tattooOrAcupuncture" },
        ].map(({ label, name }) => (
          <label key={name}>
            <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} />
            {label}
          </label>
        ))}

        <h5>Tình trạng da liễu</h5>
        {[
          { label: "Bạn có đang gặp vấn đề về da như viêm da, nấm da, zona hay vảy nến không?", name: "hadSkinIssues" },
        ].map(({ label, name }) => (
          <label key={name}>
            <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} />
            {label}
          </label>
        ))}

        <h5>Thông tin dành cho nữ</h5>
        {[
          { label: "Hiện bạn đang trong kỳ kinh nguyệt?", name: "isMenstruating" },
          { label: "Bạn đang mang thai hoặc vừa sinh con trong 6 tháng qua?", name: "isPregnantOrRecentlyDelivered" },
          { label: "Bạn không thuộc bất kỳ tình trạng sức khỏe nào nêu trên dành cho nữ?", name: "noneOfFemaleConditions" },
        ].map(({ label, name }) => (
          <label key={name}>
            <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} />
            {label}
          </label>
        ))}



        {/* Kiểm tra sức khỏe */}
        <h4>Thông tin kiểm tra</h4>
        <input type="number" name="weight" placeholder="Cân nặng (kg)" value={formData.weight} onChange={handleChange} />
        <input type="number" name="height" placeholder="Chiều cao (cm)" value={formData.height} onChange={handleChange} />
        <input type="text" name="bloodPressure" placeholder="Huyết áp (VD: 120/80)" value={formData.bloodPressure} onChange={handleChange} />

        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button type="submit">Nộp đơn</button>
          <button type="button" onClick={() => navigate("/registerOff")}>
            Hủy
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateOff;
