import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../services/EventContext";
import { useAuth } from "../../services/AuthContext";
import DatePicker from "react-datepicker"; // Thêm import
import "react-datepicker/dist/react-datepicker.css"; // CSS cho DatePicker
import "../../assets/css/components/guest/EventList.css";

const EventList = () => {
  const { user, role } = useAuth();
  const { events, loading, error } = useEvents();
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState(null); // Từ ngày
  const [endDate, setEndDate] = useState(null);   // Đến ngày
  const navigate = useNavigate();

  // Lọc sự kiện
  const filteredEvents = events.filter((event) => {
    if (filter !== "all" && event.status !== filter) return false;

    const eventDate = new Date(event.date);
    const isInRange = (!startDate || eventDate >= startDate) && (!endDate || eventDate <= endDate);
    return isInRange;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formatSessionTime = (event) => {
    if (event.session === "MORNING") {
      return `${event.donationMorningStart} - ${event.donationMorningEnd}`;
    } else if (event.session === "AFTERNOON") {
      return `${event.donationAfternoonStart} - ${event.donationAfternoonEnd}`;
    } else if (event.session === "ALL") {
      return `${event.donationMorningStart} - ${event.donationMorningEnd} | ${event.donationAfternoonStart} - ${event.donationAfternoonEnd}`;
    }
    return "Chưa có thông tin khung giờ";
  };

  const handleRegisterClick = (event) => {
    const state = {
      eventId: event.id,
      donation_date: event.date,
      location: event.location,
      bloodTypes: event.bloodTypes || [],
      session: event.session || "ALL",
      donationMorningStart: event.donationMorningStart || "",
      donationMorningEnd: event.donationMorningEnd || "",
      donationAfternoonStart: event.donationAfternoonStart || "",
      donationAfternoonEnd: event.donationAfternoonEnd || "",
    };

    if (!user) {
      navigate("/login", { state: { from: "/donation-blood-form", ...state } });
    } else {
      navigate("/donation-blood-form", { state });
    }
  };

  const isRegisterable = (eventDateStr) => {
    const today = new Date();
    const eventDate = new Date(eventDateStr);
    const registerDeadline = new Date(eventDate);
    registerDeadline.setDate(registerDeadline.getDate() - 7);
    return today >= registerDeadline;
  };

  const handleSearch = () => {
    // Logic tìm kiếm đã được xử lý trong filteredEvents
    // Không cần thêm hành động khác vì state đã tự động cập nhật
  };

  if (loading) return <div style={{ textAlign: "center", padding: 20 }}>Đang tải...</div>;
  if (error) return <div style={{ textAlign: "center", padding: 20, color: "red" }}>Lỗi: {error}</div>;

  return (
    <div className="event-container">
      <h1>Sự kiện hiến máu</h1>
      <p>Tham gia các sự kiện hiến máu để góp phần cứu giúp những người cần máu</p>

      {/* Thanh tìm kiếm theo khoảng ngày */}
      <div className="date-search" style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label>Bạn cần đặt lịch vào thời gian nào?</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Từ ngày"
          dateFormat="dd/MM/yyyy"
          className="date-picker"
        />
        <span>-</span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="Đến ngày"
          dateFormat="dd/MM/yyyy"
          className="date-picker"
        />
      </div>

      {filteredEvents.map((event) => (
        <div className="event-horizontal-card" key={event.id}>
          {/* LEFT: Image */}
          <div className="event-horizontal-image">
            <img
              src={event.image || "/default-logo.png"}
              alt="event"
              className="event-logo"
            />
          </div>

          {/* MIDDLE: Content */}
          <div className="event-horizontal-content">
            <h3 className="event-title-link">{event.title}</h3>
            <p><strong>Địa chỉ:</strong> {event.location}</p>
            <p><strong>Thời gian hoạt động:</strong> {formatDate(event.date)} - Từ {event.time}</p>
            <p><strong>Thời gian hiến máu:</strong> {formatSessionTime(event)}</p>
          </div>

          {/* RIGHT: Action */}
          <div className="event-horizontal-action">
            <p className="event-register-count">
              👥 {event.registeredMemberCount || 0}/{event.maxRegistrations || 150} Người
            </p>

            {role !== "STAFF" && (
              event.registered ? (
                <button
                  className="event-horizontal-btn"
                  disabled
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    cursor: "not-allowed",
                  }}
                >
                  Đã đăng ký
                </button>
              ) : !event.canDonate ? (
                <button
                  className="event-horizontal-btn"
                  disabled
                  style={{
                    backgroundColor: "#6c757d", // màu xám
                    color: "white",
                    cursor: "not-allowed",
                  }}
                >
                  Chưa đến thời gian hiến lại
                </button>
              ) : event.registeredMemberCount >= event.maxRegistrations ? (
                <button
                  className="event-horizontal-btn"
                  disabled
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    cursor: "not-allowed",
                  }}
                >
                  Đã đủ số lượng đăng ký
                </button>
              ) : (
                <button
                  className="event-horizontal-btn"
                  disabled={!isRegisterable(event.date)}
                  onClick={() => handleRegisterClick(event)}
                  style={{
                    backgroundColor: isRegisterable(event.date) ? "#dc3545" : "#ccc",
                    cursor: isRegisterable(event.date) ? "pointer" : "not-allowed",
                  }}
                >
                  {isRegisterable(event.date) ? "Đặt lịch đăng ký" : "Chưa đến lúc đặt lịch"}
                </button>
              )
            )}
            {role === "STAFF" && (
              <button
                className="event-horizontal-btn detail-btn"
                onClick={() => navigate(`/bloodFormList/${event.id}`)}
              >
                Chi tiết
              </button>
            )}
          </div>
        </div>
      ))}

      {filteredEvents.length === 0 && (
        <div className="no-event-box">
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🔍</div>
          <h3>Không tìm thấy sự kiện nào</h3>
          <p>Hiện tại không có sự kiện nào trong danh mục này</p>
        </div>
      )}
    </div>
  );
};

export default EventList;