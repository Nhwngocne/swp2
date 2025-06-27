import React from "react";
import BloodInventoryForm from "./BloodInventoryForm";

const BloodInventory = ({ bloodInventory = [] }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Kho Máu</h2>
            {bloodInventory.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 text-center">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-sm font-medium text-gray-500">Nhóm máu</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-500">Số lượng</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bloodInventory.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2 text-lg font-medium text-gray-700">
                                    {item.component || "Không xác định"}
                                </td>
                                <td className="px-4 py-2 text-lg text-red-500 font-semibold">
                                    {item.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">Chưa có dữ liệu kho máu.</p>
            )}
            <BloodInventoryForm />
        </div>

        
    );
};

export default BloodInventory;
