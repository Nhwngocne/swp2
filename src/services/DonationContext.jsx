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
  const { user } = useAuth();
  const [donationHistories, setDonationHistories] = useState([]);
  const [donationRegistrations, setDonationRegistrations] = useState([]);
  const [regisOffline, setRegisOffline] = useState([]);
  const [regisReceive, setRegisReceive] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  // Mapping cho DonationHistoryResponse
  const mapDonationHistory = (history) => ({
    id: history.id,
    date: history.date,
    status: history.status || "PENDING",
    location: history.location || "",
    bloodGroup: history.bloodGroup || "UNKNOWN",
    volume: history.volume || 0,
    testResult: history.testResult || "",
    nextEligibleDate: history.nextEligibleDate,
    certificateNumber: history.certificateNumber || "",
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
        date: historyData.date,
        volume: historyData.volume,
        component: historyData.component,
        status: historyData.status,
        location: historyData.location,
        testResult: historyData.testResult,
        nextEligibleDate: historyData.nextEligibleDate,
        staffId: historyData.staffId,
        memberId: user.id, // Giả định memberId từ user
        bloodTypeId: historyData.bloodTypeId,
      };
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
        date: historyData.date,
        volume: historyData.volume,
        component: historyData.component,
        status: historyData.status,
        location: historyData.location,
        testResult: historyData.testResult,
        nextEligibleDate: historyData.nextEligibleDate,
        staffId: historyData.staffId,
        memberId: user.id, // Giả định memberId từ user
        bloodTypeId: historyData.bloodTypeId,
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

  // ===== Regis Offline =====
  const fetchRegisOffline = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy tất cả đăng ký offline từ /swp391/donations/offline");
      const source = axios.CancelToken.source();
      const response = await donationService.getAllRegisOffline({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedOffline = response.data.result.map(mapRegisOffline);
      setRegisOffline(mappedOffline);
      setError(null);
      return { success: true, offline: mappedOffline };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy đăng ký offline:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy đăng ký offline:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải đăng ký offline";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const getRegisOfflineById = async (id) => {
    try {
      setLoading(true);
      console.log(`Đang lấy đăng ký offline ${id} từ /swp391/donations/offline/${id}`);
      const source = axios.CancelToken.source();
      const response = await donationService.getRegisOfflineById(id, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedOffline = mapRegisOffline(response.data.result);
      setError(null);
      return { success: true, offline: mappedOffline };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy đăng ký offline:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy đăng ký offline:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải đăng ký offline";
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
      const payload = {
        bloodType: offlineData.bloodType,
      };
      const source = axios.CancelToken.source();
      const response = await donationService.createRegisOffline(payload, {
        cancelToken: source.token,
      });
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
      console.log(`Đang cập nhật đăng ký offline ${id} tại /swp391/donations/offline/${id}`);
      const payload = {
        bloodType: offlineData.bloodType,
      };
      const source = axios.CancelToken.source();
      const response = await donationService.updateRegisOffline(id, payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedOffline = mapRegisOffline(response.data.result);
      setRegisOffline((prev) =>
        prev.map((offline) => (offline.id === id ? updatedOffline : offline))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật đăng ký offline thành công",
        offline: updatedOffline,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy cập nhật đăng ký offline:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi cập nhật đăng ký offline:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Cập nhật đăng ký offline thất bại";
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
      const source = axios.CancelToken.source();
      await donationService.deleteRegisOffline(id, {
        cancelToken: source.token,
      });
      console.log("Xóa đăng ký offline thành công");
      setRegisOffline((prev) => prev.filter((offline) => offline.id !== id));
      setError(null);
      return { success: true, message: "Xóa đăng ký offline thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa đăng ký offline:", error.message);
        return { success: false, error: error.message };
      }
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
      const response = await donationService.getRegisReceiveById({
        cancelToken: source.token,
      });
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
      setRegisReceive((prev) => prev.filter((receive) => receive.id !== id));
      setError(null);
      return { success: true, message: "Xóa đăng ký nhận máu thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa đăng ký nhận máu:", error.message);
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
    fetchDonationHistories();
    fetchRegisOffline();
    fetchRegisReceive();
  }, [fetchDonationHistories, fetchRegisOffline, fetchRegisReceive]);

  const value = {
    donationHistories,
    donationRegistrations,
    regisOffline,
    regisReceive,
    loading,
    error,
    fetchDonationHistories,
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