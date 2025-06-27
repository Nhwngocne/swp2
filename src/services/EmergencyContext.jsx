import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { emergencyService } from "../services/emergencyService";
import { useAuth } from "../services/AuthContext";
import axios from "axios";

const EmergencyContext = createContext();

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error("useEmergency phải được dùng trong EmergencyProvider");
  }
  return context;
};

export const EmergencyProvider = ({ children }) => {
  const { user } = useAuth();
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [nearbyDonors, setNearbyDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  // Mapping cho EmergencyResponse
  const mapEmergencyRequest = (emergency) => ({
    id: emergency.id,
    component: emergency.component || "",
    location: emergency.location || "",
    name: emergency.name, // ✅ thêm nếu chưa có
    phone: emergency.phone, // ✅ thêm nếu chưa có
    description: emergency.description,
    status: emergency.status || "PENDING",
    staffName: emergency.staffName || "Không xác định",
    memberName: emergency.memberName || "Không xác định",
    adminName: emergency.adminName || "Không xác định",
    bloodTypeName: emergency.bloodTypeName || "UNKNOWN",
  });

  // Mapping cho NearbyDonorResponse
  const mapNearbyDonor = (donor) => ({
    id: donor.id,
    distanceKm: donor.distanceKm || 0,
    member: {
      id: donor.member?.id || 0,
      fullName: donor.member?.fullName || "Không xác định",
      email: donor.member?.email || "",
      phoneNumber: donor.member?.phoneNumber || "",
      bloodType: donor.member?.bloodType || "UNKNOWN",
    },
    regisReceive: {
      id: donor.regisReceive?.id || 0,
      requestDate: donor.regisReceive?.requestDate || "",
      status: donor.regisReceive?.status || "PENDING",
      urgencyLevel: donor.regisReceive?.urgencyLevel || "NORMAL",
    },
  });

  // ===== Emergency Request =====
  const fetchEmergencyRequests = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy tất cả yêu cầu khẩn cấp từ /swp391/emergencies/emergency");
      const source = axios.CancelToken.source();
      const response = await emergencyService.getAllEmergencyRequests({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedRequests = response.data.result.map(mapEmergencyRequest);
      setEmergencyRequests(mappedRequests);
      setError(null);
      return { success: true, requests: mappedRequests };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy yêu cầu khẩn cấp:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy yêu cầu khẩn cấp:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải yêu cầu khẩn cấp";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const getEmergencyRequestById = async (emergencyId) => {
    try {
      setLoading(true);
      console.log(`Đang lấy yêu cầu khẩn cấp ${emergencyId} từ /swp391/emergencies/emergency/${emergencyId}`);
      const source = axios.CancelToken.source();
      const response = await emergencyService.getEmergencyRequestById(emergencyId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedRequest = mapEmergencyRequest(response.data.result);
      setError(null);
      return { success: true, request: mappedRequest };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy yêu cầu khẩn cấp:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy yêu cầu khẩn cấp:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải yêu cầu khẩn cấp";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createEmergencyRequest = async (requestData) => {
    try {
      setLoading(true);
      console.log("Đang tạo yêu cầu khẩn cấp tại /swp391/emergencies/emergency");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = {
        component: requestData.component,
        name: emergency.name, // ✅ thêm nếu chưa có
        phone: emergency.phone, // ✅ thêm nếu chưa có
        description: emergency.description,
        location: requestData.location,
        status: requestData.status,
      };
      const source = axios.CancelToken.source();
      const response = await emergencyService.createEmergencyRequest(payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newRequest = mapEmergencyRequest(response.data.result);
      setEmergencyRequests((prev) => [...prev, newRequest]);
      setError(null);
      return {
        success: true,
        message: "Tạo yêu cầu khẩn cấp thành công",
        request: newRequest,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo yêu cầu khẩn cấp:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo yêu cầu khẩn cấp:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Tạo yêu cầu khẩn cấp thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateEmergencyRequest = async (emergencyId, requestData) => {
    try {
      setLoading(true);
      console.log(`Đang cập nhật yêu cầu khẩn cấp ${emergencyId} tại /swp391/emergencies/emergency/${emergencyId}`);
      const payload = {
        component: requestData.component,
        name: emergency.name, // ✅ thêm nếu chưa có
        phone: emergency.phone, // ✅ thêm nếu chưa có
        description: emergency.description,
        location: requestData.location,
        status: requestData.status,
      };
      const source = axios.CancelToken.source();
      const response = await emergencyService.updateEmergencyRequest(emergencyId, payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedRequest = mapEmergencyRequest(response.data.result);
      setEmergencyRequests((prev) =>
        prev.map((req) => (req.id === emergencyId ? updatedRequest : req))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật yêu cầu khẩn cấp thành công",
        request: updatedRequest,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy cập nhật yêu cầu khẩn cấp:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi cập nhật yêu cầu khẩn cấp:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Cập nhật yêu cầu khẩn cấp thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteEmergencyRequest = async (emergencyId) => {
    try {
      setLoading(true);
      console.log(`Đang xóa yêu cầu khẩn cấp ${emergencyId} tại /swp391/emergencies/emergency/${emergencyId}`);
      const source = axios.CancelToken.source();
      await emergencyService.deleteEmergencyRequest(emergencyId, {
        cancelToken: source.token,
      });
      console.log("Xóa yêu cầu khẩn cấp thành công");
      setEmergencyRequests((prev) => prev.filter((req) => req.id !== emergencyId));
      setError(null);
      return { success: true, message: "Xóa yêu cầu khẩn cấp thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa yêu cầu khẩn cấp:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa yêu cầu khẩn cấp:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa yêu cầu khẩn cấp thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ===== Nearby Donors =====
  const fetchNearbyDonors = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy tất cả nhà tài trợ gần đó từ /swp391/emergencies/nearbyDonors");
      const source = axios.CancelToken.source();
      const response = await emergencyService.getAllNearbyDonors({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedDonors = response.data.result.map(mapNearbyDonor);
      setNearbyDonors(mappedDonors);
      setError(null);
      return { success: true, donors: mappedDonors };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy nhà tài trợ gần đó:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy nhà tài trợ gần đó:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải nhà tài trợ gần đó";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const getNearbyDonorById = async (nearbyDonorId) => {
    try {
      setLoading(true);
      console.log(`Đang lấy nhà tài trợ gần đó ${nearbyDonorId} từ /swp391/emergencies/nearbyDonors/${nearbyDonorId}`);
      const source = axios.CancelToken.source();
      const response = await emergencyService.getNearbyDonorById(nearbyDonorId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedDonor = mapNearbyDonor(response.data.result);
      setError(null);
      return { success: true, donor: mappedDonor };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy nhà tài trợ gần đó:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy nhà tài trợ gần đó:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải nhà tài trợ gần đó";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyRequests();
    fetchNearbyDonors();
  }, [fetchEmergencyRequests, fetchNearbyDonors]);

  const value = {
    emergencyRequests,
    nearbyDonors,
    loading,
    error,
    fetchEmergencyRequests,
    getEmergencyRequestById,
    createEmergencyRequest,
    updateEmergencyRequest,
    deleteEmergencyRequest,
    fetchNearbyDonors,
    getNearbyDonorById,
  };

  return <EmergencyContext.Provider value={value}>{children}</EmergencyContext.Provider>;
};