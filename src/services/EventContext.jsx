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
    throw new Error("useEvents phải được dùng trong EventProvider");
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [forms, setForms] = useState([]); // Thêm state cho forms
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    createdBy: event.createdBy?.name || "Không xác định",
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
    createdBy: blog.createdBy?.name || "Không xác định",
  });

  const mapForm = (form) => ({
    id: form.id,
    eventId: form.eventId,
    eventTitle: form.eventTitle,
    eventDate: form.eventDate,
    eventLocation: form.eventLocation,
    memberId: form.memberId,
    memberName: form.memberName,
    memberEmail: form.memberEmail,
    bloodType: form.bloodType,
    donatedBefore: form.donatedBefore,
    currentlyIll: form.currentlyIll,
    illnessDetails: form.illnessDetails,
    hadSeriousDisease: form.hadSeriousDisease,
    diseaseDetails: form.diseaseDetails,
    hadMalariaOrOtherInfectious: form.hadMalariaOrOtherInfectious,
    receivedBlood: form.receivedBlood,
    gotVaccine: form.gotVaccine,
    noneOfAbove12Months: form.noneOfAbove12Months,
    tattooOrAcupuncture: form.tattooOrAcupuncture,
    hadSkinIssues: form.hadSkinIssues,
    usedAntibioticsOrAntiInflammatory: form.usedAntibioticsOrAntiInflammatory,
    symptomsPast2Weeks: form.symptomsPast2Weeks,
    symptomsPast1Week: form.symptomsPast1Week,
    isMenstruating: form.isMenstruating,
    isPregnantOrRecentlyDelivered: form.isPregnantOrRecentlyDelivered,
    noneOfFemaleConditions: form.noneOfFemaleConditions,
    status: form.status,
    approvedDate: form.approvedDate,
    approvedByStaffId: form.approvedByStaffId,
    approvedByStaffName: form.approvedByStaffName,
  });

  const fetchEvents = useCallback(async () => {
    if (isFetchingRef.current)
      return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy sự kiện từ /swp391/events");
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
        console.log("Hủy lấy sự kiện:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy sự kiện:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Không thể tải sự kiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const fetchBlogs = useCallback(async () => {
    if (isFetchingRef.current)
      return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy blog từ /swp391/blogs");
      const source = axios.CancelToken.source();
      const response = await eventService.getBlogs({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedBlogs = response.data.result.map(mapBlog);
      setBlogs(mappedBlogs);
      setError(null);
      return { success: true, blogs: mappedBlogs };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy blog:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy blog:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Không thể tải blog";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const fetchForms = useCallback(async () => {
    if (isFetchingRef.current)
      return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy biểu mẫu hiến máu từ /swp391/forms");
      const source = axios.CancelToken.source();
      const response = await eventService.getAllBloodDonationForms({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedForms = response.data.result.map(mapForm);
      setForms(mappedForms);
      setError(null);
      return { success: true, forms: mappedForms };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy biểu mẫu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy biểu mẫu:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Không thể tải biểu mẫu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const getEventById = async (eventId) => {
    try {
      setLoading(true);
      console.log(`Đang lấy sự kiện ${eventId} từ /swp391/events/${eventId}`);
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
        console.log("Hủy lấy sự kiện:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy sự kiện:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Không thể tải sự kiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getBlogById = async (blogId) => {
    try {
      setLoading(true);
      console.log(`Đang lấy blog ${blogId} từ /swp391/blogs/${blogId}`);
      const source = axios.CancelToken.source();
      const response = await eventService.getBlogById(blogId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedBlog = mapBlog(response.data.result);
      setError(null);
      return { success: true, blog: mappedBlog };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy blog:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy blog:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Không thể tải bài viết";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getFormById = async (formId) => {
    try {
      setLoading(true);
      console.log(`Đang lấy biểu mẫu ${formId} từ /swp391/forms/${formId}`);
      const source = axios.CancelToken.source();
      const response = await eventService.getBloodDonationFormById(formId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedForm = mapForm(response.data.result);
      setError(null);
      return { success: true, form: mappedForm };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy biểu mẫu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy biểu mẫu:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Không thể tải biểu mẫu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getFormsByMember = useCallback(
    async (memberId) => {
      if (isFetchingRef.current) {
        console.log("Bỏ qua gọi API vì đang tải, memberId:", memberId);
        return { success: false, error: "Đang tải dữ liệu" };
      }
      isFetchingRef.current = true;
      try {
        setLoading(true);
        console.log(
          `Đang lấy biểu mẫu của thành viên ${memberId} từ /swp391/forms/member/${memberId}`
        );
        const source = axios.CancelToken.source();
        const response = await eventService.getBloodDonationFormsByMember(
          memberId,
          {
            cancelToken: source.token,
          }
        );
        console.log("API response:", response.data);
        const mappedForms = response.data.result.map(mapForm);
        
        setForms((prevForms) => {
          const isDifferent = JSON.stringify(prevForms) !== JSON.stringify(mappedForms);
          console.log("setForms gọi, dữ liệu mới khác cũ:", isDifferent);
          if (isDifferent) {
            return mappedForms;
          }
          return prevForms;
        });
        
        setError(null);
        return { success: true, forms: mappedForms };
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Hủy lấy biểu mẫu:", error.message);
          return { success: false, error: error.message };
        }
        console.error("Lỗi lấy biểu mẫu:", error.response?.status, error.message);
        const errorMessage =
          error.response?.data?.message || "Không thể tải biểu mẫu";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [mapForm]
  );

  const getFormByMemberAndId = async (formId, memberId) => {
    try {
      setLoading(true);
      console.log(
        `Đang lấy biểu mẫu ${formId} của thành viên ${memberId} từ /swp391/forms/${formId}/member/${memberId}`
      );
      const source = axios.CancelToken.source();
      const response = await eventService.getBloodDonationFormByMemberAndId(
        formId,
        memberId,
        {
          cancelToken: source.token,
        }
      );
      console.log("API response:", response.data);
      const mappedForm = mapForm(response.data.result);
      setError(null);
      return { success: true, form: mappedForm };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy biểu mẫu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy biểu mẫu:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Không thể tải biểu mẫu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getFormsByEvent = async (eventId) => {
    try {
      setLoading(true);
      console.log(
        `Đang lấy biểu mẫu của sự kiện ${eventId} từ /swp391/forms/event/${eventId}`
      );
      const source = axios.CancelToken.source();
      const response = await eventService.getBloodDonationFormsByEvent(
        eventId,
        {
          cancelToken: source.token,
        }
      );
      console.log("API response:", response.data);
      const mappedForms = response.data.result.map(mapForm);
      setForms(mappedForms);
      setError(null);
      return { success: true, forms: mappedForms };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy biểu mẫu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy biểu mẫu:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Không thể tải biểu mẫu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      console.log("Đang tạo sự kiện tại /swp391/events");
      if (!user || !user.id)
        throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("startTime", eventData.startTime + ":00");
      formData.append("endTime", eventData.endTime + ":00");
      formData.append("location", eventData.location);
      formData.append("description", eventData.description);
      formData.append("status", eventData.status);
      formData.append("staffId", user.id);
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
        console.log("Hủy tạo sự kiện:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo sự kiện:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Tạo sự kiện thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (blogData) => {
    try {
      setLoading(true);
      console.log("Đang tạo blog tại /swp391/blogs");
      if (!user || !user.id)
        throw new Error("Người dùng chưa xác thực hoặc không có ID.");
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
      return { success: true, message: "Tạo blog thành công", blog: newBlog };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo blog:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo blog:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Tạo blog thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createBloodDonationForm = async (formData) => {
    try {
      setLoading(true);
      console.log("Đang tạo biểu mẫu hiến máu tại /swp391/forms");
      if (!user || !user.id)
        throw new Error("Người dùng chưa xác thực hoặc không có ID.");

      // Xây dựng payload với kiểm tra null/undefined
      const payload = {
        eventId: parseInt(formData.eventId) || 0,
        memberId: parseInt(user.id) || 0,
        bloodType: formData.blood_type || "UNKNOWN",
        donatedBefore: formData.donated_before === "co" || false,
        currentlyIll: formData.current_illness === "co" || false,
        illnessDetails: formData.illness_details || "",
        hadSeriousDisease:
          formData.past_diseases === "co" || formData.past_diseases === "benh_khac" || false,
        diseaseDetails: formData.disease_details || "",
        hadMalariaOrOtherInfectious:
          Array.isArray(formData.past_year) && formData.past_year.includes("sot_ret") || false,
        receivedBlood:
          Array.isArray(formData.past_year) && formData.past_year.includes("truyen_mau") || false,
        gotVaccine:
          Array.isArray(formData.past_year) && formData.past_year.includes("tiem_vaccine") || false,
        noneOfAbove12Months:
          Array.isArray(formData.past_year) && (formData.past_year.length === 0 || formData.past_year.includes("khong")) || false,
        tattooOrAcupuncture:
          Array.isArray(formData.past_6months) && formData.past_6months.includes("xam_hinh") || false,
        hadSkinIssues:
          Array.isArray(formData.past_6months) && formData.past_6months.includes("noi_mun") || false,
        usedAntibioticsOrAntiInflammatory:
          Array.isArray(formData.past_month) && formData.past_month.includes("nhan_thuoc") || false,
        symptomsPast2Weeks: formData.other_2weeks || "",
        symptomsPast1Week: formData.other_week || "",
        isMenstruating:
          Array.isArray(formData.female_questions) && formData.female_questions.includes("dang_co_kinh") || false,
        isPregnantOrRecentlyDelivered:
          Array.isArray(formData.female_questions) && formData.female_questions.includes("co_thai") || false,
        noneOfFemaleConditions:
          Array.isArray(formData.female_questions) && formData.female_questions.includes("khong_nu") || false,
      };

      // Đảm bảo các mảng không null trước khi xử lý
      const safePastYear = Array.isArray(formData.past_year) ? formData.past_year : [];
      const safePast6Months = Array.isArray(formData.past_6months) ? formData.past_6months : [];
      const safePastMonth = Array.isArray(formData.past_month) ? formData.past_month : [];
      const safeFemaleQuestions = Array.isArray(formData.female_questions) ? formData.female_questions : [];

      // Cập nhật lại payload với mảng an toàn
      payload.hadMalariaOrOtherInfectious = safePastYear.includes("sot_ret") || false;
      payload.receivedBlood = safePastYear.includes("truyen_mau") || false;
      payload.gotVaccine = safePastYear.includes("tiem_vaccine") || false;
      payload.noneOfAbove12Months = safePastYear.length === 0 || safePastYear.includes("khong") || false;
      payload.tattooOrAcupuncture = safePast6Months.includes("xam_hinh") || false;
      payload.hadSkinIssues = safePast6Months.includes("noi_mun") || false;
      payload.usedAntibioticsOrAntiInflammatory = safePastMonth.includes("nhan_thuoc") || false;
      payload.isMenstruating = safeFemaleQuestions.includes("dang_co_kinh") || false;
      payload.isPregnantOrRecentlyDelivered = safeFemaleQuestions.includes("co_thai") || false;
      payload.noneOfFemaleConditions = safeFemaleQuestions.includes("khong_nu") || false;

      console.log("Payload gửi đến API:", payload); // Log để kiểm tra

      const source = axios.CancelToken.source();
      const response = await eventService.createBloodDonationForm(payload, {
        cancelToken: source.token,
      });
      console.log("Phản hồi API:", response.data);
      const newForm = mapForm(response.data.result);
      setForms((prev) => [...prev, newForm]);
      setError(null);
      return {
        success: true,
        message: "Tạo biểu mẫu thành công",
        form: newForm,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo biểu mẫu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo biểu mẫu:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Tạo biểu mẫu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      setLoading(true);
      console.log(
        `Đang cập nhật sự kiện ${eventId} tại /swp391/events/${eventId}`
      );
      if (!user || !user.id)
        throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("startTime", eventData.startTime + ":00");
      formData.append("endTime", eventData.endTime + ":00");
      formData.append("location", eventData.location);
      formData.append("description", eventData.description);
      formData.append("status", eventData.status);
      formData.append("staffId", user.id);
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
        console.log("Hủy cập nhật sự kiện:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Lỗi cập nhật sự kiện:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.data?.message || "Cập nhật sự kiện thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (blogId, blogData) => {
    try {
      setLoading(true);
      console.log(`Đang cập nhật blog ${blogId} tại /swp391/blogs/${blogId}`);
      if (!user || !user.id)
        throw new Error("Người dùng chưa xác thực hoặc không có ID.");
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
        console.log("Hủy cập nhật blog:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Lỗi cập nhật blog:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.data?.message || "Cập nhật blog thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateBloodDonationFormByStaff = async (formData) => {
    try {
      setLoading(true);
      console.log(
        "Đang cập nhật biểu mẫu hiến máu bởi staff tại /swp391/forms/approve"
      );
      if (!user || !user.id)
        throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = { ...formData, staffId: user.id };
      const source = axios.CancelToken.source();
      const response = await eventService.updateBloodDonationFormByStaff(
        payload,
        {
          cancelToken: source.token,
        }
      );
      console.log("API response:", response.data);
      const updatedForm = mapForm(response.data.result);
      setForms((prev) =>
        prev.map((form) => (form.id === updatedForm.id ? updatedForm : form))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật biểu mẫu thành công",
        form: updatedForm,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy cập nhật biểu mẫu:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Lỗi cập nhật biểu mẫu:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.data?.message || "Cập nhật biểu mẫu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateBloodDonationFormByMember = async (
    formId,
    memberId,
    formData
  ) => {
    try {
      setLoading(true);
      console.log(
        `Đang cập nhật biểu mẫu ${formId} bởi thành viên ${memberId} tại /swp391/forms/${formId}/member/${memberId}`
      );
      if (!user || !user.id)
        throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = { ...formData, memberId: user.id };
      const source = axios.CancelToken.source();
      const response = await eventService.updateBloodDonationFormByMember(
        formId,
        memberId,
        payload,
        {
          cancelToken: source.token,
        }
      );
      console.log("API response:", response.data);
      const updatedForm = mapForm(response.data.result);
      setForms((prev) =>
        prev.map((form) => (form.id === formId ? updatedForm : form))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật biểu mẫu thành công",
        form: updatedForm,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy cập nhật biểu mẫu:", error.message);
        return { success: false, error: error.message };
      }
      console.error(
        "Lỗi cập nhật biểu mẫu:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.data?.message || "Cập nhật biểu mẫu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      setLoading(true);
      console.log(`Đang xóa sự kiện ${eventId} tại /swp391/events/${eventId}`);
      const source = axios.CancelToken.source();
      await eventService.deleteEvent(eventId, { cancelToken: source.token });
      console.log("Xóa sự kiện thành công");
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setError(null);
      return { success: true, message: "Xóa sự kiện thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa sự kiện:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa sự kiện:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Xóa sự kiện thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      setLoading(true);
      console.log(`Đang xóa blog ${blogId} tại /swp391/blogs/${blogId}`);
      const source = axios.CancelToken.source();
      await eventService.deleteBlog(blogId, { cancelToken: source.token });
      console.log("Xóa blog thành công");
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
      setError(null);
      return { success: true, message: "Xóa blog thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa blog:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa blog:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa blog thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteBloodDonationForm = async (formId) => {
    try {
      setLoading(true);
      console.log(`Đang xóa biểu mẫu ${formId} tại /swp391/forms/${formId}`);
      const source = axios.CancelToken.source();
      await eventService.deleteBloodDonationForm(formId, {
        cancelToken: source.token,
      });
      console.log("Xóa biểu mẫu thành công");
      setForms((prev) => prev.filter((form) => form.id !== formId));
      setError(null);
      return { success: true, message: "Xóa biểu mẫu thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa biểu mẫu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa biểu mẫu:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Xóa biểu mẫu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("EventProvider mounted, user:", user);
    fetchEvents();
    fetchBlogs();
    return () => {
      console.log("EventProvider unmounting, user:", user);
    };
  }, [fetchEvents, fetchBlogs]);

  const value = {
    events,
    blogs,
    forms,
    loading,
    error,
    fetchEvents,
    fetchBlogs,
    fetchForms,
    getEventById,
    getBlogById,
    getFormById,
    getFormsByMember,
    getFormByMemberAndId,
    getFormsByEvent,
    createEvent,
    createBlog,
    createBloodDonationForm,
    updateEvent,
    updateBlog,
    updateBloodDonationFormByStaff,
    updateBloodDonationFormByMember,
    deleteEvent,
    deleteBlog,
    deleteBloodDonationForm,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};