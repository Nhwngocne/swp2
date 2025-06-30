 import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaCalendarAlt,
  FaHeartbeat,
  FaTint,
  FaUserTie,
  FaNewspaper,
  FaBell,
} from "react-icons/fa";
import { authService } from "../../services/authService";
import { eventService } from "../../services/eventService";
import { emergencyService } from "../../services/emergencyService";
import { bloodService } from "../../services/bloodService";
import { notificationService } from "../../services/notificationsService";
import "../../assets/css/components/admin/AdminDashboard.css";

export default function AdminDashboard() {
  const [filterType, setFilterType] = useState("date");
  const [filterValue, setFilterValue] = useState("");

  const [totalMembers, setTotalMembers] = useState(0);
  const [totalForms, setTotalForms] = useState(0);
  const [totalEmergencies, setTotalEmergencies] = useState(0);
  const [readyDonors, setReadyDonors] = useState(0);
  const [totalStaffs, setTotalStaffs] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  const [bloodInventoryData, setBloodInventoryData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const membersRes = await authService.getAllUsers();
      const members = membersRes?.data?.result || [];
      setTotalMembers(members.length);
      setReadyDonors(members.filter((m) => m.readyToDonate).length);

      const staffsRes = await authService.getAllStaff();
      setTotalStaffs(staffsRes?.data?.result.length || 0);

      const formsRes = await eventService.getAllBloodDonationForms();
      setTotalForms(formsRes?.data?.result.length || 0);

      const emergencyRes = await emergencyService.getAllEmergencyRequests();
      setTotalEmergencies(emergencyRes?.data?.result.length || 0);

      const notiRes = await notificationService.getAllNotifications();
      setTotalNotifications(notiRes?.data?.result.length || 0);

      const eventsRes = await eventService.getEvents();
      setTotalEvents(eventsRes?.data?.result.length || 0);

      // Blogs
      const blogsRes = await eventService.getBlogs();
      let blogs = blogsRes?.data?.result || [];

      if (filterValue) {
        blogs = blogs.filter((blog) => {
          const createdAt = new Date(blog.createdAt);
          console.log("Blog:", blog.createdAt, "Parsed:", createdAt);

          if (filterType === "date") {
            const dateStr = createdAt.toISOString().slice(0, 10);
            console.log("Check DATE:", dateStr, filterValue);
            return dateStr === filterValue;
          } else if (filterType === "month") {
            const monthStr = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
            console.log("Check MONTH:", monthStr, filterValue);
            return monthStr === filterValue;
          } else if (filterType === "year") {
            const yearStr = createdAt.getFullYear().toString();
            console.log("Check YEAR:", yearStr, filterValue);
            return yearStr === filterValue;
          }
          return true;
        });
      }
      setTotalBlogs(blogs.length);

      const bloodRes = await bloodService.getAllBloodInventories();
      const inventories = bloodRes?.data?.result || [];
      const groups = ["A", "B", "AB", "O"];
      const groupedData = groups.map((g) => ({
        type: g,
        units: inventories
          .filter((item) => item.component === g)
          .reduce((sum, curr) => sum + (curr.quantity || 0), 0),
      }));
      setBloodInventoryData(groupedData);
      setPieData(
        groupedData.map((item) => ({
          name: item.type,
          value: item.units,
        }))
      );
    } catch (err) {
      console.error("Lỗi khi load dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterType, filterValue]);

  const cards = [
    {
      label: "Người dùng",
      value: totalMembers,
      icon: <FaUsers />,
      color: "#3b82f6",
    },
    {
      label: "ĐK Event",
      value: totalForms,
      icon: <FaCalendarAlt />,
      color: "#10b981",
    },
    {
      label: "Sự kiện",
      value: totalEvents,
      icon: <FaCalendarAlt />,
      color: "#7c3aed",
    },
    {
      label: "Máu khẩn",
      value: totalEmergencies,
      icon: <FaHeartbeat />,
      color: "#f59e0b",
    },
    {
      label: "Sẵn sàng",
      value: readyDonors,
      icon: <FaTint />,
      color: "#ef4444",
    },
    {
      label: "Nhân viên",
      value: totalStaffs,
      icon: <FaUserTie />,
      color: "#14b8a6",
    },
    {
      label: "Tin tức",
      value: totalBlogs,
      icon: <FaNewspaper />,
      color: "#ec4899",
    },
    {
      label: "Thông báo",
      value: totalNotifications,
      icon: <FaBell />,
      color: "#8b5cf6",
    },
  ];

  const pieColors = ["#ef4444", "#f97316", "#eab308", "#10b981"];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Tổng Quan</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Lọc theo:{" "}
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue("");
            }}
          >
            <option value="date">Ngày</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
        </label>
        <input
          type={filterType === "year" ? "number" : filterType}
          placeholder={filterType === "year" ? "YYYY" : ""}
          min={filterType === "year" ? 1900 : undefined}
          max={filterType === "year" ? 2100 : undefined}
          style={{ marginLeft: "1rem" }}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>

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
                <AreaChart
                  data={[
                    { i: 0, v: 1 },
                    { i: 1, v: 2 },
                    { i: 2, v: 3 },
                    { i: 3, v: 2.5 },
                    { i: 4, v: 3.5 },
                    { i: 5, v: 4 },
                    { i: 6, v: 3.8 },
                  ]}
                >
                  <defs>
                    <linearGradient
                      id={`grad-${idx}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={card.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={card.color}
                        stopOpacity={0}
                      />
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
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
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
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
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
