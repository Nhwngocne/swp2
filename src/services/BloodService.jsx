// src/services/BloodService.js
import axios from "axios";

const API_BASE = "http://localhost:8080"; // hoặc cấu hình .env

const bloodAPI = axios.create({
  baseURL: `${API_BASE}/blood`,
});

// ===== BLOOD TYPE =====
export const bloodService = {
  // GET: Danh sách tất cả nhóm máu
  getAllBloodTypes: (config = {}) => bloodAPI.get("/type", config),

  // GET: Chi tiết nhóm máu theo ID
  getBloodTypeById: (id, config = {}) => bloodAPI.get(`/type/${id}`, config),

  // POST: Tạo nhóm máu mới
  createBloodType: (data, config = {}) => bloodAPI.post("/type", data, config),

  // PUT: Cập nhật nhóm máu
  updateBloodType: (id, data, config = {}) => bloodAPI.put(`/type/${id}`, data, config),

  // DELETE: Xoá nhóm máu
  deleteBloodType: (id, config = {}) => bloodAPI.delete(`/type/${id}`, config),

  // ===== BLOOD INVENTORY =====
  // GET: Danh sách tất cả kho máu
  getAllBloodInventories: (config = {}) => bloodAPI.get("/inventory", config),

  // GET: Chi tiết kho máu theo ID
  getBloodInventoryById: (id, config = {}) => bloodAPI.get(`/inventory/${id}`, config),

  // POST: Tạo kho máu mới
  createBloodInventory: (data, config = {}) => bloodAPI.post("/inventory", data, config),

  // PUT: Cập nhật kho máu
  updateBloodInventory: (id, data, config = {}) => bloodAPI.put(`/inventory/${id}`, data, config),

  // DELETE: Xoá kho máu
  deleteBloodInventory: (id, config = {}) => bloodAPI.delete(`/inventory/${id}`, config),
};
