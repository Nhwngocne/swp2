import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  FaHandHoldingHeart,
  FaHandHoldingMedical,
  FaUserTie,
  FaNewspaper,
  FaBell,
} from "react-icons/fa";
import { authService } from "../../services/authService";
import { eventService } from "../../services/eventService";
import { emergencyService } from "../../services/emergencyService";
import { bloodService } from "../../services/BloodService";
import "../../assets/css/components/admin/AdminDashboard.css";
import { useAuth } from "../../services/AuthContext";

export default function AdminDashboard() {
  const [filterType, setFilterType] = useState("month");
  const [selectedDate, setSelectedDate] = useState("");

  const [members, setMembers] = useState([]);
  const [forms, setForms] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [intents, setIntents] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [totalStaffs, setTotalStaffs] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);

  const [totalMembers, setTotalMembers] = useState(0);
  const [totalForms, setTotalForms] = useState(0);
  const [totalEmergencies, setTotalEmergencies] = useState(0);
  const [totalRequestForms, setTotalRequestForms] = useState(0);
  const [totalDonateForms, setTotalDonateForms] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const [bloodInventoryData, setBloodInventoryData] = useState([]);

  const { getAllNotifications } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const membersRes = await authService.getAllUsers();
        setMembers(membersRes?.data?.result || []);

        const formsRes = await eventService.getAllBloodDonationForms();
        setForms(formsRes?.data?.result || []);

        const emergencyRes = await emergencyService.getAllEmergencyRequests();
        setEmergencies(emergencyRes?.data?.result || []);

        const intentRes = await bloodService.getAllBloodIntentForms();
        setIntents(intentRes?.data?.result || []);

        const bloodRes = await bloodService.getAllBloodInventories();
        setInventories(bloodRes?.data?.result || []);

        const staffsRes = await authService.getAllStaff();
        setTotalStaffs(staffsRes?.data?.result.length || 0);

        const blogsRes = await eventService.getBlogs();
        setBlogs(blogsRes?.data?.result || []);

        const notiRes = await getAllNotifications();
        if (notiRes.success) {
          setTotalNotifications(notiRes.notifications.length);
        } else {
          console.error("❌ Lỗi khi lấy thông báo:", notiRes.error);
        }
      } catch (err) {
        console.error("❌ Lỗi khi load dashboard:", err);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const filteredMembers = filterData(members, filterType, selectedDate);
    const filteredForms = filterData(forms, filterType, selectedDate);
    const filteredEmergencies = filterData(emergencies, filterType, selectedDate);
    const filteredIntents = filterData(intents, filterType, selectedDate);

    const filteredInventories = inventories[0]?.lastUpdated
      ? inventories.filter((inv) =>
          isInTimeRangeUpTo(inv.lastUpdated, filterType, selectedDate)
        )
      : inventories;

    const filteredBlogs = filterData(blogs, filterType, selectedDate);

    setTotalMembers(filteredMembers.length);
    setTotalForms(filteredForms.length);
    setTotalEmergencies(filteredEmergencies.length);
    setTotalBlogs(filteredBlogs.length);

    const requestFormsCount = filteredIntents.filter((i) => i.intentType === "CHO").length;
    const donateFormsCount = filteredIntents.filter((i) => i.intentType === "NHAN").length;
    setTotalRequestForms(requestFormsCount);
    setTotalDonateForms(donateFormsCount);

    const bloodTypeMap = {
      6: "O-", 7: "O+", 8: "A-", 9: "A+",
      10: "B-", 11: "B+", 12: "AB-", 13: "AB+"
    };
    const typeMap = filteredInventories.reduce((acc, curr) => {
      const typeName = bloodTypeMap[curr.bloodTypeId] || `Type-${curr.bloodTypeId}`;
      acc[typeName] = (acc[typeName] || 0) + (curr.quantity || 0);
      return acc;
    }, {});
    const bloodTypeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));
    setBloodInventoryData(bloodTypeData);

  }, [members, forms, emergencies, intents, inventories, blogs, filterType, selectedDate]);

  const cards = [
    { label: "Người dùng", value: totalMembers, icon: <FaUsers />, color: "#3b82f6" },
    { label: "ĐK Event", value: totalForms, icon: <FaCalendarAlt />, color: "#10b981" },
    { label: "Máu khẩn", value: totalEmergencies, icon: <FaHeartbeat />, color: "#f59e0b" },
    { label: "Đơn nhận máu", value: totalRequestForms, icon: <FaHandHoldingHeart />, color: "#8b5cf6" },
    { label: "Đơn hiến máu", value: totalDonateForms, icon: <FaHandHoldingMedical />, color: "#ec4899" },
    { label: "Nhân viên", value: totalStaffs, icon: <FaUserTie />, color: "#14b8a6" },
    { label: "Tin tức", value: totalBlogs, icon: <FaNewspaper />, color: "#ec4899" },
    { label: "Thông báo", value: totalNotifications, icon: <FaBell />, color: "#8b5cf6" },
  ];

  const pieColors = ["#ef4444", "#f97316", "#eab308", "#10b981", "#8b5cf6", "#ec4899"];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Tổng Quan</h1>

      <div className="filter-bar">
        <label>Lọc theo:</label>
        <select value={filterType} onChange={(e) => {
          setFilterType(e.target.value);
          setSelectedDate("");
        }}>
          <option value="day">Ngày cụ thể</option>
          <option value="month">Tháng cụ thể</option>
          <option value="year">Năm cụ thể</option>
        </select>

        {filterType === "day" && (
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        )}
        {filterType === "month" && (
          <input type="month" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        )}
        {filterType === "year" && (
          <input type="number" min="2000" max="2100" placeholder="YYYY"
            value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        )}
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
                <AreaChart data={[{ i: 0, v: 1 }, { i: 1, v: 2 }, { i: 2, v: 3 },
                  { i: 3, v: 2.5 }, { i: 4, v: 3.5 }, { i: 5, v: 4 }, { i: 6, v: 3.8 }]}>
                  <defs>
                    <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={card.color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={card.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v"
                    stroke={card.color} fill={`url(#grad-${idx})`}
                    strokeWidth={2} dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h2>Tỷ lệ tồn kho nhóm máu</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bloodInventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {bloodInventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// FILTER helpers
function filterData(data, type, selectedDate) {
  if (!data[0]?.createdAt) return data;
  return data.filter((item) =>
    isInTimeRange(item.createdAt, type, selectedDate)
  );
}

function isInTimeRangeUpTo(dateStr, type, selectedDate) {
  if (!dateStr) return false;
  const [d, m, y] = dateStr.split("-").map(Number);
  const dataDate = new Date(y, m - 1, d);

  if (!selectedDate) return true;

  if (type === "day") {
    const [selYear, selMonth, selDay] = selectedDate.split("-").map(Number);
    const selDate = new Date(selYear, selMonth - 1, selDay);
    return dataDate <= selDate;
  }
  if (type === "month") {
    const [selYear, selMonth] = selectedDate.split("-").map(Number);
    const selDate = new Date(selYear, selMonth, 0);
    return dataDate <= selDate;
  }
  if (type === "year") {
    const selYear = parseInt(selectedDate);
    const selDate = new Date(selYear, 11, 31);
    return dataDate <= selDate;
  }
  return true;
}

function isInTimeRange(dateStr, type, selectedDate) {
  if (!dateStr) return false;
  const [day, month, year] = dateStr.split("-").map(Number);
  if (!selectedDate) return true;

  if (type === "day") {
    const [selYear, selMonth, selDay] = selectedDate.split("-").map(Number);
    return day === selDay && month === selMonth && year === selYear;
  }
  if (type === "month") {
    const [selYear, selMonth] = selectedDate.split("-").map(Number);
    return month === selMonth && year === selYear;
  }
  if (type === "year") {
    return year === parseInt(selectedDate);
  }
  return true;
}
