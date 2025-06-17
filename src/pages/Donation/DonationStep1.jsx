import React from 'react';

export default function DonationStep1({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Bước 1: Thông tin đặt hiến máu</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Chọn ngày hiến máu:</label>
        <input
          type="date"
          name="donation_date"
          value={formData.donation_date || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Địa điểm hiến máu:</label>
        <select
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Chọn địa điểm --</option>
          <option value="466">466 Nguyễn Thị Minh Khai</option>
          <option value="benhvien-a">Bệnh viện A</option>
          <option value="benhvien-b">Bệnh viện B</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Nhóm máu:</label>
        <div className="flex gap-4">
          {["A", "B", "AB", "O"].map(type => (
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
    </div>
  );
} 

