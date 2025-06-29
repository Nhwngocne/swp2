import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../services/EventContext";
import { useAuth } from "../../services/AuthContext";
import "../../assets/css/components/guest/EventList.css";

const EventList = () => {
  const { user } = useAuth();
  const { events, loading, error } = useEvents();
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.status === filter;
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

  if (loading) return <div style={{ textAlign: "center", padding: 20 }}>Đang tải...</div>;
  if (error) return <div style={{ textAlign: "center", padding: 20, color: "red" }}>Lỗi: {error}</div>;

  return (
    <div className="event-container">
        <h1>Sự kiện hiến máu</h1>
        <p>Tham gia các sự kiện hiến máu để góp phần cứu giúp những người cần máu</p>
      
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
            <p><strong>Thời gian hiến máu:</strong> {event.sessionTime || "07:00 - 11:00"}</p>
          </div>

          {/* RIGHT: Action */}
          <div className="event-horizontal-action">
            <p className="event-register-count">
              👥 {event.registered || 0}/{event.capacity || 150} Người
            </p>
            <button
              className="event-horizontal-btn"
              onClick={() => handleRegisterClick(event)}
            >
              Đặt lịch
            </button>
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
