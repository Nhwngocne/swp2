import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventService } from "../../services/eventService";
import { AuthContext } from "../../services/AuthContext";

const bloodTypeOptions = ["A", "B", "AB", "O"];
const bloodTypeMap = { A: 1, B: 2, AB: 3, O: 4 };

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
        const res = await eventService.getEventById(id);
        const data = res.data || res;

        setFormData({
          title: data.title || "",
          description: data.description || "",
          date: data.date || "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          location: data.location || "",
          session: data.session || "ALL",
          donationMorningStart: data.donationMorningStart || "",
          donationMorningEnd: data.donationMorningEnd || "",
          donationAfternoonStart: data.donationAfternoonStart || "",
          donationAfternoonEnd: data.donationAfternoonEnd || "",
          maxRegistrations: data.maxRegistrations || "",
          bloodTypeIds: data.bloodTypeIds || [],
          image: null,
        });

        if (data.imageUrl) {
          setPreviewUrl(data.imageUrl);
        }
      } catch (err) {
        console.error("Lỗi khi tải sự kiện:", err);
        setError("Không thể tải sự kiện.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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

    const eventData = new FormData();
    eventData.append("title", formData.title);
    eventData.append("description", formData.description);
    eventData.append("location", formData.location);

    eventData.append("date", formData.date);
    eventData.append("startTime", formData.startTime);
    eventData.append("endTime", formData.endTime);
    eventData.append("session", formData.session);
    eventData.append("donationMorningStart", formData.donationMorningStart);
    eventData.append("donationMorningEnd", formData.donationMorningEnd);
    eventData.append("donationAfternoonStart", formData.donationAfternoonStart);
    eventData.append("donationAfternoonEnd", formData.donationAfternoonEnd);
    eventData.append("maxRegistrations", formData.maxRegistrations);
    eventData.append("staffId", user?.id);

    if (Array.isArray(formData.bloodTypeIds)) {
      formData.bloodTypeIds.forEach(id => {
        eventData.append("bloodTypeIds[]", id);
      });
    }



    if (formData.image) {
      eventData.append("image", formData.image);
    }

    try {
      
      const result = await eventService.updateEvent(id, eventData);
      if (result?.data || result) {
        alert("Cập nhật sự kiện thành công");
        navigate("/eventManager");
      } else {
        alert("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật sự kiện");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="event-manager">
      <h1>Chỉnh sửa sự kiện</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Tiêu đề" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Địa điểm" value={formData.location} onChange={handleChange} required />

        <select name="session" value={formData.session} onChange={handleChange}>
          <option value="ALL">Cả ngày</option>
          <option value="MORNING">Buổi sáng</option>
          <option value="AFTERNOON">Buổi chiều</option>
        </select>

        {(formData.session === "ALL" || formData.session === "MORNING") && (
          <div>
            <label>Giờ hiến buổi sáng:</label>
            <input type="time" name="donationMorningStart" value={formData.donationMorningStart} onChange={handleChange} required />
            <input type="time" name="donationMorningEnd" value={formData.donationMorningEnd} onChange={handleChange} required />
          </div>
        )}

        {(formData.session === "ALL" || formData.session === "AFTERNOON") && (
          <div>
            <label>Giờ hiến buổi chiều:</label>
            <input type="time" name="donationAfternoonStart" value={formData.donationAfternoonStart} onChange={handleChange} required />
            <input type="time" name="donationAfternoonEnd" value={formData.donationAfternoonEnd} onChange={handleChange} required />
          </div>
        )}

        <input
          type="number"
          name="maxRegistrations"
          placeholder="Số lượng đăng ký tối đa"
          value={formData.maxRegistrations}
          onChange={handleChange}
          required
        />

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

        <label>Ảnh minh hoạ:</label>
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" className="event-image-preview" />}

        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
};

export default EditEvent;
