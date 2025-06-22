import React from 'react';

export default function DonationStep1({ formData, setFormData, onNext }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Chưa chọn ngày';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Bước 1: Thông tin đặt hiến máu</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Ngày hiến máu:</label>
        <input
          type="text"
          value={formatDate(formData.donation_date)}
          disabled
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Địa điểm hiến máu:</label>
        <input
          type="text"
          value={formData.location || 'Chưa chọn địa điểm'}
          disabled
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Nhóm máu:</label>
        <div className="flex gap-4">
          {['A', 'B', 'AB', 'O'].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="blood_type"
                value={type}
                checked={formData.blood_type === type}
                onChange={handleChange}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="bg-blue-500 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
      >
        Tiếp theo
      </button>
    </div>
  );
}