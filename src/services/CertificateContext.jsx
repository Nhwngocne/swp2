import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { certificateService } from "../services/certificateService";
import { useAuth } from "../services/AuthContext";
import axios from "axios";

const CertificateContext = createContext();

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error("useCertificate phải được dùng trong CertificateProvider");
  }
  return context;
};

export const CertificateProvider = ({ children }) => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  // Mapping cho CertificateResponse
  const mapCertificate = (certificate) => ({
    id: certificate.id,
    issuedDate: certificate.issuedDate,
    issuedBy: certificate.issuedBy || "Không xác định",
    imageUrl: certificate.imageUrl || "",
    donationHistoryId: certificate.donationHistoryId || 0,
  });

  // Fetch certificate by ID
  const getCertificateById = async (id) => {
    try {
      setLoading(true);
      console.log(`Đang lấy chứng chỉ ${id} từ /swp391/api/certificates/${id}`);
      const source = axios.CancelToken.source();
      const response = await certificateService.getCertificateById(id, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedCertificate = mapCertificate(response.data);
      setError(null);
      return { success: true, certificate: mappedCertificate };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy chứng chỉ:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy chứng chỉ:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Không thể tải chứng chỉ";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fetch certificate by donationHistoryId
  const getCertificateByDonationHistoryId = async (donationHistoryId) => {
    try {
      setLoading(true);
      console.log(
        `Đang lấy chứng chỉ theo donationHistory ${donationHistoryId} từ /swp391/api/certificates/by-donation/${donationHistoryId}`
      );
      const source = axios.CancelToken.source();
      const response = await certificateService.getCertificateByDonationHistoryId(
        donationHistoryId,
        { cancelToken: source.token }
      );
      console.log("API response:", response.data);
      const mappedCertificate = mapCertificate(response.data);
      setError(null);
      return { success: true, certificate: mappedCertificate };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy chứng chỉ:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy chứng chỉ:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Không thể tải chứng chỉ";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Upload certificate (STAFF)
  const uploadCertificate = async (certificateData) => {
    try {
      setLoading(true);
      console.log("Đang tải chứng chỉ tại /swp391/api/certificates/upload");
      if (!user || !user.id || !user.roles.includes("STAFF"))
        throw new Error("Người dùng không có quyền STAFF hoặc chưa xác thực.");

      // Tạo FormData để gửi file và các trường khác
      const formData = new FormData();
      formData.append("donationHistoryId", certificateData.donationHistoryId);
      formData.append("issuedBy", certificateData.issuedBy);
      if (certificateData.file) formData.append("file", certificateData.file); // Thêm file nếu có

      const source = axios.CancelToken.source();
      const response = await certificateService.uploadCertificate(formData, {
        cancelToken: source.token,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("API response:", response.data);
      const newCertificate = mapCertificate(response.data);
      setCertificates((prev) => [...prev, newCertificate]);
      setError(null);
      return {
        success: true,
        message: "Tải chứng chỉ thành công",
        certificate: newCertificate,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tải chứng chỉ:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tải chứng chỉ:", error.response?.status, error.message);
      const errorMessage =
        error.response?.data?.message || "Tải chứng chỉ thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  const lookupBloodCompatibility = async (componentId = 0, bloodTypeId = 0) => {
    try {
      setLoading(true);
      const response = await certificateService.lookupBloodCompatibility(componentId, bloodTypeId);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Lỗi tra cứu tương thích máu:", error);
      return { success: false, error: "Không thể tra cứu tương thích máu" };
    } finally {
      setLoading(false);
    }
  };

  // Không tự động fetch tất cả vì chỉ có get by ID hoặc by donationHistoryId

  const value = {
    certificates,
    loading,
    error,
    getCertificateById,
    getCertificateByDonationHistoryId,
    uploadCertificate,
    lookupBloodCompatibility
  };

  return (
    <CertificateContext.Provider value={value}>{children}</CertificateContext.Provider>
  );
};