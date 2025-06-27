import React from "react";

const BloodFormList = ({ forms }) => {
    if (!forms || forms.length === 0) {
        return <p className="text-gray-500">Chưa có đơn đăng ký nào.</p>;
    }

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
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {forms.map((form) => (
                    <tr key={form.id}>
                        <td className="px-4 py-2">{form.fullName}</td>
                        <td className="px-4 py-2">{form.email}</td>
                        <td className="px-4 py-2">{form.phone}</td>
                        <td className="px-4 py-2 text-red-500 font-medium">{form.bloodGroup}</td>
                        <td className="px-4 py-2">{new Date(form.registerDate).toLocaleDateString("vi-VN")}</td>
                        <td className="px-4 py-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                form.status === "Đã duyệt" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}>
                                {form.status || "Đang chờ"}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BloodFormList;
