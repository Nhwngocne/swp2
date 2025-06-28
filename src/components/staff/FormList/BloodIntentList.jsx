import React, { useEffect, useState } from "react";
import { bloodIntentService } from "../../../services/bloodIntentService.jsx";

const BloodIntentList = () => {
    const [intents, setIntents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchIntents = async () => {
        try {
            setLoading(true);
            const response = await bloodIntentService.getAllBloodIntents();
            console.log("Fetched intents:", response.data.result);
            setIntents(response.data.result);
            setError(null);
        } catch (err) {
            console.error("Error fetching intents:", err);
            setError(err.response?.data?.message || "Không thể tải danh sách ý định.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntents();
    }, []);

    const handleApprove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn duyệt đơn này không?")) return;
        try {
            await bloodIntentService.approveBloodIntentForm(id);
            alert("Đã duyệt đơn thành công!");
            fetchIntents();
        } catch (err) {
            console.error("Lỗi duyệt đơn:", err);
            alert(err.response?.data?.message || "Duyệt đơn thất bại.");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Bạn có chắc muốn từ chối đơn này không?")) return;
        try {
            await bloodIntentService.rejectBloodIntentForm(id);
            alert("Đã từ chối đơn thành công!");
            fetchIntents();
        } catch (err) {
            console.error("Lỗi từ chối đơn:", err);
            alert(err.response?.data?.message || "Từ chối đơn thất bại.");
        }
    };

    if (loading) {
        return <p className="text-gray-500">Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!intents || intents.length === 0) {
        return <p className="text-gray-500">Không có ý định nào được ghi nhận.</p>;
    }

    return (
        <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead>
                <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Họ tên</th>
                    <th className="px-4 py-2">SĐT</th>
                    <th className="px-4 py-2">Loại ý định</th>
                    <th className="px-4 py-2">Nhóm máu</th>
                    <th className="px-4 py-2">Ngày bắt đầu</th>
                    <th className="px-4 py-2">Ngày kết thúc</th>
                    <th className="px-4 py-2">Địa điểm</th>
                    <th className="px-4 py-2">Mô tả</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Hành động</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {intents.map((intent) => (
                    <tr key={intent.id}>
                        <td className="px-4 py-2">{intent.id}</td>
                        <td className="px-4 py-2">{intent.memberName || "Không có"}</td>
                        <td className="px-4 py-2">{intent.memberPhone || "Không có"}</td>
                        <td className="px-4 py-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                intent.intentType === "CHO" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                            }`}>
                                {intent.intentType === "CHO" ? "Hiến máu" : "Nhận máu"}
                            </span>
                        </td>
                        <td className="px-4 py-2 text-red-500 font-medium">{intent.bloodType}</td>
                        <td className="px-4 py-2">{intent.availableFrom || "N/A"}</td>
                        <td className="px-4 py-2">{intent.availableTo || "N/A"}</td>
                        <td className="px-4 py-2">{intent.location || "Không có"}</td>
                        <td className="px-4 py-2">{intent.description || "Không có"}</td>
                        <td className="px-4 py-2">{intent.status || "PENDING"}</td>
                        <td className="px-4 py-2 space-x-2">
                            <button
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                onClick={() => handleApprove(intent.id)}
                                disabled={intent.status !== "PENDING"}
                            >
                                Duyệt
                            </button>
                            <button
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => handleReject(intent.id)}
                                disabled={intent.status !== "PENDING"}
                            >
                                Từ chối
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BloodIntentList;
