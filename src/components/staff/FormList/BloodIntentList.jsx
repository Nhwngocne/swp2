import React from "react";

const BloodIntentList = ({ intents }) => {
    if (!intents || intents.length === 0) {
        return <p className="text-gray-500">Không có ý định nào được ghi nhận.</p>;
    }

    return (
        <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead>
                <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Họ tên</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Loại ý định</th>
                    <th className="px-4 py-2">Nhóm máu</th>
                    <th className="px-4 py-2">Ngày tạo</th>
                    <th className="px-4 py-2">Ghi chú</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {intents.map((intent) => (
                    <tr key={intent.id}>
                        <td className="px-4 py-2">{intent.id}</td>
                        <td className="px-4 py-2">{intent.fullName || intent.user?.fullName}</td>
                        <td className="px-4 py-2">{intent.email || intent.user?.email}</td>
                        <td className="px-4 py-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                intent.intentType === "HIEN_MAU" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                            }`}>
                                {intent.intentType === "HIEN_MAU" ? "Hiến máu" : "Nhận máu"}
                            </span>
                        </td>
                        <td className="px-4 py-2 text-red-500 font-medium">{intent.bloodGroup}</td>
                        <td className="px-4 py-2">{new Date(intent.createdAt).toLocaleDateString("vi-VN")}</td>
                        <td className="px-4 py-2">{intent.note || "Không có"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BloodIntentList;
