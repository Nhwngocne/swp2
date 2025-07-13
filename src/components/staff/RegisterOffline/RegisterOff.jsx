import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { donationService } from "../../../services/donationService";

const RegisterOff = () => {
  const [regisOfflineList, setRegisOfflineList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);
  const navigate = useNavigate();

  const fetchRegisOffline = useCallback(async () => {
    if (isFetchingRef.current) return { success: false, error: "Đang tải dữ liệu..." };
    isFetchingRef.current = true;

    try {
      setLoading(true);
      const response = await donationService.getAllRegisOffline();
      console.log("DATA TỪ SERVER:", response?.data?.result);
      const data = response?.data?.result || [];

      const mapped = data.map(item => {
        console.log("Ngày tạo thô:", item.createdAt); // log kiểm tra

        return {
          ...item,
          createdAt: dayjs(item.createdAt, "DD-MM-YYYY", true).isValid()
            ? dayjs(item.createdAt, "DD-MM-YYYY").format("DD/MM/YYYY")
            : "Không rõ",
        };
      });

      setRegisOfflineList(mapped);
      setError(null);
      return { success: true, data: mapped };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Không thể tải danh sách đơn đăng ký";
      setError(errorMsg);
      console.error("Lỗi khi tải regisOffline:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const deleteRegisOffline = async (id) => {
    try {

      console.log("ID cần xóa:", id);
      await donationService.deleteRegisOffline(id);

      setRegisOfflineList((prev) => prev.filter((offline) => offline.id !== id));
      setError(null);
      alert("Xóa đăng ký offline thành công");
    } catch (error) {
      if (require("axios").isCancel(error)) {
        console.log("Hủy xóa đăng ký offline:", error.message);
        return;
      }
      const errorMessage = error.response?.data?.message || "Xóa đăng ký offline thất bại";
      setError(errorMessage);
      console.error("Lỗi xóa đăng ký offline:", error.response?.status, error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisOffline();
  }, [fetchRegisOffline]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Danh sách đăng ký hiến máu offline</h2>
        <button
          onClick={() => navigate("/createOff")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Thêm đơn
        </button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">Lỗi: {error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Họ tên</th>
              <th className="border px-4 py-2">Địa điểm</th>
              <th className="border px-4 py-2">Ngày tạo</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {regisOfflineList.length > 0 ? (
              regisOfflineList.map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{item.id}</td>
                  <td className="border px-4 py-2">{item.name || "N/A"}</td>
                  <td className="border px-4 py-2">{item.location || "N/A"}</td>
                  <td className="border px-4 py-2">{item.createdAt}</td>
                  <td className="border px-4 py-2">{item.status}</td>
                  <td className="border px-4 py-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => navigate(`/offlineDetail/${item.id}`)}

                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => navigate(`/resultOff/${item.id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Nhập kết quả
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Bạn có chắc muốn xóa đơn đăng ký này?")) {
                          deleteRegisOffline(item.id);
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Không có đơn đăng ký nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RegisterOff;
