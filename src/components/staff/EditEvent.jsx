import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "../../services/EventContext";
import { AuthContext } from "../../services/AuthContext";
import '../../assets/css/components/staff/EventManager.css';

const bloodTypeOptions = ["A", "B", "AB", "O"];
const bloodTypeMap = { A: 2, B: 3, AB: 4, O: 5 };

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { getEventById, updateEvent } = useEvents();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    session: "ALL",
    donationMorningStart: "",
    donationMorningEnd: "",
    donationAfternoonStart: "",
    donationAfternoonEnd: "",
    maxRegistrations: "",
    bloodTypeIds: [],
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await getEventById(id);
        console.log('getEventById result:', result);
        if (result.success) {
          const data = result.event;
          console.log('Mapped event data:', data);
          setFormData({
            title: data.title || "",
            description: data.description || "",
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : "",
            startTime: data.startTime ? data.startTime.slice(0, 5) : "",
            endTime: data.endTime ? data.endTime.slice(0, 5) : "",
            location: data.location || "",
            session: data.session || "ALL",
            donationMorningStart: data.donationMorningStart ? data.donationMorningStart.slice(0, 5) : "",
            donationMorningEnd: data.donationMorningEnd ? data.donationMorningEnd.slice(0, 5) : "",
            donationAfternoonStart: data.donationAfternoonStart ? data.donationAfternoonStart.slice(0, 5) : "",
            donationAfternoonEnd: data.donationAfternoonEnd ? data.donationAfternoonEnd.slice(0, 5) : "",
            maxRegistrations: data.maxRegistrations || "",
            bloodTypeIds: Array.isArray(data.bloodTypeIds) ? data.bloodTypeIds : [],
            image: null,
          });
          if (data.image) {
            setPreviewUrl(data.image);
          }
        } else {
          setError(result.error || "Không thể tải sự kiện.");
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError("Không thể tải sự kiện.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, getEventById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (blood) => {
    const id = bloodTypeMap[blood];
    setFormData((prev) => {
      const updated = prev.bloodTypeIds.includes(id)
        ? prev.bloodTypeIds.filter((b) => b !== id)
        : [...prev.bloodTypeIds, id];
      return { ...prev, bloodTypeIds: updated };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setError("Người dùng chưa đăng nhập hoặc thiếu ID.");
      setLoading(false);
      return;
    }

    setLoading(true);

    // Chuẩn bị dữ liệu giống CreateEventPage
    let updatedFormData = { ...formData, image: formData.image };
    if (formData.session === "MORNING" || formData.session === "ALL") {
      updatedFormData.donationMorningStart = formData.donationMorningStart || "07:00";
      updatedFormData.donationMorningEnd = formData.donationMorningEnd || "11:00";
    } else {
      updatedFormData.donationMorningStart = "";
      updatedFormData.donationMorningEnd = "";
    }
    if (formData.session === "AFTERNOON" || formData.session === "ALL") {
      updatedFormData.donationAfternoonStart = formData.donationAfternoonStart || "13:00";
      updatedFormData.donationAfternoonEnd = formData.donationAfternoonEnd || "16:00";
    } else {
      updatedFormData.donationAfternoonStart = "";
      updatedFormData.donationAfternoonEnd = "";
    }

    // Không thêm :00, giữ định dạng HH:mm để khớp với backend
    updatedFormData.startTime = formData.startTime || "";
    updatedFormData.endTime = formData.endTime || "";
    updatedFormData.donationMorningStart = updatedFormData.donationMorningStart || "";
    updatedFormData.donationMorningEnd = updatedFormData.donationMorningEnd || "";
    updatedFormData.donationAfternoonStart = updatedFormData.donationAfternoonStart || "";
    updatedFormData.donationAfternoonEnd = updatedFormData.donationAfternoonEnd || "";

    // Kiểm tra dữ liệu trước khi gửi
    if (!updatedFormData.title || !updatedFormData.date || !updatedFormData.startTime || !updatedFormData.endTime || !updatedFormData.location) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      setLoading(false);
      return;
    }

    if ((formData.session === "MORNING" || formData.session === "ALL") && 
        (!updatedFormData.donationMorningStart || !updatedFormData.donationMorningEnd)) {
      setError("Vui lòng điền giờ hiến máu buổi sáng.");
      setLoading(false);
      return;
    }

    if ((formData.session === "AFTERNOON" || formData.session === "ALL") && 
        (!updatedFormData.donationAfternoonStart || !updatedFormData.donationAfternoonEnd)) {
      setError("Vui lòng điền giờ hiến máu buổi chiều.");
      setLoading(false);
      return;
    }

    console.log('Updated form data:', updatedFormData);

    try {
      const result = await updateEvent(id, updatedFormData);
      console.log('Update event result:', result);
      if (result.success) {
        alert("Cập nhật sự kiện thành công");
        navigate("/eventManager");
      } else {
        alert(result.error || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error.response?.status, error.response?.data);
      alert(`Có lỗi xảy ra khi cập nhật sự kiện: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="event-manager">
      <div className="page-header">
        <h1>Chỉnh sửa sự kiện</h1>
        <button className="close-btn" onClick={() => navigate('/eventManager')}>
          ×
        </button>
      </div>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Tiêu đề:</label>
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô tả:</label>
          <textarea
            name="description"
            placeholder="Mô tả"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Ngày:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Thời gian bắt đầu:</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endTime">Thời gian kết thúc:</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Địa điểm:</label>
          <input
            type="text"
            name="location"
            placeholder="Địa điểm"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="session">Chọn phiên hiến máu:</label>
          <select
            name="session"
            value={formData.session}
            onChange={handleChange}
          >
            <option value="ALL">Cả ngày</option>
            <option value="MORNING">Chỉ buổi sáng</option>
            <option value="AFTERNOON">Chỉ buổi chiều</option>
          </select>
        </div>
        {(formData.session === "ALL" || formData.session === "MORNING") && (
          <div className="form-group time-pair">
            <label>Giờ sáng:</label>
            <input
              type="time"
              name="donationMorningStart"
              value={formData.donationMorningStart}
              onChange={handleChange}
              required
            />
            <span>→</span>
            <input
              type="time"
              name="donationMorningEnd"
              value={formData.donationMorningEnd}
              onChange={handleChange}
              required
            />
          </div>
        )}
        {(formData.session === "ALL" || formData.session === "AFTERNOON") && (
          <div className="form-group time-pair">
            <label>Giờ chiều:</label>
            <input
              type="time"
              name="donationAfternoonStart"
              value={formData.donationAfternoonStart}
              onChange={handleChange}
              required
            />
            <span>→</span>
            <input
              type="time"
              name="donationAfternoonEnd"
              value={formData.donationAfternoonEnd}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="maxRegistrations">Số lượng đăng ký tối đa:</label>
          <input
            type="number"
            name="maxRegistrations"
            placeholder="Số lượng đăng ký tối đa"
            value={formData.maxRegistrations}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label>Nhóm máu cần:</label>
          <div className="checkbox-group">
            {bloodTypeOptions.map((blood) => (
              <label key={blood}>
                <input
                  type="checkbox"
                  checked={formData.bloodTypeIds.includes(bloodTypeMap[blood])}
                  onChange={() => handleCheckboxChange(blood)}
                />
                {blood}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Ảnh minh hoạ:</label>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
          {previewUrl && <img src={previewUrl} alt="Preview" className="event-image-preview" />}
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
          <button type="button" onClick={() => navigate('/eventManager')}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;