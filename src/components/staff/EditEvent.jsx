import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "../../services/EventContext";
import { AuthContext } from "../../services/AuthContext";
import "../../assets/css/components/staff/EventManager.css";

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

  const isMorning = (time) => {
    const [hours] = time.split(":").map(Number);
    return hours >= 7 && hours < 12;
  };

  const isAfternoon = (time) => {
    const [hours] = time.split(":").map(Number);
    return hours >= 12 && hours <= 17;
  };

  const isWithinRange = (start, end, check) => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const [checkH, checkM] = check.split(":").map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    const checkMin = checkH * 60 + checkM;
    return startMin <= checkMin && checkMin <= endMin;
  };

  const isBefore = (time1, time2) => {
    const [h1, m1] = time1.split(":").map(Number);
    const [h2, m2] = time2.split(":").map(Number);
    const min1 = h1 * 60 + m1;
    const min2 = h2 * 60 + m2;
    return min1 < min2;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await getEventById(id);
        if (result.success) {
          const data = result.event;
          setFormData({
            title: data.title || "",
            description: data.description || "",
            date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
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
        console.error("Error fetching event:", err);
        setError("Không thể tải sự kiện.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, getEventById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Kiểm tra startTime < endTime
      if (name === "startTime" || name === "endTime") {
        const startTime = newData.startTime || prev.startTime;
        const endTime = newData.endTime || prev.endTime;
        if (startTime && endTime && !isBefore(startTime, endTime)) {
          setError("Thời gian bắt đầu phải trước thời gian kết thúc.");
          return prev;
        }
        setError("");
      }

      // Điều chỉnh thời gian hiến máu dựa trên session và startTime/endTime
      if (name === "session" || name === "donationMorningStart" || name === "donationMorningEnd" ||
          name === "donationAfternoonStart" || name === "donationAfternoonEnd") {
        const startTime = newData.startTime || prev.startTime;
        const endTime = newData.endTime || prev.endTime;

        if (startTime && endTime) {
          if (newData.session === "MORNING") {
            if (!isMorning(newData.donationMorningStart) || !isWithinRange(startTime, endTime, newData.donationMorningStart)) newData.donationMorningStart = startTime;
            if (!isMorning(newData.donationMorningEnd) || !isWithinRange(startTime, endTime, newData.donationMorningEnd)) newData.donationMorningEnd = endTime > "11:59" ? "11:59" : endTime;
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
            if (!isMorning(newData.donationMorningEnd) || !isWithinRange(startTime, endTime, newData.donationMorningEnd)) newData.donationMorningEnd = endTime > "11:59" ? "11:59" : endTime;
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
      return;
    }

    setLoading(true);
    setError(""); // Reset lỗi trước khi kiểm tra

    const {
      title, date, location, startTime, endTime,
      session, donationMorningStart, donationMorningEnd,
      donationAfternoonStart, donationAfternoonEnd
    } = formData;

    if (!title || !date || !startTime || !endTime || !location || !session) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      setLoading(false);
      return;
    }

    if (!isBefore(startTime, endTime)) {
      setError("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc của sự kiện.");
      setLoading(false);
      return;
    }

    // Kiểm tra ràng buộc thời gian theo phiên
    const startIsMorning = isMorning(startTime);
    const endIsAfternoon = isAfternoon(endTime);
    if (session === "MORNING" && !startIsMorning) {
      setError("Thời gian bắt đầu phải trong buổi sáng (07:00 - 11:59) cho phiên MORNING.");
      setLoading(false);
      return;
    }
    if (session === "AFTERNOON" && !endIsAfternoon) {
      setError("Thời gian kết thúc phải trong buổi chiều (12:00 - 17:59) cho phiên AFTERNOON.");
      setLoading(false);
      return;
    }
    if (session === "ALL" && !(startIsMorning && endIsAfternoon)) {
      setError("Thời gian sự kiện phải bao gồm cả ngày (từ 07:00 - 17:59) cho phiên ALL.");
      setLoading(false);
      return;
    }

    // Kiểm tra thời gian hiến máu
    if (session === "MORNING") {
      if (!isMorning(donationMorningStart) || !isMorning(donationMorningEnd)) {
        setError("Thời gian hiến máu buổi sáng phải nằm trong khoảng 07:00 - 11:59.");
        setLoading(false);
        return;
      }
      if (!isBefore(donationMorningStart, donationMorningEnd)) {
        setError("Thời gian bắt đầu hiến máu buổi sáng phải nhỏ hơn thời gian kết thúc.");
        setLoading(false);
        return;
      }
      if (!isWithinRange(startTime, endTime, donationMorningStart) || !isWithinRange(startTime, endTime, donationMorningEnd)) {
        setError("Thời gian hiến máu buổi sáng phải nằm trong khoảng thời gian sự kiện.");
        setLoading(false);
        return;
      }
    } else if (session === "AFTERNOON") {
      if (!isAfternoon(donationAfternoonStart) || !isAfternoon(donationAfternoonEnd)) {
        setError("Thời gian hiến máu buổi chiều phải nằm trong khoảng 12:00 - 17:59.");
        setLoading(false);
        return;
      }
      if (!isBefore(donationAfternoonStart, donationAfternoonEnd)) {
        setError("Thời gian bắt đầu hiến máu buổi chiều phải nhỏ hơn thời gian kết thúc.");
        setLoading(false);
        return;
      }
      if (!isWithinRange(startTime, endTime, donationAfternoonStart) || !isWithinRange(startTime, endTime, donationAfternoonEnd)) {
        setError("Thời gian hiến máu buổi chiều phải nằm trong khoảng thời gian sự kiện.");
        setLoading(false);
        return;
      }
    } else if (session === "ALL") {
      if (!isMorning(donationMorningStart) || !isWithinRange(startTime, endTime, donationMorningStart)) {
        setError("Thời gian bắt đầu hiến máu buổi sáng phải nằm trong khoảng 07:00 - 11:59 và trong thời gian sự kiện.");
        setLoading(false);
        return;
      }
      if (!isMorning(donationMorningEnd) || !isWithinRange(startTime, endTime, donationMorningEnd)) {
        setError("Thời gian kết thúc hiến máu buổi sáng phải nằm trong khoảng 07:00 - 11:59 và trong thời gian sự kiện.");
        setLoading(false);
        return;
      }
      if (!isBefore(donationMorningStart, donationMorningEnd)) {
        setError("Thời gian bắt đầu hiến máu buổi sáng phải nhỏ hơn thời gian kết thúc.");
        setLoading(false);
        return;
      }
      if (!isAfternoon(donationAfternoonStart) || !isWithinRange(startTime, endTime, donationAfternoonStart)) {
        setError("Thời gian bắt đầu hiến máu buổi chiều phải nằm trong khoảng 12:00 - 17:59 và trong thời gian sự kiện.");
        setLoading(false);
        return;
      }
      if (!isAfternoon(donationAfternoonEnd) || !isWithinRange(startTime, endTime, donationAfternoonEnd)) {
        setError("Thời gian kết thúc hiến máu buổi chiều phải nằm trong khoảng 12:00 - 17:59 và trong thời gian sự kiện.");
        setLoading(false);
        return;
      }
      if (!isBefore(donationAfternoonStart, donationAfternoonEnd)) {
        setError("Thời gian bắt đầu hiến máu buổi chiều phải nhỏ hơn thời gian kết thúc.");
        setLoading(false);
        return;
      }
    }

    try {
      const result = await updateEvent(id, formData);
      if (result.success) {
        alert("Cập nhật sự kiện thành công");
        navigate("/eventManager");
      } else {
        setError(result.error || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error.response?.status, error.response?.data);
      setError(`Có lỗi xảy ra khi cập nhật sự kiện: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  // Xác định trạng thái hiển thị của các phiên dựa trên startTime và endTime
  const startIsMorning = formData.startTime ? isMorning(formData.startTime) : false;
  const endIsAfternoon = formData.endTime ? isAfternoon(formData.endTime) : false;
  const isFullDay = formData.startTime && formData.endTime && startIsMorning && endIsAfternoon && isBefore(formData.startTime, formData.endTime);
  const isMorningOnly = formData.startTime && formData.endTime && startIsMorning && !endIsAfternoon && isBefore(formData.startTime, formData.endTime);
  const isAfternoonOnly = formData.startTime && formData.endTime && !startIsMorning && endIsAfternoon && isBefore(formData.startTime, formData.endTime);

  return (
    <div className="event-manager">
      <div className="page-header">
        <h1>Chỉnh sửa sự kiện</h1>
        <button className="close-btn" onClick={() => navigate("/eventManager")}>
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
          <label htmlFor="startTime">Thời gian bắt đầu: (sớm nhất 7:00 SA)</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            min="07:00"
            max="17:00"
            step="1800"
          />
        </div>
        <div className="form-group">
          <label htmlFor="endTime">Thời gian kết thúc:(trễ nhất 6:00 CH)</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            min="08:00"
            max="17:59"
            step="1800"
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
            disabled={!formData.startTime || !formData.endTime}
            required
          >
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
        {(formData.session === "ALL" || formData.session === "MORNING") && (
          <div className="form-group time-pair">
            <label>Giờ sáng:</label>
            <input
              type="time"
              name="donationMorningStart"
              value={formData.donationMorningStart}
              onChange={handleChange}
              min={formData.startTime || "07:00"}
              max={formData.endTime || "11:59"}
              step="1800"
              disabled={!formData.startTime || !formData.endTime}
              required={formData.session === "MORNING"}
            />
            <span>→</span>
            <input
              type="time"
              name="donationMorningEnd"
              value={formData.donationMorningEnd}
              onChange={handleChange}
              min={formData.startTime || "07:00"}
              max={formData.endTime || "11:59"}
              step="1800"
              disabled={!formData.startTime || !formData.endTime}
              required={formData.session === "MORNING"}
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
              min={formData.startTime || "12:00"}
              max={formData.endTime || "17:59"}
              step="1800"
              disabled={!formData.startTime || !formData.endTime}
              required={formData.session === "AFTERNOON"}
            />
            <span>→</span>
            <input
              type="time"
              name="donationAfternoonEnd"
              value={formData.donationAfternoonEnd}
              onChange={handleChange}
              min={formData.startTime || "12:00"}
              max={formData.endTime || "17:59"}
              step="1800"
              disabled={!formData.startTime || !formData.endTime}
              required={formData.session === "AFTERNOON"}
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
        {error && <p className="error-message">{error}</p>}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
          <button type="button" onClick={() => navigate("/eventManager")}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;