import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { donationService } from "../services/donationService";
import { useAuth } from "./AuthContext";
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
  const [forms, setForms] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [totalVolume, setTotalVolume] = useState(null); // New state for total volume
  const isFetchingRef = useRef(false);

  // Mapping cho DonationHistoryResponse
  const mapDonationHistory = (history) => ({
    id: history.id,
    createdDate: history.createdDate,
    result: history.result || "Không đạt",
    location: history.location || "",
    bloodType: history.bloodType || "UNKNOWN",
    volume: history.volume || 0,
    memberId: history.memberId,
    memberName: history.memberName || "Không xác định",
    nextEligibleDate: history.nextEligibleDate,
    certificateNumber: history.certificateNumber || "",
    bloodDonationForm: history.bloodDonationForm || null,
    bloodIntentFormResponse: history.bloodIntentFormResponse || null,
  });

  // Mapping cho DonationRegistrationResponse
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

  // Mapping cho TopDonorResponse
  const mapTopDonor = (donor) => {
    console.log("mapTopDonor: Đang map donor:", JSON.stringify(donor, null, 2));
    return {
      memberId: donor.memberId,
      memberName: donor.memberName || "Không xác định",
      totalVolume: donor.totalVolume || 0,
      donationCount: donor.donationCount || 0,
    };
  };
