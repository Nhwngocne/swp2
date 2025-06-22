import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false); // Bắt đầu với false
  const [error, setError] = useState(null);
  //const [isFetching, setIsFetching] = useState(false); // Thêm cờ để kiểm soát gọi API
  const isFetchingRef = useRef(false);

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

  const mapBlog = (blog) => ({
    id: blog.id,
    title: blog.title,
    summary: blog.summary,
    content: blog.content,
    author: blog.author,
    category: blog.category || "Khác",
    image: blog.image || "/assets/blog-default.jpg",
    imageUrls: blog.imageUrls || [],
    views: blog.views || 0,
    publishDate: blog.publishedDate,
    createdBy: blog.createdBy?.name || "Unknown",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log("Fetching events from /swp391/events");
      const token = localStorage.getItem("token");
      const source = axios.CancelToken.source();
      const response = await eventService.getEvents({
        cancelToken: source.token,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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
  }; // Không phụ thuộc vào bất kỳ state nào

  const fetchBlogs = useCallback(async () => {
    //if (isFetching) return; // Ngăn gọi API nếu đang fetch
    if (isFetchingRef.current) return; // Ngăn gọi API nếu đang fetch
    try {
      // setIsFetching(true);
      isFetchingRef.current = true;
      setLoading(true);
      console.log("Fetching blogs from /swp391/blogs");
      const token = localStorage.getItem("token");
      const source = axios.CancelToken.source();
      const response = await eventService.getBlogs({
        cancelToken: source.token,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("API response:", response.data);
      const mappedBlogs = response.data.result.map(mapBlog);
      setBlogs(mappedBlogs);
      setError(null);
      return { success: true, blogs: mappedBlogs };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Fetch blogs cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Fetch blogs error:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : error.response?.data?.message || "Không thể tải blog";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      // setIsFetching(false);
      isFetchingRef.current = false;
    }
  }, []); // Không phụ thuộc vào bất kỳ state nào

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

  const getBlogById = async (blogId) => {
    try {
      setLoading(true);
      console.log(`Fetching blog ${blogId} from /swp391/blogs/${blogId}`);
      const source = axios.CancelToken.source();
      const response = await eventService.getBlogById(blogId, {
        cancelToken: source.token,
      }); // Không cần gửi headers, để interceptor xử lý
      console.log("API response:", response.data);
      const mappedBlog = mapBlog(response.data.result);
      setError(null);
      return { success: true, blog: mappedBlog };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Get blog cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Get blog error:", error.response?.status, error.message);
      const errorMessage =
        error.response?.status === 401
          ? "Không thể tải bài viết. Vui lòng thử lại." // Không yêu cầu đăng nhập
          : error.response?.data?.message || "Không thể tải bài viết";
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
      const staffId = user.id;
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
      formData.append("startTime", eventData.startTime + ":00");
      formData.append("endTime", eventData.endTime + ":00");
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

  const createBlog = async (blogData) => {
    try {
      setLoading(true);
      console.log("Creating blog at /swp391/blogs");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const adminId = user.id;
      if (!adminId) {
        throw new Error(
          "Admin ID not found. Please ensure you are logged in as admin."
        );
      }
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("summary", blogData.summary);
      formData.append("content", blogData.content);
      formData.append("author", blogData.author);
      formData.append("category", blogData.category);
      formData.append("publishedDate", blogData.publishDate);
      if (blogData.image) {
        formData.append("image", blogData.image);
      }
      const source = axios.CancelToken.source();
      const response = await eventService.createBlog(formData, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newBlog = mapBlog(response.data.result);
      setBlogs((prev) => [...prev, newBlog]);
      setError(null);
      return {
        success: true,
        message: "Tạo blog thành công",
        blog: newBlog,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Create blog cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Create blog error:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : error.response?.data?.message || "Tạo blog thất bại";
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
      const staffId = user.id;
      if (!staffId) {
        throw new Error(
          "Staff ID not found. Please ensure you are logged in as staff."
        );
      }
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("startTime", eventData.startTime + ":00");
      formData.append("endTime", eventData.endTime + ":00");
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

  const updateBlog = async (blogId, blogData) => {
    try {
      setLoading(true);
      console.log(`Updating blog ${blogId} at /swp391/blogs/${blogId}`);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const adminId = user.id;
      if (!adminId) {
        throw new Error(
          "Admin ID not found. Please ensure you are logged in as admin."
        );
      }
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("summary", blogData.summary);
      formData.append("content", blogData.content);
      formData.append("author", blogData.author);
      formData.append("category", blogData.category);
      formData.append("publishedDate", blogData.publishDate);
      if (blogData.image) {
        formData.append("image", blogData.image);
      }
      const source = axios.CancelToken.source();
      const response = await eventService.updateBlog(blogId, formData, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedBlog = mapBlog(response.data.result);
      setBlogs((prev) =>
        prev.map((blog) => (blog.id === blogId ? updatedBlog : blog))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật blog thành công",
        blog: updatedBlog,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Update blog cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Update blog error:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : error.response?.data?.message || "Cập nhật blog thất bại";
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

  const deleteBlog = async (blogId) => {
    try {
      setLoading(true);
      console.log(`Deleting blog ${blogId} at /swp391/blogs/${blogId}`);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const source = axios.CancelToken.source();
      await eventService.deleteBlog(blogId, { cancelToken: source.token });
      console.log("Blog deleted successfully");
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
      setError(null);
      return { success: true, message: "Xóa blog thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Delete blog cancelled:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Delete blog error:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : error.response?.data?.message || "Xóa blog thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("EventProvider mounted");
    fetchEvents();
    fetchBlogs();

    return () => {
      console.log("EventProvider unmounting");
    };
  }, []);

  const value = {
    events,
    blogs,
    loading,
    error,
    fetchEvents,
    fetchBlogs,
    getEventById,
    getBlogById,
    createEvent,
    createBlog,
    updateEvent,
    updateBlog,
    deleteEvent,
    deleteBlog,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
