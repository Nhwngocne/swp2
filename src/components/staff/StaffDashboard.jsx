import React, { useEffect, useState } from "react";
import { authService } from "../../services/authService";
import { eventService } from "../../services/eventService";
import { bloodService } from "../../services/BloodService";
import { emergencyService } from "../../services/emergencyService"; // ← Thêm dòng này


const StaffDashboard = () => {
    const [totalMembers, setTotalMembers] = useState(0);
    const [totalForms, setTotalForms] = useState(0);
    const [totalEmergencies, setTotalEmergencies] = useState(0);
    const [bloodInventory, setBloodInventory] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const membersRes = await authService.getAllUsers();
                const members = membersRes?.data?.result || [];
                setTotalMembers(members.length);

                const formsRes = await eventService.getAllBloodDonationForms();
                const forms = formsRes?.data?.result || [];
                setTotalForms(forms.length);

                const emergencyRes = await emergencyService.getAllEmergencyRequests();
                const emergencies = emergencyRes?.data?.result || [];
                setTotalEmergencies(emergencies.length);


                const bloodRes = await bloodService.getAllBloodInventories();
                const inventories = bloodRes?.data?.result || [];
                setBloodInventory(inventories);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu Dashboard:", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Trang Quản Trị</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <DashboardCard title="Tổng số thành viên" count={totalMembers} />
                <DashboardCard title="Tổng số đăng ký hiến máu" count={totalForms} />
                <DashboardCard title="Tổng số đơn máu khẩn cấp" count={totalEmergencies} />
            </div>

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
            </div>
        </div>
    );
};

const DashboardCard = ({ title, count }) => (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
        <p className="text-4xl font-bold text-red-500 mt-2">
            {typeof count === "number" ? count : 0}
        </p>
    </div>
);

export default StaffDashboard;
