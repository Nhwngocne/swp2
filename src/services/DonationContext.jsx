import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { donationService } from "../services/donationService";
import { useAuth } from "../services/AuthContext";
import axios from "axios";

const DonationContext = createContext();

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonation phải được dùng trong DonationProvider");
  }
  return context;
};

export const DonationProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [donationHistories, setDonationHistories] = useState([]);
  const [donationRegistrations, setDonationRegistrations] = useState([]);
  const [regisOffline, setRegisOffline] = useState([]);
  const [regisReceive, setRegisReceive] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);
  const [forms, setForms] = useState([]);

  // Mapping cho DonationHistoryResponse
  const mapDonationHistory = (history) => ({
    id: history.id,
    createdDate: history.createdDate, // Khớp với DonationHistoryResponse
    result: history.result || "Không đạt", // "Đạt" hoặc "Không đạt"
    location: history.location || "",
    bloodType: history.bloodType || "UNKNOWN", // Khớp với String bloodType
    volume: history.volume || 0,
    memberId: history.memberId,
    memberName: history.memberName || "Không xác định",
    nextEligibleDate: history.nextEligibleDate,
    certificateNumber: history.certificateNumber || "",
    bloodDonationForm: history.bloodDonationForm || null,
    bloodIntentFormResponse: history.bloodIntentFormResponse || null,
  });

  // Mapping cho DonationRegistrationResponse (giả định không có response cụ thể, dùng trạng thái)
  const mapDonationRegistration = (status) => ({ status });

  // Mapping cho RegisOfflineResponse
  const mapRegisOffline = (offline) => ({
    id: offline.id,
    name: offline.name || "Không xác định",
    phone: offline.phone || "",
    numberCccd: offline.numberCccd || "",
    address: offline.address || "",
  });

  // Mapping cho RegisReceiveResponse
  const mapRegisReceive = (receive) => ({
    id: receive.id,
  });

  // ===== Donation History =====
  const fetchDonationHistories = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy tất cả lịch sử hiến máu từ /swp391/donations/histories");
      const source = axios.CancelToken.source();
      const response = await donationService.getAllDonationHistories({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedHistories = response.data.result.map(mapDonationHistory);
      setDonationHistories(mappedHistories);
      setError(null);
      return { success: true, histories: mappedHistories };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy lịch sử hiến máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải lịch sử hiến máu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const fetchDonationHistoriesByMemberId = useCallback(async (memberId) => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log(`Đang lấy lịch sử hiến máu của member ${memberId} từ /swp391/donations/histories/member/${memberId}`);
      const source = axios.CancelToken.source();
      const response = await donationService.getDonationHistoriesByMemberId(memberId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedHistories = response.data.result.map(mapDonationHistory);
      setDonationHistories(mappedHistories);
      setError(null);
      return { success: true, histories: mappedHistories };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy lịch sử hiến máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải lịch sử hiến máu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const getDonationHistoryById = async (id) => {
    try {
      setLoading(true);
      console.log(`Đang lấy lịch sử hiến máu ${id} từ /swp391/donations/histories/${id}`);
      const source = axios.CancelToken.source();
      const response = await donationService.getDonationHistoryById(id, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedHistory = mapDonationHistory(response.data.result);
      setError(null);
      return { success: true, history: mappedHistory };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy lịch sử hiến máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải lịch sử hiến máu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createDonationHistory = async (historyData) => {
    try {
      setLoading(true);
      console.log("Đang tạo lịch sử hiến máu tại /swp391/donations/histories");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = {
        result: historyData.result, // "Đạt" hoặc "Không đạt"
        location: historyData.location,
        volume: historyData.volume,
        bloodTypeId: historyData.bloodTypeId,
        bloodDonationFormId: historyData.bloodDonationFormId,
        memberId: historyData.memberId, // Lấy từ user
        staffId: historyData.staffId,
        eventId: historyData.eventId, 

      };
          console.log("Payload gửi backend:", JSON.stringify(payload, null, 2));

      const source = axios.CancelToken.source();
      const response = await donationService.createDonationHistory(payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newHistory = mapDonationHistory(response.data.result);
      setDonationHistories((prev) => [...prev, newHistory]);
      setError(null);
      return {
        success: true,
        message: "Tạo lịch sử hiến máu thành công",
        history: newHistory,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo lịch sử hiến máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Tạo lịch sử hiến máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateDonationHistory = async (id, historyData) => {
    try {
      setLoading(true);
      console.log(`Đang cập nhật lịch sử hiến máu ${id} tại /swp391/donations/histories/${id}`);
      const payload = {
        result: historyData.result,
        location: historyData.location,
        volume: historyData.volume,
        bloodTypeId: historyData.bloodTypeId,
        bloodDonationFormId: historyData.bloodDonationFormId,
        memberId: historyData.memberId,
        staffId: historyData.staffId,
      };
      const source = axios.CancelToken.source();
      const response = await donationService.updateDonationHistory(id, payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedHistory = mapDonationHistory(response.data.result);
      setDonationHistories((prev) =>
        prev.map((history) => (history.id === id ? updatedHistory : history))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật lịch sử hiến máu thành công",
        history: updatedHistory,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy cập nhật lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi cập nhật lịch sử hiến máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Cập nhật lịch sử hiến máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteDonationHistory = async (id) => {
    try {
      setLoading(true);
      console.log(`Đang xóa lịch sử hiến máu ${id} tại /swp391/donations/histories/${id}`);
      const source = axios.CancelToken.source();
      await donationService.deleteDonationHistory(id, {
        cancelToken: source.token,
      });
      console.log("Xóa lịch sử hiến máu thành công");
      setDonationHistories((prev) => prev.filter((history) => history.id !== id));
      setError(null);
      return { success: true, message: "Xóa lịch sử hiến máu thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa lịch sử hiến máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa lịch sử hiến máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ===== Donation Registration =====
  const createDonationRegistration = async (registrationData) => {
    try {
      setLoading(true);
      console.log("Đang tạo đăng ký hiến máu tại /swp391/donations/registrations");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = {
        donateDate: registrationData.donateDate,
        location: registrationData.location,
        status: registrationData.status,
        component: registrationData.component,
      };
      const source = axios.CancelToken.source();
      const response = await donationService.createDonationRegistration(payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newStatus = mapDonationRegistration(response.data.result);
      setDonationRegistrations((prev) => [...prev, newStatus]);
      setError(null);
      return {
        success: true,
        message: "Tạo đăng ký hiến máu thành công",
        status: newStatus,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo đăng ký hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo đăng ký hiến máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Tạo đăng ký hiến máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateDonationRegistration = async (id, registrationData) => {
    try {
      setLoading(true);
      console.log(`Đang cập nhật đăng ký hiến máu ${id} tại /swp391/donations/registrations/${id}`);
      const payload = {
        donateDate: registrationData.donateDate,
        location: registrationData.location,
        status: registrationData.status,
        component: registrationData.component,
      };
      const source = axios.CancelToken.source();
      const response = await donationService.updateDonationRegistration(id, payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedStatus = mapDonationRegistration(response.data.result);
      setDonationRegistrations((prev) =>
        prev.map((reg) => (reg.id === id ? updatedStatus : reg))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật đăng ký hiến máu thành công",
        status: updatedStatus,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy cập nhật đăng ký hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi cập nhật đăng ký hiến máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Cập nhật đăng ký hiến máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteDonationRegistration = async (id) => {
    try {
      setLoading(true);
      console.log(`Đang xóa đăng ký hiến máu ${id} tại /swp391/donations/registrations/${id}`);
      const source = axios.CancelToken.source();
      await donationService.deleteDonationRegistration(id, {
        cancelToken: source.token,
      });
      console.log("Xóa đăng ký hiến máu thành công");
      setDonationRegistrations((prev) => prev.filter((reg) => reg.id !== id));
      setError(null);
      return { success: true, message: "Xóa đăng ký hiến máu thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa đăng ký hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa đăng ký hiến máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa đăng ký hiến máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getFormsByMember = async (memberId) => {
    setLoading(true);
    try {
      console.log(`Đang lấy danh sách đăng ký của member ${memberId} từ /swp391/forms/member/${memberId}`);
      const source = axios.CancelToken.source();
      const response = await donationService.getDonationRegistrationsByMember(memberId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      setForms(response.data.result || []);
      setError(null);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy danh sách đăng ký:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy danh sách đăng ký:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải danh sách đăng ký";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ===== Regis Offline =====
    const fetchRegisOffline = useCallback(async () => {
  if (isFetchingRef.current) {
    return { success: false, error: "Đang tải dữ liệu..." };
  }

  isFetchingRef.current = true;
  setLoading(true);

  try {
    const response = await donationService.getAllRegisOffline();
    const data = response?.data?.result || [];

    // Map lại dữ liệu nếu cần sửa format ngày và trạng thái
    const mapped = data.map((item) => ({
      ...item,
      createdAt: item.createdAt 
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "",
      status: item.status?.toUpperCase() || "CHƯA RÕ",
    }));

    setRegisOfflineList(mapped);
    setError(null);
    return { success: true, data: mapped };

  } catch (err) {
    const errorMsg = err.response?.data?.message || "Không thể tải danh sách đơn đăng ký";
    console.error("Lỗi khi tải danh sách regisOffline:", err);
    setError(errorMsg);
    return { success: false, error: errorMsg };

  } finally {
    setLoading(false);
    isFetchingRef.current = false;
  }
}, []);


  const getRegisOfflineById = async (id) => {
  if (!id) return { success: false, error: "ID không hợp lệ" };

  try {
    setLoading(true);
    console.log(`Đang lấy đơn đăng ký offline với ID: ${id}`);
    
    const response = await donationService.getRegisOfflineById(id);
    
    if (!response?.data?.result) {
      throw new Error("Không tìm thấy dữ liệu đơn đăng ký");
    }

    // Có thể map lại dữ liệu nếu cần
    const mappedOffline = mapRegisOffline(response.data.result);

    setError(null);
    return { success: true, offline: mappedOffline };
  } catch (error) {
    console.error("Lỗi khi lấy đơn đăng ký offline:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Không thể tải đơn đăng ký offline";
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

  const createRegisOffline = async (offlineData) => {
  try {
    setLoading(true);
    console.log("Đang tạo đăng ký offline tại /swp391/donations/offline");

    if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");

    // Tạo payload đúng theo RegisOfflineRequest
    const payload = {
      name: offlineData.name,
      phone: offlineData.phone,
      numberCccd: offlineData.numberCccd,
      address: offlineData.address || "",
      email: offlineData.email || "",
      donatedBefore: offlineData.donatedBefore || false,
      hadSeriousDisease: offlineData.hadSeriousDisease || false,
      hadMalariaOrOtherInfectious: offlineData.hadMalariaOrOtherInfectious || false,
      receivedBlood: offlineData.receivedBlood || false,
      gotVaccine: offlineData.gotVaccine || false,
      noneOfAbove12Months: offlineData.noneOfAbove12Months || false,
      tattooOrAcupuncture: offlineData.tattooOrAcupuncture || false,
      hadSkinIssues: offlineData.hadSkinIssues || false,
      usedAntibioticsOrAntiInflammatory: offlineData.usedAntibioticsOrAntiInflammatory || false,
      symptomsPast2Weeks: offlineData.symptomsPast2Weeks || false,
      symptomsPast1Week: offlineData.symptomsPast1Week || false,
      isMenstruating: offlineData.isMenstruating || false,
      isPregnantOrRecentlyDelivered: offlineData.isPregnantOrRecentlyDelivered || false,
      noneOfFemaleConditions: offlineData.noneOfFemaleConditions || false,
      staffId: user.id, // ID nhân viên hiện tại
      location: offlineData.location,
      weight: offlineData.weight || null,
      height: offlineData.height || null,
      bloodPressure: offlineData.bloodPressure || "",
    };

    const response = await donationService.createRegisOffline(payload);
    console.log("API response:", response.data);

    const newOffline = mapRegisOffline(response.data.result);
    setRegisOffline((prev) => [...prev, newOffline]);
    setError(null);

    return {
      success: true,
      message: "Tạo đăng ký offline thành công",
      offline: newOffline,
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Hủy tạo đăng ký offline:", error.message);
      return { success: false, error: error.message };
    }
    console.error("Lỗi tạo đăng ký offline:", error.response?.status, error.message);
    const errorMessage = error.response?.data?.message || "Tạo đăng ký offline thất bại";
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};


 const updateRegisOffline = async (id, offlineData) => {
  try {
    setLoading(true);

    if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");

    const payload = {
      id: id,
      bloodType: offlineData.bloodType,
      volumeMl: Number(offlineData.volumeMl),
      result: offlineData.result,
      note: offlineData.note || "",
      staffId: Number(user.id),
      status: "COMPLETED", // mặc định
    };

    const response = await donationService.updateRegisOffline(id, payload);
    return {
      success: true,
      data: response.data.result,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Cập nhật thất bại";
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

 const deleteRegisOffline = async (id) => {
  try {
    setLoading(true);
    console.log(`Đang xóa đăng ký offline ${id} tại /swp391/donations/offline/${id}`);
    await donationService.deleteRegisOffline(id);
    setRegisOffline((prev) => prev.filter((offline) => offline.id !== id));
    setError(null);
    return { success: true, message: "Xóa đăng ký offline thành công" };
  } catch (error) {
    console.error("Lỗi xóa đăng ký offline:", error.response?.status, error.message);
    const errorMessage = error.response?.data?.message || "Xóa đăng ký offline thất bại";
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

  // ===== Regis Receive from Registration =====
  const fetchRegisReceive = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy tất cả đăng ký nhận máu từ /swp391/donations/receive");
      const source = axios.CancelToken.source();
      const response = await donationService.getAllForms({ cancelToken: source.token }); // Sửa để gọi API đúng
      console.log("API response:", response.data);
      const mappedReceive = response.data.result.map(mapRegisReceive);
      setRegisReceive(mappedReceive);
      setError(null);
      return { success: true, receive: mappedReceive };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy đăng ký nhận máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy đăng ký nhận máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải đăng ký nhận máu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const getRegisReceiveById = async (id) => {
    try {
      setLoading(true);
      console.log(`Đang lấy đăng ký nhận máu ${id} từ /swp391/donations/receive/${id}`);
      const source = axios.CancelToken.source();
      const response = await donationService.getRegisReceiveById(id, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedReceive = mapRegisReceive(response.data.result);
      setError(null);
      return { success: true, receive: mappedReceive };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy đăng ký nhận máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy đăng ký nhận máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải đăng ký nhận máu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createRegisReceiveFromRegistration = async (receiveData) => {
    try {
      setLoading(true);
      console.log("Đang tạo đăng ký nhận máu tại /swp391/donations/receive-from-registration");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = {
        donateDate: receiveData.donateDate,
        location: receiveData.location,
        status: receiveData.status,
        component: receiveData.component,
      };
      const source = axios.CancelToken.source();
      const response = await donationService.createRegisReceiveFromRegistration(payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newReceive = mapRegisReceive(response.data.result);
      setRegisReceive((prev) => [...prev, newReceive]);
      setError(null);
      return {
        success: true,
        message: "Tạo đăng ký nhận máu thành công",
        receive: newReceive,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo đăng ký nhận máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo đăng ký nhận máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Tạo đăng ký nhận máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateRegisReceiveFromRegistration = async (id, receiveData) => {
    try {
      setLoading(true);
      console.log(`Đang cập nhật đăng ký nhận máu ${id} tại /swp391/donations/receive/${id}`);
      const payload = {
        donateDate: receiveData.donateDate,
        location: receiveData.location,
        status: receiveData.status,
        component: receiveData.component,
      };
      const source = axios.CancelToken.source();
      const response = await donationService.updateRegisReceiveFromRegistration(id, payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedReceive = mapRegisReceive(response.data.result);
      setRegisReceive((prev) =>
        prev.map((receive) => (receive.id === id ? updatedReceive : receive))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật đăng ký nhận máu thành công",
        receive: updatedReceive,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy cập nhật đăng ký nhận máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi cập nhật đăng ký nhận máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Cập nhật đăng ký nhận máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteRegisReceive = async (id) => {
    try {
      setLoading(true);
      console.log(`Đang xóa đăng ký nhận máu ${id} tại /swp391/donations/receive/${id}`);
      const source = axios.CancelToken.source();
      await donationService.deleteRegisReceive(id, {
        cancelToken: source.token,
      });
      console.log("Xóa đăng ký nhận máu thành công");
      setRegisReceive((prev) => prev.filter((receive) => (receive.id !== id)));
      setError(null);
      return { success: true, message: "Xóa đăng ký nhận máu thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa đăng ký nhận máu:", error, message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa đăng ký nhận máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa đăng ký nhận máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      if (user.id) fetchDonationHistoriesByMemberId(user.id);
      else fetchDonationHistories();
      fetchRegisOffline();
      fetchRegisReceive();
    }
  }, [authLoading, user, fetchDonationHistories, fetchDonationHistoriesByMemberId, fetchRegisOffline, fetchRegisReceive]);

  const value = {
    donationHistories,
    donationRegistrations,
    regisOffline,
    regisReceive,
    loading,
    error,
    forms,
    getFormsByMember,
    fetchDonationHistories,
    fetchDonationHistoriesByMemberId,
    getDonationHistoryById,
    createDonationHistory,
    updateDonationHistory,
    deleteDonationHistory,
    createDonationRegistration,
    updateDonationRegistration,
    deleteDonationRegistration,
    fetchRegisOffline,
    getRegisOfflineById,
    createRegisOffline,
    updateRegisOffline,
    deleteRegisOffline,
    fetchRegisReceive,
    getRegisReceiveById,
    createRegisReceiveFromRegistration,
    updateRegisReceiveFromRegistration,
    deleteRegisReceive,
  };

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
};