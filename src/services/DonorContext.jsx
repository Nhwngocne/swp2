import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { donorService } from "../services/donorService";
import { useAuth } from "../services/AuthContext";
import axios from "axios";

const DonorContext = createContext();

export const useDonor = () => {
  const context = useContext(DonorContext);
  if (!context) {
    throw new Error("useDonor phải được dùng trong DonorProvider");
  }
  return context;
};

export const DonorProvider = ({ children }) => {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  const mapDonorResponse = (donor) => ({
    id: donor.id,
    name: donor.name,
    address: donor.address,
    latitude: donor.latitude,
    longitude: donor.longitude,
    bloodType: donor.bloodType,
    phone: donor.phone,
    distance: donor.distance,
    routeUrl: donor.routeUrl,
  });

  const searchNearestDonors = useCallback(async (searchData) => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      const source = axios.CancelToken.source();
      const response = await donorService.searchNearestDonors(searchData, {
        cancelToken: source.token,
      });
      const mappedDonors = response.data.result.map(mapDonorResponse);
      setDonors(mappedDonors);
      setError(null);
      return { success: true, donors: mappedDonors };
    } catch (error) {
      if (axios.isCancel(error)) {
        return { success: false, error: error.message };
      }
      const errorMessage = error.response?.data?.message || "Không thể tìm kiếm nhà tài trợ";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const value = {
    donors,
    loading,
    error,
    searchNearestDonors,
  };

  return <DonorContext.Provider value={value}>{children}</DonorContext.Provider>;
};