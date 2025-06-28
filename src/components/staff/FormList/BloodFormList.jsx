import React from "react";
import { useNavigate } from "react-router-dom";
import { donationService } from "../../../services/donationService";

const BloodFormList = ({ forms, setForms }) => {
    const navigate = useNavigate();

    if (!forms || forms.length === 0) {
        return <p className="text-gray-500">Chưa có đơn đăng ký nào.</p>;
    }

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await donationService.updateDonationRegistration(id, { status: newStatus });
            setForms((prev) =>
                prev.map((form) =>
                    form.id === id ? { ...form, status: newStatus } : form
                )
            );
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
        }
    };

    const handleViewResultForm = (formId) => {
        navigate(`/result-form/${formId}`);
    };

    return (
        <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead>
                <tr>
                    <th className="px-4 py-2">Họ tên</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">SĐT</th>
                    <th className="px-4 py-2">Nhóm máu</th>
                    <th className="px-4 py-2">Ngày đăng ký</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Hành động</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {forms.map((form) => (
                    <tr key={form.id}>
                        <td className="px-4 py-2">{form.fullName}</td>
                        <td className="px-4 py-2">{form.email}</td>
                        <td className="px-4 py-2">{form.phone}</td>
                        <td className="px-4 py-2 text-red-500 font-medium">{form.bloodGroup}</td>
                        <td className="px-4 py-2">
                            {new Date(form.registerDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-2">
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    form.status === "Đã duyệt"
                                        ? "bg-green-100 text-green-700"
                                        : form.status === "Từ chối"
                                        ? "bg-red-100 text-red-700"
                                        : form.status === "Hoàn thành"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {form.status || "Chờ duyệt"}
                            </span>
                        </td>
                        <td className="px-4 py-2 space-x-2">
                            {form.status === "Hoàn thành" ? (
                                <button
                                    onClick={() => handleViewResultForm(form.id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                >
                                    Kết quả
                                </button>
                            ) : form.status === "Đã duyệt" ? (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus(form.id, "Hoàn thành")}
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                                    >
                                        Hoàn thành
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus(form.id, "Đã duyệt")}
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                    >
                                        Duyệt
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(form.id, "Từ chối")}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Từ chối
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BloodFormList;
