// BloodResultModal.js
import React from "react";

const BloodResultModal = ({ isOpen, onClose, onSubmit, loading, historyData, onInputChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Nhập kết quả hiến máu</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Kết quả</label>
          <select
            name="result"
            value={historyData.result}
            onChange={onInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Đạt">Đạt</option>
            <option value="Không đạt">Không đạt</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
          <input
            type="text"
            name="location"
            value={historyData.location}
            onChange={onInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập địa điểm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Thể tích (ml)</label>
          <input
            type="number"
            name="volume"
            value={historyData.volume}
            onChange={onInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập thể tích (ml)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">ID Nhóm máu</label>
          <select
            name="bloodTypeId"
            value={historyData.bloodTypeId}
            onChange={onInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Nhóm máu --</option>
            <option value="6">O-</option>
            <option value="7">O+</option>
            <option value="8">A-</option>
            <option value="9">A+</option>
            <option value="10">B-</option>
            <option value="11">B+</option>
            <option value="12">AB-</option>
            <option value="13">AB+</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};

export default BloodResultModal;
