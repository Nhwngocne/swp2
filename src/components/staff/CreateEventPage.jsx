import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../services/EventContext";
import { AuthContext } from "../../services/AuthContext";
import "../../assets/css/components/staff/CreateEvent.css";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { createEvent } = useEvents();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    session: "",
    donationMorningStart: "07:00",
    donationMorningEnd: "12:00",
    donationAfternoonStart: "12:00",
    donationAfternoonEnd: "18:00",
    maxRegistrations: "",
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const isBefore = (t1, t2) => {
    const [h1, m1] = t1.split(":").map(Number);
    const [h2, m2] = t2.split(":").map(Number);
    return h1 * 60 + m1 < h2 * 60 + m2;
  };

  const isMorning = (time) => {
    const [h] = time.split(":").map(Number);
    return h >= 7 && h < 12;
  };

  const isAfternoon = (time) => {
    const [h] = time.split(":").map(Number);
    return h >= 12 && h <= 17;
  };

  const isWithinRange = (start, end, check) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const [ch, cm] = check.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const checkMin = ch * 60 + cm;
    return checkMin >= startMin && checkMin <= endMin;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "startTime" || name === "endTime") {
        const startTime = newData.startTime || prev.startTime;
        const endTime = newData.endTime || prev.endTime;
        if (startTime && endTime && !isBefore(startTime, endTime)) {
          setError("Thời gian bắt đầu phải trước thời gian kết thúc.");
          return prev;
        }
        setError("");
      }

      if (name === "session" || name === "donationMorningStart" || name === "donationMorningEnd" ||
          name === "donationAfternoonStart" || name === "donationAfternoonEnd") {
        const startTime = newData.startTime || prev.startTime;
        const endTime = newData.endTime || prev.endTime;

        if (startTime && endTime) {
          if (newData.session === "MORNING") {
            if (!isMorning(newData.donationMorningStart) || !isWithinRange(startTime, endTime, newData.donationMorningStart)) newData.donationMorningStart = startTime;
            if (!isMorning(newData.donationMorningEnd) || !isWithinRange(startTime, endTime, newData.donationMorningEnd)) newData.donationMorningEnd = endTime > "12:00" ? "12:00" : endTime;
            if (!isBefore(newData.donationMorningStart, newData.donationMorningEnd)) newData.donationMorningEnd = newData.donationMorningStart;
            newData.donationAfternoonStart = "";
            newData.donationAfternoonEnd = "";
          } else if (newData.session === "AFTERNOON") {
            if (!isAfternoon(newData.donationAfternoonStart) || !isWithinRange(startTime, endTime, newData.donationAfternoonStart)) newData.donationAfternoonStart = startTime >= "12:00" ? startTime : "12:00";
            if (!isAfternoon(newData.donationAfternoonEnd) || !isWithinRange(startTime, endTime, newData.donationAfternoonEnd)) newData.donationAfternoonEnd = endTime;
            if (!isBefore(newData.donationAfternoonStart, newData.donationAfternoonEnd)) newData.donationAfternoonEnd = newData.donationAfternoonStart;
            newData.donationMorningStart = "";
            newData.donationMorningEnd = "";
          } else if (newData.session === "ALL") {
            if (!isMorning(newData.donationMorningStart) || !isWithinRange(startTime, endTime, newData.donationMorningStart)) newData.donationMorningStart = startTime;
            if (!isMorning(newData.donationMorningEnd) || !isWithinRange(startTime, endTime, newData.donationMorningEnd)) newData.donationMorningEnd = endTime > "12:00" ? "12:00" : endTime;
            if (!isAfternoon(newData.donationAfternoonStart) || !isWithinRange(startTime, endTime, newData.donationAfternoonStart)) newData.donationAfternoonStart = startTime >= "12:00" ? startTime : "12:00";
            if (!isAfternoon(newData.donationAfternoonEnd) || !isWithinRange(startTime, endTime, newData.donationAfternoonEnd)) newData.donationAfternoonEnd = endTime;
            if (!isBefore(newData.donationMorningStart, newData.donationMorningEnd)) newData.donationMorningEnd = newData.donationMorningStart;
            if (!isBefore(newData.donationAfternoonStart, newData.donationAfternoonEnd)) newData.donationAfternoonEnd = newData.donationAfternoonStart;
          }
        }
      }

      return newData;
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

    const {
      title, date, location, startTime, endTime,
      session, donationMorningStart, donationMorningEnd,
      donationAfternoonStart, donationAfternoonEnd
    } = formData;

    if (!user?.id) {
      setError("Người dùng chưa đăng nhập.");
      return;
    }

    if (!title || !date || !location || !startTime || !endTime || !session) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (!isBefore(startTime, endTime)) {
      setError("Thời gian bắt đầu phải trước thời gian kết thúc.");
      return;
    }

    const startIsMorning = isMorning(startTime);
    const endIsAfternoon = isAfternoon(endTime);
    if (session === "MORNING" && !startIsMorning) {
      setError("Thời gian bắt đầu phải trong buổi sáng (07:00 - 11:59) cho phiên MORNING.");
      return;
    }
    if (session === "AFTERNOON" && !endIsAfternoon) {
      setError("Thời gian kết thúc phải trong buổi chiều (12:00 - 17:59) cho phiên AFTERNOON.");
      return;
    }
    if (session === "ALL" && !(startIsMorning && endIsAfternoon)) {
      setError("Thời gian sự kiện phải bao gồm cả ngày (từ 07:00 - 17:59) cho phiên ALL.");
      return;
    }

    if (session === "MORNING") {
      if (!isMorning(donationMorningStart) || !isMorning(donationMorningEnd)) {
        setError("Thời gian hiến máu buổi sáng phải nằm trong khoảng 07:00 - 11:59.");
        return;
      }
      if (!isBefore(donationMorningStart, donationMorningEnd)) {
        setError("Thời gian bắt đầu hiến máu buổi sáng phải nhỏ hơn thời gian kết thúc.");
        return;
      }
      if (!isWithinRange(startTime, endTime, donationMorningStart) || !isWithinRange(startTime, endTime, donationMorningEnd)) {
        setError("Thời gian hiến máu buổi sáng phải nằm trong khoảng thời gian sự kiện.");
        return;
      }
    } else if (session === "AFTERNOON") {
      if (!isAfternoon(donationAfternoonStart) || !isAfternoon(donationAfternoonEnd)) {
        setError("Thời gian hiến máu buổi chiều phải nằm trong khoảng 12:00 - 17:59.");
        return;
      }
      if (!isBefore(donationAfternoonStart, donationAfternoonEnd)) {
        setError("Thời gian bắt đầu hiến máu buổi chiều phải nhỏ hơn thời gian kết thúc.");
        return;
      }
      if (!isWithinRange(startTime, endTime, donationAfternoonStart) || !isWithinRange(startTime, endTime, donationAfternoonEnd)) {
        setError("Thời gian hiến máu buổi chiều phải nằm trong khoảng thời gian sự kiện.");
        return;
      }
    } else if (session === "ALL") {
      if (!isMorning(donationMorningStart) || !isWithinRange(startTime, endTime, donationMorningStart)) {
        setError("Thời gian bắt đầu hiến máu buổi sáng phải nằm trong khoảng 07:00 - 11:59 và trong thời gian sự kiện.");
        return;
      }
      if (!isMorning(donationMorningEnd) || !isWithinRange(startTime, endTime, donationMorningEnd)) {
        setError("Thời gian kết thúc hiến máu buổi sáng phải nằm trong khoảng 07:00 - 11:59 và trong thời gian sự kiện.");
        return;
      }
      if (!isBefore(donationMorningStart, donationMorningEnd)) {
        setError("Thời gian bắt đầu hiến máu buổi sáng phải nhỏ hơn thời gian kết thúc.");
        return;
      }
      if (!isAfternoon(donationAfternoonStart) || !isWithinRange(startTime, endTime, donationAfternoonStart)) {
        setError("Thời gian bắt đầu hiến máu buổi chiều phải nằm trong khoảng 12:00 - 17:59 và trong thời gian sự kiện.");
        return;
      }
      if (!isAfternoon(donationAfternoonEnd) || !isWithinRange(startTime, endTime, donationAfternoonEnd)) {
        setError("Thời gian kết thúc hiến máu buổi chiều phải nằm trong khoảng 12:00 - 17:59 và trong thời gian sự kiện.");
        return;
      }
      if (!isBefore(donationAfternoonStart, donationAfternoonEnd)) {
        setError("Thời gian bắt đầu hiến máu buổi chiều phải nhỏ hơn thời gian kết thúc.");
        return;
      }
    }

    try {
      const result = await createEvent(formData);
      if (result.success) {
        alert("Tạo sự kiện thành công");
        navigate("/eventManager");
      } else {
        setError(result.error || "Tạo sự kiện thất bại.");
      }
    } catch (err) {
      setError("Lỗi khi tạo sự kiện.");
    }
  };

  const startIsMorning = formData.startTime ? isMorning(formData.startTime) : false;
  const endIsAfternoon = formData.endTime ? isAfternoon(formData.endTime) : false;
  const isFullDay = formData.startTime && formData.endTime && startIsMorning && endIsAfternoon && isBefore(formData.startTime, formData.endTime);
  const isMorningOnly = formData.startTime && formData.endTime && startIsMorning && !endIsAfternoon && isBefore(formData.startTime, formData.endTime);
  const isAfternoonOnly = formData.startTime && formData.endTime && !startIsMorning && endIsAfternoon && isBefore(formData.startTime, formData.endTime);

  return (
    <div className="create-manager">
      <div className="page-eheader">
        <h1>Tạo sự kiện</h1>
        {/* <button className="close-btn" onClick={() => navigate("/eventManager")}>×</button> */}
      </div>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Tiêu đề:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        {/* <div className="form-group">
          <label htmlFor="description">Mô tả:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div> */}
        <div className="form-group">
          <label htmlFor="date">Ngày:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="time-pair">
          <div className="form-group">
            <label htmlFor="startTime">Thời gian bắt đầu (sớm nhất 7:00 SA):</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required min="07:00" max="17:00" step="1800" />
          </div>
          <span>→</span>
          <div className="form-group">
            <label htmlFor="endTime">Thời gian kết thúc (trễ nhất 6:00 CH):</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required min="08:00" max="18:00" step="1800" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="location">Địa điểm:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="session">Phiên hiến máu:</label>
          <select name="session" value={formData.session} onChange={handleChange} disabled={!formData.startTime || !formData.endTime} required>
            <option value="" disabled>-- Chọn phiên --</option>
            {isFullDay && (
              <>
                <option value="MORNING">Chỉ buổi sáng</option>
                <option value="AFTERNOON">Chỉ buổi chiều</option>
                <option value="ALL">Cả ngày</option>
              </>
            )}
            {isMorningOnly && (
              <option value="MORNING">Chỉ buổi sáng</option>
            )}
            {isAfternoonOnly && (
              <option value="AFTERNOON">Chỉ buổi chiều</option>
            )}
          </select>
        </div>
        {(formData.session === "MORNING" || formData.session === "ALL") && (
          <div className="time-pair">
            <div className="form-group">
              <label htmlFor="donationMorningStart">Giờ bắt đầu (sáng):</label>
              <input type="time" name="donationMorningStart" value={formData.donationMorningStart} onChange={handleChange} min={formData.startTime || "07:00"} max={formData.endTime || "12:00"} step="1800" disabled={!formData.startTime || !formData.endTime} required={formData.session === "MORNING"} />
            </div>
            <span>→</span>
            <div className="form-group">
              <label htmlFor="donationMorningEnd">Giờ kết thúc (sáng):</label>
              <input type="time" name="donationMorningEnd" value={formData.donationMorningEnd} onChange={handleChange} min={formData.startTime || "07:00"} max={formData.endTime || "12:00"} step="1800" disabled={!formData.startTime || !formData.endTime} required={formData.session === "MORNING"} />
            </div>
          </div>
        )}
        {(formData.session === "AFTERNOON" || formData.session === "ALL") && (
          <div className="time-pair">
            <div className="form-group">
              <label htmlFor="donationAfternoonStart">Giờ bắt đầu (chiều):</label>
              <input type="time" name="donationAfternoonStart" value={formData.donationAfternoonStart} onChange={handleChange} min={formData.startTime || "12:00"} max={formData.endTime || "18:00"} step="1800" disabled={!formData.startTime || !formData.endTime} required={formData.session === "AFTERNOON"} />
            </div>
            <span>→</span>
            <div className="form-group">
              <label htmlFor="donationAfternoonEnd">Giờ kết thúc (chiều):</label>
              <input type="time" name="donationAfternoonEnd" value={formData.donationAfternoonEnd} onChange={handleChange} min={formData.startTime || "12:00"} max={formData.endTime || "18:00"} step="1800" disabled={!formData.startTime || !formData.endTime} required={formData.session === "AFTERNOON"} />
            </div>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="maxRegistrations">Số lượng đăng ký tối đa:</label>
          <input type="number" name="maxRegistrations" value={formData.maxRegistrations} onChange={handleChange} min="0" required />
        </div>
        <div className="form-group">
          <label htmlFor="image">Ảnh minh hoạ:</label>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
          {previewUrl && <img src={previewUrl} alt="Preview" className="event-image-preview" />}
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn-17">
            <span className="text-container">
              <span className="text">Tạo sự kiện</span>
            </span>
          </button>
         
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;