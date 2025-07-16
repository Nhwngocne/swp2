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
} from "react-icons/fa";
import { authService } from "../../services/authService";
import { eventService } from "../../services/eventService";
import { emergencyService } from "../../services/emergencyService";
import { bloodService } from "../../services/BloodService";
import "../../assets/css/components/admin/AdminDashboard.css";

export default function AdminDashboard() {
  const [filterType, setFilterType] = useState("month");
  const [selectedDate, setSelectedDate] = useState("");

  const [members, setMembers] = useState([]);
  const [forms, setForms] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [intents, setIntents] = useState([]);
  const [inventories, setInventories] = useState([]);

  const [totalMembers, setTotalMembers] = useState(0);
  const [totalForms, setTotalForms] = useState(0);
  const [totalEmergencies, setTotalEmergencies] = useState(0);
  const [totalRequestForms, setTotalRequestForms] = useState(0);
  const [totalDonateForms, setTotalDonateForms] = useState(0);

  const [pieData, setPieData] = useState([]);

  const [statistics, setStatistics] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState(null);

  const [selectedEventId, setSelectedEventId] = useState("");

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
      } catch (err) {
        console.error("❌ Lỗi khi load dashboard:", err);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoadingStats(true);
      setErrorStats(null);
      try {
        const res = await eventService.getEventStatistics();
        setStatistics(res?.data?.result || res?.data || []);
      } catch (err) {
        console.error("❌ Lỗi load thống kê:", err);
        setErrorStats("Lỗi khi tải thống kê");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    const filteredMembers = members[0]?.createdAt
      ? members.filter((m) => isInTimeRange(m.createdAt, filterType, selectedDate))
      : members;
    const filteredForms = forms[0]?.createdAt
      ? forms.filter((f) => isInTimeRange(f.createdAt, filterType, selectedDate))
      : forms;
    const filteredEmergencies = emergencies[0]?.createdAt
      ? emergencies.filter((e) => isInTimeRange(e.createdAt, filterType, selectedDate))
      : emergencies;
    const filteredIntents = intents[0]?.createdAt
      ? intents.filter((i) => isInTimeRange(i.createdAt, filterType, selectedDate))
      : intents;
    const filteredInventories = inventories[0]?.lastUpdated
      ? inventories.filter((inv) => isInTimeRangeUpTo(inv.lastUpdated, filterType, selectedDate))
      : inventories;

    setTotalMembers(filteredMembers.length);
    setTotalForms(filteredForms.length);
    setTotalEmergencies(filteredEmergencies.length);

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
    setPieData(bloodTypeData);
  }, [members, forms, emergencies, intents, inventories, filterType, selectedDate]);

  const cards = [
    { label: "Người dùng", value: totalMembers, icon: <FaUsers />, color: "#3b82f6" },
    { label: "ĐK Event", value: totalForms, icon: <FaCalendarAlt />, color: "#10b981" },
    { label: "Máu khẩn", value: totalEmergencies, icon: <FaHeartbeat />, color: "#f59e0b" },
    { label: "Đơn nhận máu", value: totalRequestForms, icon: <FaHandHoldingHeart />, color: "#8b5cf6" },
    { label: "Đơn hiến máu", value: totalDonateForms, icon: <FaHandHoldingMedical />, color: "#ec4899" },
  ];

  const pieColors = ["#ef4444", "#f97316", "#eab308", "#10b981", "#8b5cf6", "#ec4899"];

  const selectedEventData = statistics.find(s => s.eventId === parseInt(selectedEventId));
  const eventChartData = selectedEventData
    ? [
        { name: "Đã đến", pass: selectedEventData.passCount, fail: selectedEventData.failCount },
        { name: "Đã từ chối", count: selectedEventData.rejectCount },
        { name: "Chưa checkin", count: selectedEventData.notCheckinCount }
      ]
    : [];

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

      <div className="dashboard-events-summary" style={{ marginTop: "40px" }}>
        <h2>Thống kê chi tiết theo sự kiện</h2>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
          <option value="">-- Chọn sự kiện --</option>
          {statistics.map(stat => (
            <option key={stat.eventId} value={stat.eventId}>
              {stat.eventName} ({stat.eventDate})
            </option>
          ))}
        </select>

        {selectedEventId && (
          <div style={{ marginTop: "20px" }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pass" stackId="a" fill="#10b981" />
                <Bar dataKey="fail" stackId="a" fill="#ef4444" />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function isInTimeRangeUpTo(dateStr, type, selectedDate) {
  if (!dateStr) return false;
  const [d, m, y] = dateStr.split("-").map(Number);
  const dataDate = new Date(y, m - 1, d);
  if (!selectedDate) return true;

  if (type === "day") {
    const [selYear, selMonth, selDay] = selectedDate.split("-").map(Number);
    return dataDate <= new Date(selYear, selMonth - 1, selDay);
  }
  if (type === "month") {
    const [selYear, selMonth] = selectedDate.split("-").map(Number);
    return dataDate <= new Date(selYear, selMonth - 1, 1);
  }
  if (type === "year") {
    const selYear = parseInt(selectedDate);
    return dataDate <= new Date(selYear, 0, 1);
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
