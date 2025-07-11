import React, { useEffect, useState } from "react";
import BloodInventoryForm from "./BloodInventoryForm";
import { bloodService } from "../../services/BloodService";

const bloodTypeMap = {
  6: "O-",
  7: "O+",
  8: "A-",
  9: "A+",
  10: "B-",
  11: "B+",
  12: "AB-",
  13: "AB+"
};

const BloodInventory = () => {
  const [bloodInventories, setBloodInventories] = useState([]); // raw data từ API
  const [bloodTypeData, setBloodTypeData] = useState([]);       // data cho bảng
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBloodInventories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await bloodService.getAllBloodInventories();
      console.log("Full API response:", response.data);

      // ✅ lấy danh sách inventory thực sự
      const inventories = response.data.result || response.data || [];

      console.log("Raw inventories:", inventories);
      setBloodInventories(inventories);

      // tính tổng quantity theo nhóm máu
      const typeMap = inventories.reduce((acc, curr) => {
        const typeName = bloodTypeMap[curr.bloodTypeId] || `Type-${curr.bloodTypeId}`;
        acc[typeName] = (acc[typeName] || 0) + (curr.quantity || 0);
        return acc;
      }, {});

      const typeDataArray = Object.entries(typeMap).map(([type, quantity]) => ({
        type,
        quantity
      }));

      console.log("Processed bloodTypeData:", typeDataArray);
      setBloodTypeData(typeDataArray);
    } catch (err) {
      console.error("Error fetching blood inventories:", err);
      setError("Không thể tải dữ liệu kho máu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodInventories();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Kho Máu</h2>

      {loading && <p className="text-blue-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && bloodTypeData.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 text-center">
          <thead>
            <tr>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Nhóm máu</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Số lượng (đơn vị)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bloodTypeData.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-lg font-medium text-gray-700">
                  {item.type}
                </td>
                <td className="px-4 py-2 text-lg text-red-500 font-semibold">
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (!loading && !error) && (
        <p className="text-gray-500">Chưa có dữ liệu kho máu.</p>
      )}

      {/* ✅ TRUYỀN raw bloodInventories xuống form */}
      <div className="mt-6">
        <BloodInventoryForm
          bloodInventories={bloodInventories}
          onSuccess={fetchBloodInventories}
        />
      </div>
    </div>
  );
};

export default BloodInventory;
