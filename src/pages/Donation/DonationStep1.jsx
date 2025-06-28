import React from 'react';

export default function DonationStep1({ formData, setFormData, onNext, eventData }) {
  const { bloodTypes, session, donationMorningStart, donationMorningEnd, donationAfternoonStart, donationAfternoonEnd } = eventData;

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
        <label className="block mb-2 font-medium">Nhóm máu cần hiến:</label>
        <input
          type="text"
          value={Array.isArray(bloodTypes) && bloodTypes.length > 0 ? bloodTypes.join(', ') : 'Không xác định'}
          disabled
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Thể tích máu hiến:</label>
        <div className="flex gap-4">
          {['250', '350', '400'].map((volume) => (
            <label key={volume} className="flex items-center gap-2">
              <input
                type="radio"
                name="volumeMl"
                value={volume}
                checked={formData.volumeMl === volume}
                onChange={handleChange}
              />
              {volume} ml
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Khung giờ hiến máu:</label>
        <div className="flex gap-4">
          {session === 'ALL' || session === 'MORNING' ? (
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="session"
                value="MORNING"
                checked={formData.session === 'MORNING'}
                onChange={handleChange}
              />
              {donationMorningStart} - {donationMorningEnd}
            </label>
          ) : null}
          {session === 'ALL' || session === 'AFTERNOON' ? ( 
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="session"
                value="AFTERNOON"
                checked={formData.session === 'AFTERNOON'}
                onChange={handleChange}
              />
              {donationAfternoonStart} - {donationAfternoonEnd}
            </label>
          ) : null}
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