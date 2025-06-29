import React, { useEffect, useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { FaUsers, FaCalendarAlt, FaHeartbeat, FaTint } from "react-icons/fa";
import { authService } from "../../services/authService";
import { eventService } from "../../services/eventService";
import { emergencyService } from "../../services/emergencyService";
import { bloodService } from "../../services/bloodService";
import "../../assets/css/components/admin/AdminDashboard.css";


export default function AdminDashboard() {
    const [totalMembers, setTotalMembers] = useState(0);
    const [totalForms, setTotalForms] = useState(0);
    const [totalEmergencies, setTotalEmergencies] = useState(0);
    const [readyDonors, setReadyDonors] = useState(0);
    const [bloodInventoryData, setBloodInventoryData] = useState([]);
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get members
                const membersRes = await authService.getAllUsers();
                const members = membersRes?.data?.result || [];
                setTotalMembers(members.length);

                // count ready donors
                const ready = members.filter(m => m.readyToDonate === true);
                setReadyDonors(ready.length);

                // Get event forms
                const formsRes = await eventService.getAllBloodDonationForms();
                const forms = formsRes?.data?.result || [];
                setTotalForms(forms.length);

                // Get emergencies
                const emergencyRes = await emergencyService.getAllEmergencyRequests();
                const emergencies = emergencyRes?.data?.result || [];
                setTotalEmergencies(emergencies.length);

                // Get blood inventories
                const bloodRes = await bloodService.getAllBloodInventories();
                const inventories = bloodRes?.data?.result || [];

                // transform for bar chart
                const groups = ['A', 'B', 'AB', 'O'];
                const groupedData = groups.map(g => ({
                    type: g,
                    units: inventories
                        .filter(item => item.component === g)
                        .reduce((sum, curr) => sum + (curr.quantity || 0), 0)
                }));
                setBloodInventoryData(groupedData);

                // transform for pie chart
                setPieData(groupedData.map(item => ({
                    name: item.type,
                    value: item.units
                })));

            } catch (err) {
                console.error("Lỗi khi load dashboard:", err);
            }
        };

        fetchDashboardData();
    }, []);

    const cards = [
        {
            label: "Người dùng",
            value: totalMembers,
icon: <FaUsers />,
            color: "#3b82f6"
        },
        {
            label: "ĐK Event",
            value: totalForms,
            icon: <FaCalendarAlt />,
            color: "#10b981"
        },
        {
            label: "Máu khẩn",
            value: totalEmergencies,
            icon: <FaHeartbeat />,
            color: "#f59e0b"
        },
        {
            label: "Sẵn sàng",
            value: readyDonors,
            icon: <FaTint />,
            color: "#ef4444"
        }
    ];

    const pieColors = ["#ef4444", "#f97316", "#eab308", "#10b981"];

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard Tổng Quan</h1>

            <div className="dashboard-cards">
                {cards.map((card, idx) => (
                    <div key={idx} className="dashboard-card">
                        <div className="card-header" style={{ color: card.color }}>
                            <div className="card-icon">{card.icon}</div>
                            <div className="card-value">{card.value}</div>
                        </div>
                        <div className="card-label">{card.label}</div>
                        <div className="card-sparkline">
                            <ResponsiveContainer width="100%" height={40}>
                                <AreaChart data={[
                                    {i:0,v:1},{i:1,v:2},{i:2,v:3},{i:3,v:2.5},{i:4,v:3.5},{i:5,v:4},{i:6,v:3.8}
                                ]}>
                                    <defs>
                                        <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={card.color} stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor={card.color} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="v"
                                        stroke={card.color}
                                        fill={`url(#grad-${idx})`}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-charts">
                <div className="chart-card">
                    <h2>Kho Máu theo nhóm</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={bloodInventoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="type" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="units" radius={[10, 10, 0, 0]}>
                                {bloodInventoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h2>Tỷ lệ nhóm máu</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}