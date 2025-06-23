import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { bloodService } from "../services/bloodService";
import { useAuth } from "../services/AuthContext";
import axios from "axios";

const BloodContext = createContext();

export const useBlood = () => {
  const context = useContext(BloodContext);
  if (!context) {
    throw new Error("useBlood phải được dùng trong BloodProvider");
  }
  return context;
};

export const BloodProvider = ({ children }) => {
  const { user } = useAuth();
  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodInventories, setBloodInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  // Mapping cho BloodType
  const mapBloodType = (bloodType) => ({
    id: bloodType.id,
    name: bloodType.name || "Không xác định",
    canDonateTo: bloodType.canDonateTo || "",
    canReceiveFrom: bloodType.canReceiveFrom || "",
    adminName: bloodType.adminName || "",
    staffName: bloodType.staffName || "",
    bloodInventoryComponent: bloodType.bloodInventoryComponent || "",
  });

  // Mapping cho BloodInventory
  const mapBloodInventory = (inventory) => ({
    id: inventory.id,
    component: inventory.component || "Không xác định",
    quantity: inventory.quantity || 0,
    lastUpdated: inventory.lastUpdated,
    staffName: inventory.staffName || "",
    adminName: inventory.adminName || "",
  });

  // Fetch all blood types
  const fetchBloodTypes = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy tất cả loại máu từ /swp391/blood/type");
      const source = axios.CancelToken.source();
      const response = await bloodService.getAllBloodTypes({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedBloodTypes = response.data.result.map(mapBloodType);
      setBloodTypes(mappedBloodTypes);
      setError(null);
      return { success: true, bloodTypes: mappedBloodTypes };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy loại máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy loại máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải loại máu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Fetch blood type by ID
  const getBloodTypeById = async (typeId) => {
    try {
      setLoading(true);
      console.log(`Đang lấy loại máu ${typeId} từ /swp391/blood/type/${typeId}`);
      const source = axios.CancelToken.source();
      const response = await bloodService.getBloodTypeById(typeId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedBloodType = mapBloodType(response.data.result);
      setError(null);
      return { success: true, bloodType: mappedBloodType };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy loại máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy loại máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải loại máu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Create blood type
  const createBloodType = async (bloodTypeData) => {
    try {
      setLoading(true);
      console.log("Đang tạo loại máu tại /swp391/blood/type");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = {
        name: bloodTypeData.name,
        canDonateTo: bloodTypeData.canDonateTo,
        canReceiveFrom: bloodTypeData.canReceiveFrom,
      };
      const source = axios.CancelToken.source();
      const response = await bloodService.createBloodType(payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newBloodType = mapBloodType(response.data.result);
      setBloodTypes((prev) => [...prev, newBloodType]);
      setError(null);
      return {
        success: true,
        message: "Tạo loại máu thành công",
        bloodType: newBloodType,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo loại máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo loại máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Tạo loại máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update blood type
  const updateBloodType = async (typeId, bloodTypeData) => {
    try {
      setLoading(true);
      console.log(`Đang cập nhật loại máu ${typeId} tại /swp391/blood/type/${typeId}`);
      const payload = {
        name: bloodTypeData.name,
        canDonateTo: bloodTypeData.canDonateTo,
        canReceiveFrom: bloodTypeData.canReceiveFrom,
      };
      const source = axios.CancelToken.source();
      const response = await bloodService.updateBloodType(typeId, payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedBloodType = mapBloodType(response.data.result);
      setBloodTypes((prev) =>
        prev.map((type) => (type.id === typeId ? updatedBloodType : type))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật loại máu thành công",
        bloodType: updatedBloodType,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy cập nhật loại máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi cập nhật loại máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Cập nhật loại máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete blood type
  const deleteBloodType = async (typeId) => {
    try {
      setLoading(true);
      console.log(`Đang xóa loại máu ${typeId} tại /swp391/blood/type/${typeId}`);
      const source = axios.CancelToken.source();
      await bloodService.deleteBloodType(typeId, {
        cancelToken: source.token,
      });
      console.log("Xóa loại máu thành công");
      setBloodTypes((prev) => prev.filter((type) => type.id !== typeId));
      setError(null);
      return { success: true, message: "Xóa loại máu thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa loại máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa loại máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa loại máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fetch all blood inventories
  const fetchBloodInventories = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu" };
    isFetchingRef.current = true;
    try {
      setLoading(true);
      console.log("Đang lấy tất cả kho máu từ /swp391/blood/inventory");
      const source = axios.CancelToken.source();
      const response = await bloodService.getAllBloodInventories({
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedInventories = response.data.result.map(mapBloodInventory);
      setBloodInventories(mappedInventories);
      setError(null);
      return { success: true, bloodInventories: mappedInventories };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy kho máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy kho máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải kho máu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Fetch blood inventory by ID
  const getBloodInventoryById = async (inventoryId) => {
    try {
      setLoading(true);
      console.log(`Đang lấy kho máu ${inventoryId} từ /swp391/blood/inventory/${inventoryId}`);
      const source = axios.CancelToken.source();
      const response = await bloodService.getBloodInventoryById(inventoryId, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const mappedInventory = mapBloodInventory(response.data.result);
      setError(null);
      return { success: true, inventory: mappedInventory };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy lấy kho máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi lấy kho máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Không thể tải kho máu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Create blood inventory
  const createBloodInventory = async (inventoryData) => {
    try {
      setLoading(true);
      console.log("Đang tạo kho máu tại /swp391/blood/inventory");
      if (!user || !user.id) throw new Error("Người dùng chưa xác thực hoặc không có ID.");
      const payload = {
        component: inventoryData.component,
        quantity: inventoryData.quantity,
        lastUpdated: inventoryData.lastUpdated,
        adminId: user.id, // Giả định adminId từ user
        staffId: inventoryData.staffId || null, // Tùy chọn
      };
      const source = axios.CancelToken.source();
      const response = await bloodService.createBloodInventory(payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const newInventory = mapBloodInventory(response.data.result);
      setBloodInventories((prev) => [...prev, newInventory]);
      setError(null);
      return {
        success: true,
        message: "Tạo kho máu thành công",
        inventory: newInventory,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy tạo kho máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi tạo kho máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Tạo kho máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update blood inventory
  const updateBloodInventory = async (inventoryId, inventoryData) => {
    try {
      setLoading(true);
      console.log(`Đang cập nhật kho máu ${inventoryId} tại /swp391/blood/inventory/${inventoryId}`);
      const payload = {
        component: inventoryData.component,
        quantity: inventoryData.quantity,
        lastUpdated: inventoryData.lastUpdated,
        adminId: user.id, // Giả định adminId từ user
        staffId: inventoryData.staffId || null, // Tùy chọn
      };
      const source = axios.CancelToken.source();
      const response = await bloodService.updateBloodInventory(inventoryId, payload, {
        cancelToken: source.token,
      });
      console.log("API response:", response.data);
      const updatedInventory = mapBloodInventory(response.data.result);
      setBloodInventories((prev) =>
        prev.map((inv) => (inv.id === inventoryId ? updatedInventory : inv))
      );
      setError(null);
      return {
        success: true,
        message: "Cập nhật kho máu thành công",
        inventory: updatedInventory,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy cập nhật kho máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi cập nhật kho máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Cập nhật kho máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete blood inventory
  const deleteBloodInventory = async (inventoryId) => {
    try {
      setLoading(true);
      console.log(`Đang xóa kho máu ${inventoryId} tại /swp391/blood/inventory/${inventoryId}`);
      const source = axios.CancelToken.source();
      await bloodService.deleteBloodInventory(inventoryId, {
        cancelToken: source.token,
      });
      console.log("Xóa kho máu thành công");
      setBloodInventories((prev) => prev.filter((inv) => inv.id !== inventoryId));
      setError(null);
      return { success: true, message: "Xóa kho máu thành công" };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Hủy xóa kho máu:", error.message);
        return { success: false, error: error.message };
      }
      console.error("Lỗi xóa kho máu:", error.response?.status, error.message);
      const errorMessage = error.response?.data?.message || "Xóa kho máu thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodTypes();
    fetchBloodInventories();
  }, [fetchBloodTypes, fetchBloodInventories]);

  const value = {
    bloodTypes,
    bloodInventories,
    loading,
    error,
    fetchBloodTypes,
    getBloodTypeById,
    createBloodType,
    updateBloodType,
    deleteBloodType,
    fetchBloodInventories,
    getBloodInventoryById,
    createBloodInventory,
    updateBloodInventory,
    deleteBloodInventory,
  };

  return <BloodContext.Provider value={value}>{children}</BloodContext.Provider>;
};