// volume
  const fetchTotalVolumeByMemberId = useCallback(async (memberId) => {
    if (isFetchingRef.current) {
      console.log("fetchTotalVolumeByMemberId: Đang tải, bỏ qua yêu cầu mới");
      return { success: false, error: "Đang tải dữ liệu" };
    }
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log(
        `fetchTotalVolumeByMemberId: Đang lấy tổng volume của member ${memberId} từ /swp391/total-volume/${memberId}`
      );
      const source = axios.CancelToken.source();
      const response = await donationService.getTotalVolumeByMemberId(memberId, {
        cancelToken: source.token,
      });
      console.log(
        "fetchTotalVolumeByMemberId: API response:",
        JSON.stringify(response.data, null, 2)
      );
      const volume = response.data.result || 0;
      setTotalVolume(volume);
      setError(null);
      return { success: true, totalVolume: volume };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "fetchTotalVolumeByMemberId: Hủy lấy tổng volume:",
          error.message
        );
        return { success: false, error: error.message };
      }
      console.error(
        "fetchTotalVolumeByMemberId: Lỗi lấy tổng volume:",
        error.response?.status,
        error.message
      );
      const errorMessage =
        error.response?.data?.message || "Không thể tải tổng volume";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      console.log("fetchTotalVolumeByMemberId: Hoàn tất yêu cầu, loading:", false);
    }
  }, []);
  // Fetch Top Donors
  const fetchTopDonors = useCallback(async (limit = 10) => {
    if (isFetchingRef.current) {
      console.log("fetchTopDonors: Đang tải, bỏ qua yêu cầu mới");
      return { success: false, error: "Đang tải dữ liệu" };
    }
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log(`fetchTopDonors: Gửi yêu cầu tới /swp391/donations/top-donors?limit=${limit}`);
      console.log("fetchTopDonors: Token trong localStorage:", localStorage.getItem("token"));
      const source = axios.CancelToken.source();
      const response = await donationService.getTopDonors(limit, {
        cancelToken: source.token,
      });
      console.log("fetchTopDonors: Response từ BE:", JSON.stringify(response.data, null, 2));
      const result = response.data.result || [];
      console.log("fetchTopDonors: result:", JSON.stringify(result, null, 2));
      const mappedDonors = result.map(mapTopDonor);
      console.log("fetchTopDonors: Dữ liệu sau khi map:", JSON.stringify(mappedDonors, null, 2));
      setTopDonors(mappedDonors);
      console.log("fetchTopDonors: Đã set topDonors:", JSON.stringify(mappedDonors, null, 2));
      setError(null);
      return { success: true, donors: mappedDonors };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("fetchTopDonors: Yêu cầu bị hủy:", error.message);
        return { success: false, error: error.message };
      }
      console.error("fetchTopDonors: Lỗi khi gọi API:", {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
        url: error.config?.url,
      });
      const errorMessage = error.response?.data?.message || "Không thể tải danh sách top nhà hảo tâm";
      setError(errorMessage);
      console.log("fetchTopDonors: Đã set error:", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      console.log("fetchTopDonors: Hoàn tất yêu cầu, loading:", false);
    }
  }, []);

  // Fetch Donation Histories
  const fetchDonationHistories = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("fetchDonationHistories: Đang lấy tất cả lịch sử hiến máu từ /swp391/donations/histories");
      const source = axios.CancelToken.source();
      const response = await donationService.getAllDonationHistories({
        cancelToken: source.token,
      });
      console.log("fetchDonationHistories: API response:", JSON.stringify(response.data, null, 2));
      const mappedHistories = response.data.result.map(mapDonationHistory);
      setDonationHistories(mappedHistories);
      setError(null);
      return { success: true, histories: mappedHistories };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("fetchDonationHistories: Hủy lấy lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("fetchDonationHistories: Lỗi lấy lịch sử hiến máu:", error.response?.status, error.message);
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
      console.log(`fetchDonationHistoriesByMemberId: Đang lấy lịch sử hiến máu của member ${memberId} từ /swp391/donations/histories/member/${memberId}`);
      const source = axios.CancelToken.source();
      const response = await donationService.getDonationHistoriesByMemberId(memberId, {
        cancelToken: source.token,
      });
      console.log("fetchDonationHistoriesByMemberId: API response:", JSON.stringify(response.data, null, 2));
      const mappedHistories = response.data.result.map(mapDonationHistory);
      setDonationHistories(mappedHistories);
      setError(null);
      return { success: true, histories: mappedHistories };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("fetchDonationHistoriesByMemberId: Hủy lấy lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("fetchDonationHistoriesByMemberId: Lỗi lấy lịch sử hiến máu:", error.response?.status, error.message);
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
      console.log(`getDonationHistoryById: Đang lấy lịch sử hiến máu ${id} từ /swp391/donations/histories/${id}`);
      const source = axios.CancelToken.source();
      const response = await donationService.getDonationHistoryById(id, {
        cancelToken: source.token,
      });
      console.log("getDonationHistoryById: API response:", JSON.stringify(response.data, null, 2));
      const mappedHistory = mapDonationHistory(response.data.result);
      setError(null);
      return { success: true, history: mappedHistory };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("getDonationHistoryById: Hủy lấy lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("getDonationHistoryById: Lỗi lấy lịch sử hiến máu:", error.response?.status, error.message);
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
      console.log("createDonationHistory: Đang tạo lịch sử hiến máu tại /swp391/donations/histories");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = {
        result: historyData.result,
        location: historyData.location,
        volume: historyData.volume,
        bloodTypeId: historyData.bloodTypeId,
        bloodDonationFormId: historyData.bloodDonationFormId,
        memberId: historyData.memberId,
        staffId: historyData.staffId,
        eventId: historyData.eventId,
      };
      console.log("createDonationHistory: Payload gửi backend:", JSON.stringify(payload, null, 2));
      const source = axios.CancelToken.source();
      const response = await donationService.createDonationHistory(payload, {
        cancelToken: source.token,
      });
      console.log("createDonationHistory: API response:", JSON.stringify(response.data, null, 2));
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
        console.log("createDonationHistory: Hủy tạo lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("createDonationHistory: Lỗi tạo lịch sử hiến máu:", error.response?.status, error.message);
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
      console.log(`updateDonationHistory: Đang cập nhật lịch sử hiến máu ${id} tại /swp391/donations/histories/${id}`);
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
      console.log("updateDonationHistory: API response:", JSON.stringify(response.data, null, 2));
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
        console.log("updateDonationHistory: Hủy cập nhật lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("updateDonationHistory: Lỗi cập nhật lịch sử hiến máu:", error.response?.status, error.message);
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
      console.log(`deleteDonationHistory: Đang xóa lịch sử hiến máu ${id} tại /swp391/donations/histories/${id}`);
      const source = axios.CancelToken.source();
      await donationService.deleteDonationHistory(id, {
        cancelToken: source.token,
      });
      console.log("deleteDonationHistory: Xóa lịch sử hiến máu thành công");
      setDonationHistories((prev) => prev.filter((history) => history.id !== id));
      setError(null);
      return { success: true, message: "Xóa lịch sử hiến máu thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("deleteDonationHistory: Hủy xóa lịch sử hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("deleteDonationHistory: Lỗi xóa lịch sử hiến máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa lịch sử hiến máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createDonationRegistration = async (registrationData) => {
    try {
      setLoading(true);
      console.log("createDonationRegistration: Đang tạo đăng ký hiến máu tại /swp391/donations/registrations");
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
      console.log("createDonationRegistration: API response:", JSON.stringify(response.data, null, 2));
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
        console.log("createDonationRegistration: Hủy tạo đăng ký hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("createDonationRegistration: Lỗi tạo đăng ký hiến máu:", error.response?.status, error.message);
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
      console.log(`updateDonationRegistration: Đang cập nhật đăng ký hiến máu ${id} tại /swp391/donations/registrations/${id}`);
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
      console.log("updateDonationRegistration: API response:", JSON.stringify(response.data, null, 2));
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
        console.log("updateDonationRegistration: Hủy cập nhật đăng ký hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("updateDonationRegistration: Lỗi cập nhật đăng ký hiến máu:", error.response?.status, error.message);
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
      console.log(`deleteDonationRegistration: Đang xóa đăng ký hiến máu ${id} tại /swp391/donations/registrations/${id}`);
      const source = axios.CancelToken.source();
      await donationService.deleteDonationRegistration(id, {
        cancelToken: source.token,
      });
      console.log("deleteDonationRegistration: Xóa đăng ký hiến máu thành công");
      setDonationRegistrations((prev) => prev.filter((reg) => reg.id !== id));
      setError(null);
      return { success: true, message: "Xóa đăng ký hiến máu thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("deleteDonationRegistration: Hủy xóa đăng ký hiến máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("deleteDonationRegistration: Lỗi xóa đăng ký hiến máu:", error.response?.status, error.message);
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
      console.log(`getFormsByMember: Đang lấy danh sách đăng ký của member ${memberId} từ /swp391/forms/member/${memberId}`);
      const source = axios.CancelToken.source();
      const response = await donationService.getDonationRegistrationsByMember(memberId, {
        cancelToken: source.token,
      });
      console.log("getFormsByMember: API response:", JSON.stringify(response.data, null, 2));
      setForms(response.data.result || []);
      setError(null);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("getFormsByMember: Hủy lấy danh sách đăng ký:", error.message);
        return { success: false, error: error.message };
      }
      console.error("getFormsByMember: Lỗi lấy danh sách đăng ký:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải danh sách đăng ký";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisOffline = useCallback(async () => {
    if (isFetchingRef.current) {
      console.log("fetchRegisOffline: Đang tải, bỏ qua yêu cầu mới");
      return { success: false, error: "Đang tải dữ liệu..." };
    }
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("fetchRegisOffline: Đang lấy tất cả đăng ký offline từ /swp391/donations/offline");
      const response = await donationService.getAllRegisOffline();
      console.log("fetchRegisOffline: API response:", JSON.stringify(response.data, null, 2));
      const data = response?.data?.result || [];
      const mapped = data.map((item) => ({
        ...mapRegisOffline(item),
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("vi-VN")
          : "",
        status: item.status?.toUpperCase() || "CHƯA RÕ",
      }));
      setRegisOffline(mapped);
      console.log("fetchRegisOffline: Đã set regisOffline:", JSON.stringify(mapped, null, 2));
      setError(null);
      return { success: true, data: mapped };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("fetchRegisOffline: Hủy lấy đăng ký offline:", error.message);
        return { success: false, error: error.message };
      }
      console.error("fetchRegisOffline: Lỗi khi tải danh sách regisOffline:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải danh sách đơn đăng ký";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      console.log("fetchRegisOffline: Hoàn tất yêu cầu, loading:", false);
    }
  }, []);

  const getRegisOfflineById = async (id) => {
    if (!id) return { success: false, error: "ID không hợp lệ" };
    try {
      setLoading(true);
      console.log(`getRegisOfflineById: Đang lấy đơn đăng ký offline với ID: ${id}`);
      const response = await donationService.getRegisOfflineById(id);
      console.log("getRegisOfflineById: API response:", JSON.stringify(response.data, null, 2));
      if (!response?.data?.result) {
        throw new Error("Không tìm thấy dữ liệu đơn đăng ký");
      }
      const mappedOffline = mapRegisOffline(response.data.result);
      setError(null);
      return { success: true, offline: mappedOffline };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("getRegisOfflineById: Hủy lấy đăng ký offline:", error.message);
        return { success: false, error: error.message };
      }
      console.error("getRegisOfflineById: Lỗi khi lấy đơn đăng ký offline:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || error.message || "Không thể tải đơn đăng ký offline";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createRegisOffline = async (offlineData) => {
    try {
      setLoading(true);
      console.log("createRegisOffline: Đang tạo đăng ký offline tại /swp391/donations/offline");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
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
        staffId: user.id,
        location: offlineData.location,
        weight: offlineData.weight || null,
        height: offlineData.height || null,
        bloodPressure: offlineData.bloodPressure || "",
      };
      console.log("createRegisOffline: Payload gửi backend:", JSON.stringify(payload, null, 2));
      const response = await donationService.createRegisOffline(payload);
      console.log("createRegisOffline: API response:", JSON.stringify(response.data, null, 2));
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
        console.log("createRegisOffline: Hủy tạo đăng ký offline:", error.message);
        return { success: false, error: error.message };
      }
      console.error("createRegisOffline: Lỗi tạo đăng ký offline:", error.response?.status, error.message);
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
      console.log(`updateRegisOffline: Đang cập nhật đăng ký offline ${id} tại /swp391/donations/offline/${id}`);
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = {
        id: id,
        bloodType: offlineData.bloodType,
        volumeMl: Number(offlineData.volumeMl),
        result: offlineData.result,
        note: offlineData.note || "",
        staffId: Number(user.id),
        status: "COMPLETED",
      };
      console.log("updateRegisOffline: Payload gửi backend:", JSON.stringify(payload, null, 2));
      const response = await donationService.updateRegisOffline(id, payload);
      console.log("updateRegisOffline: API response:", JSON.stringify(response.data, null, 2));
      const updatedOffline = mapRegisOffline(response.data.result);
      setRegisOffline((prev) =>
        prev.map((offline) => (offline.id === id ? updatedOffline : offline))
      );
      setError(null);
      return {
        success: true,
        data: updatedOffline,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("updateRegisOffline: Hủy cập nhật đăng ký offline:", error.message);
        return { success: false, error: error.message };
      }
      console.error("updateRegisOffline: Lỗi cập nhật đăng ký offline:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Cập nhật thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteRegisOffline = async (id) => {
    try {
      setLoading(true);
      console.log(`deleteRegisOffline: Đang xóa đăng ký offline ${id} tại /swp391/donations/offline/${id}`);
      const source = axios.CancelToken.source();
      await donationService.deleteRegisOffline(id, {
        cancelToken: source.token,
      });
      console.log("deleteRegisOffline: Xóa đăng ký offline thành công");
      setRegisOffline((prev) => prev.filter((offline) => offline.id !== id));
      setError(null);
      return { success: false, message: "Xóa đăng ký offline thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("deleteRegisOffline: Hủy xóa đăng ký offline:", error.message);
        return { success: false, error: error.message };
      }
      console.error("deleteRegisOffline: Lỗi xóa đăng ký offline:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa đăng ký offline thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisReceive = useCallback(async () => {
    if (isFetchingRef.current) {
      console.log("fetchRegisReceive: Đang tải, bỏ qua yêu cầu mới");
      return { success: false, error: "Đang tải dữ liệu" };
    }
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("fetchRegisReceive: Đang lấy tất cả đăng ký nhận máu từ /swp391/donations/receive");
      const source = axios.CancelToken.source();
      const response = await donationService.getAllForms({
        cancelToken: source.token,
      });
      console.log("fetchRegisReceive: API response:", JSON.stringify(response.data, null, 2));
      const mappedReceive = response.data.result.map(mapRegisReceive);
      setRegisReceive(mappedReceive);
      setError(null);
      return { success: true, receive: mappedReceive };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("fetchRegisReceive: Hủy lấy đăng ký nhận máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("fetchRegisReceive: Lỗi lấy đăng ký nhận máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải đăng ký nhận máu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      console.log("fetchRegisReceive: Hoàn tất yêu cầu, loading:", false);
    }
  }, []);

  const getRegisReceiveById = async (id) => {
    try {
      setLoading(true);
      console.log(`getRegisReceiveById: Đang lấy đăng ký nhận máu ${id} từ /swp391/donations/receive/${id}`);
      const source = axios.CancelToken.source();
      const response = await donationService.getRegisReceiveById(id, {
        cancelToken: source.token,
      });
      console.log("getRegisReceiveById: API response:", JSON.stringify(response.data, null, 2));
      const mappedReceive = mapRegisReceive(response.data.result);
      setError(null);
      return { success: true, receive: mappedReceive };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("getRegisReceiveById: Hủy lấy đăng ký nhận máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("getRegisReceiveById: Lỗi lấy đăng ký nhận máu:", error.response?.status, error.message);
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
      console.log("createRegisReceiveFromRegistration: Đang tạo đăng ký nhận máu tại /swp391/donations/receive-from-registration");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = {
        donateDate: receiveData.donateDate,
        location: receiveData.location,
        status: receiveData.status,
        component: receiveData.component,
      };
      console.log("createRegisReceiveFromRegistration: Payload gửi backend:", JSON.stringify(payload, null, 2));
      const source = axios.CancelToken.source();
      const response = await donationService.createRegisReceiveFromRegistration(payload, {
        cancelToken: source.token,
      });
      console.log("createRegisReceiveFromRegistration: API response:", JSON.stringify(response.data, null, 2));
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
        console.log("createRegisReceiveFromRegistration: Hủy tạo đăng ký nhận máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("createRegisReceiveFromRegistration: Lỗi tạo đăng ký nhận máu:", error.response?.status, error.message);
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
      console.log(`updateRegisReceiveFromRegistration: Đang cập nhật đăng ký nhận máu ${id} tại /swp391/donations/receive/${id}`);
      const payload = {
        donateDate: receiveData.donateDate,
        location: receiveData.location,
        status: receiveData.status,
        component: receiveData.component,
      };
      console.log("updateRegisReceiveFromRegistration: Payload gửi backend:", JSON.stringify(payload, null, 2));
      const source = axios.CancelToken.source();
      const response = await donationService.updateRegisReceiveFromRegistration(id, payload, {
        cancelToken: source.token,
      });
      console.log("updateRegisReceiveFromRegistration: API response:", JSON.stringify(response.data, null, 2));
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
        console.log("updateRegisReceiveFromRegistration: Hủy cập nhật đăng ký nhận máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("updateRegisReceiveFromRegistration: Lỗi cập nhật đăng ký nhận máu:", error.response?.status, error.message);
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
      console.log(`deleteRegisReceive: Đang xóa đăng ký nhận máu ${id} tại /swp391/donations/receive/${id}`);
      const source = axios.CancelToken.source();
      await donationService.deleteRegisReceive(id, {
        cancelToken: source.token,
      });
      console.log("deleteRegisReceive: Xóa đăng ký nhận máu thành công");
      setRegisReceive((prev) => prev.filter((receive) => receive.id !== id));
      setError(null);
      return { success: true, message: "Xóa đăng ký nhận máu thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("deleteRegisReceive: Hủy xóa đăng ký nhận máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("deleteRegisReceive: Lỗi xóa đăng ký nhận máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa đăng ký nhận máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(
      "DonationContext useEffect: authLoading:",
      authLoading,
      "user:",
      JSON.stringify(user, null, 2)
    );
    console.log("DonationContext useEffect: Gọi fetchTopDonors");
    fetchTopDonors(5);
    if (!authLoading && user && user.id) {
      console.log(
        "DonationContext useEffect: Bắt đầu gọi APIs, user.id:",
        user.id
      );
      console.log(
        "DonationContext useEffect: Gọi fetchDonationHistoriesByMemberId"
      );
      fetchDonationHistoriesByMemberId(user.id);
      console.log("DonationContext useEffect: Gọi fetchTotalVolumeByMemberId");
      fetchTotalVolumeByMemberId(user.id); // Fetch total volume for the logged-in user
      console.log("DonationContext useEffect: Gọi fetchRegisOffline");
      fetchRegisOffline();
      console.log("DonationContext useEffect: Gọi fetchRegisReceive");
      fetchRegisReceive();
    } else {
      console.log(
        "DonationContext useEffect: Chỉ gọi fetchTopDonors vì authLoading:",
        authLoading,
        "user:",
        user
      );
    }
  }, [
    authLoading,
    user,
    fetchDonationHistories,
    fetchDonationHistoriesByMemberId,
    fetchRegisOffline,
    fetchRegisReceive,
    fetchTopDonors,
    fetchTotalVolumeByMemberId, // Add to dependencies
  ]);

  const value = {
    donationHistories,
    donationRegistrations,
    regisOffline,
    regisReceive,
    loading,
    error,
    forms,
    totalVolume, // Expose totalVolume in context
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
    topDonors,
    fetchTopDonors,
    fetchTotalVolumeByMemberId, // Expose fetch method in context
  };

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
};

export default DonationProvider;