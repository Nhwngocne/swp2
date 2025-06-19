import React, { createContext, useContext, useState, useEffect } from "react";
import { eventService } from "./eventService";
import axios from "axios";
import { useAuth } from "./AuthContext";

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEventStatus = (eventDate, apiStatus) => {
    if (
      apiStatus &&
      ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"].includes(apiStatus)
    ) {
      return apiStatus;
    }
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    if (isNaN(eventDateObj)) return "UNKNOWN";
    if (eventDateObj < today) return "COMPLETED";
    if (eventDateObj.toDateString() === today.toDateString()) return "ONGOING";
    return "UPCOMING";
  };

  const mapEvent = (event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    time: `${event.startTime} - ${event.endTime}`,
    location: event.location,
    description: event.description,
    image:
      event.imageUrl || event.images?.[0]?.url || "/assets/event-default.jpg",
    status: getEventStatus(event.date, event.status),
    createdBy: event.createdBy?.name || "Unknown",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log("Fetching events from /swp391/events");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const source = axios.CancelToken.source();
      const response = await eventService.getEvents({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedEvents = response.data.result.map(mapEvent);
      setEvents(mappedEvents);
      setError(null);
      return { success: true, events: mappedEvents };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Fetch events cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Fetch events error:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : error.response?.data?.message || "Không thể tải sự kiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getEventById = async (eventId) => {
    try {
      setLoading(true);
      console.log(`Fetching event ${eventId} from /swp391/events/${eventId}`);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const source = axios.CancelToken.source();
      const response = await eventService.getEventById(eventId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedEvent = mapEvent(response.data.result);
      setError(null);
      return { success: true, event: mappedEvent };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Get event cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Get event error:", error.response?.status, error.message);
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : error.response?.data?.message || "Không thể tải sự kiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      console.log("Creating event at /swp391/events");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const staffId = user.id; // Lấy từ AuthContext hoặc localStorage
      console.log("User from AuthContext:", user);
      console.log("staffId:", staffId);
      if (!staffId) {
        throw new Error(
          "Staff ID not found. Please ensure you are logged in as staff."
        );
      }
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("startTime", eventData.startTime + ":00"); // Thêm :00
      formData.append("endTime", eventData.endTime + ":00"); // Thêm :00
      formData.append("location", eventData.location);
      formData.append("description", eventData.description);
      formData.append("status", eventData.status);
      formData.append("staffId", staffId);
      if (eventData.image) {
        formData.append("image", eventData.image);
      }
      const source = axios.CancelToken.source();
      const response = await eventService.createEvent(formData, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newEvent = mapEvent(response.data.result);
      setEvents((prev) => [...prev, newEvent]);
      setError(null);
      return {
        success: true,
        message: "Tạo sự kiện thành công",
        event: newEvent,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Create event cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Create event error:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : error.response?.data?.message || "Tạo sự kiện thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      setLoading(true);
      console.log(`Updating event ${eventId} at /swp391/events/${eventId}`);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const staffId = user.id; // Lấy từ AuthContext hoặc localStorage
      if (!staffId) {
        throw new Error(
          "Staff ID not found. Please ensure you are logged in as staff."
        );
      }
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("startTime", eventData.startTime + ":00"); // Thêm :00
      formData.append("endTime", eventData.endTime + ":00"); // Thêm :00
      formData.append("location", eventData.location);
      formData.append("description", eventData.description);
      formData.append("status", eventData.status);
      formData.append("staffId", staffId);
      if (eventData.image) {
        formData.append("image", eventData.image);
      }
      const source = axios.CancelToken.source();
      const response = await eventService.updateEvent(eventId, formData, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedEvent = mapEvent(response.data.result);
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? updatedEvent : event))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật sự kiện thành công",
        event: updatedEvent,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Update event cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Update event error:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : error.response?.data?.message || "Cập nhật sự kiện thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      setLoading(true);
      console.log(`Deleting event ${eventId} at /swp391/events/${eventId}`);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const source = axios.CancelToken.source();
      await eventService.deleteEvent(eventId, { cancelToken: source.token });
      console.log("Event deleted successfully");
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setError(null);
      return { success: true, message: "Xóa sự kiện thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Delete event cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Delete event error:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : error.response?.data?.message || "Xóa sự kiện thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("EventProvider mounted");
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, skipping fetchEvents");
      setError("Vui lòng đăng nhập để xem sự kiện");
      setLoading(false);
      return;
    }

    fetchEvents();

    return () => {
      console.log("EventProvider unmounting");
    };
  }, []);

  const value = {
    events,
    loading,
    error,
    fetchEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
