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
  Legend,
  PieChart,
  Pie,
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
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

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
      const fetchedMembers = membersRes?.data?.result || [];
      setMembers(fetchedMembers);
      console.log("Fetched members:", fetchedMembers); // Debug log

      const formsRes = await eventService.getAllBloodDonationForms();
      const fetchedForms = formsRes?.data?.result || [];
      setForms(fetchedForms);
      console.log("Fetched forms:", fetchedForms); // Debug log

      const emergencyRes = await emergencyService.getAllEmergencyRequests();
      const fetchedEmergencies = emergencyRes?.data?.result || [];
      setEmergencies(fetchedEmergencies);
      console.log("Fetched emergencies:", fetchedEmergencies); // Debug log

      const intentRes = await bloodService.getAllBloodIntentForms();
      const fetchedIntents = intentRes?.data?.result || [];
      setIntents(fetchedIntents);
      console.log("Fetched intents:", fetchedIntents); // Debug log

      const bloodRes = await bloodService.getAllBloodInventories();
      const fetchedInventories = bloodRes?.data?.result || [];
      setInventories(fetchedInventories);
      console.log("Fetched inventories:", fetchedInventories); // Debug log
    } catch (err) {
      console.error("❌ Lỗi khi load dashboard:", err);
      // Optionally set an error state to display to the user
      setErrorStats("Không thể tải dữ liệu dashboard");
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
      ? members.filter((m) =>
          isInTimeRange(m.createdAt, filterType, dateRange)
        )
      : members;
    const filteredForms = forms[0]?.createdAt
      ? forms.filter((f) =>
          isInTimeRange(f.createdAt, filterType, dateRange)
        )
      : forms;
    const filteredEmergencies = emergencies[0]?.createdAt
      ? emergencies.filter((e) =>
          isInTimeRange(e.createdAt, filterType, dateRange)
        )
      : emergencies;
    const filteredIntents = intents[0]?.createdAt
      ? intents.filter((i) =>
          isInTimeRange(i.createdAt, filterType, dateRange)
        )
      : intents;
    const filteredInventories = inventories[0]?.lastUpdated
      ? inventories.filter((inv) =>
          isInTimeRangeUpTo(inv.lastUpdated, filterType, dateRange)
        )
      : inventories;

    setTotalMembers(filteredMembers.length);
    setTotalForms(filteredForms.length);
    setTotalEmergencies(filteredEmergencies.length);

    const requestFormsCount = filteredIntents.filter(
      (i) => i.intentType === "CHO"
    ).length;
    const donateFormsCount = filteredIntents.filter(
      (i) => i.intentType === "NHAN"
    ).length;
    setTotalRequestForms(requestFormsCount);
    setTotalDonateForms(donateFormsCount);

    const bloodTypeMap = {
      6: "O-",
      7: "O+",
      8: "A-",
      9: "A+",
      10: "B-",
      11: "B+",
      12: "AB-",
      13: "AB+",
    };
    const typeMap = filteredInventories.reduce((acc, curr) => {
      const typeName =
        bloodTypeMap[curr.bloodTypeId] || `Type-${curr.bloodTypeId}`;
      acc[typeName] = (acc[typeName] || 0) + (curr.quantity || 0);
      return acc;
    }, {});
    const bloodTypeData = Object.entries(typeMap).map(([name, value]) => ({
      name,
      value,
    }));
    setPieData(bloodTypeData);
  }, [
    members,
    forms,
    emergencies,
    intents,
    inventories,
    filterType,
    dateRange,
  ]);

  const cards = [
    {
      label: "Người dùng",
      value: totalMembers,
      icon: <FaUsers />,
      color: "#3b82f6",
    },
        { label: "ĐK Event", value: totalForms, icon: <FaCalendarAlt />, color: "#10b981" },
    
        { label: "Máu khẩn", value: totalEmergencies, icon: <FaHeartbeat />, color: "#f59e0b" },
    
    {
      label: "Đơn nhận máu",
      value: totalRequestForms,
      icon: <FaHandHoldingHeart />,
      color: "#8b5cf6",
    },
    {
      label: "Đơn hiến máu",
      value: totalDonateForms,
      icon: <FaHandHoldingMedical />,
      color: "#ec4899",
    },
  ];

  const pieColors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#10b981",
    "#8b5cf6",
    "#ec4899",
  ];

  const selectedEventData = statistics.find(
    (s) => s.eventId === parseInt(selectedEventId)
  );
  const eventChartData = selectedEventData
    ? [
        {
          name: "Đã đến",
          pass: selectedEventData.passCount,
          fail: selectedEventData.failCount,
        },
        { name: "Đã từ chối", reject: selectedEventData.rejectCount },
        { name: "Chưa checkin", notCheckin: selectedEventData.notCheckinCount },
      ]
    : [];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Tổng Quan</h1>

      <div className="filter-bar">
        <label>Lọc theo:</label>
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setDateRange({ startDate: "", endDate: "" });
          }}
        >
          <option value="day">Khoảng ngày</option>
          <option value="month">Khoảng tháng</option>
          <option value="year">Khoảng năm</option>
        </select>

        {filterType === "day" && (
          <div className="date-range-inputs">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              placeholder="Từ ngày"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              placeholder="Đến ngày"
            />
          </div>
        )}
        {filterType === "month" && (
          <div className="date-range-inputs">
            <input
              type="month"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              placeholder="Từ tháng"
            />
            <input
              type="month"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              placeholder="Đến tháng"
            />
          </div>
        )}
        {filterType === "year" && (
          <div className="date-range-inputs">
            <input
              type="number"
              min="2000"
              max="2100"
              placeholder="Từ năm"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
            <input
              type="number"
              min="2000"
              max="2100"
              placeholder="Đến năm"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </div>
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
          <h2>Kho máu theo nhóm máu</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-events-summary" style={{ marginTop: "40px" }}>
        <h2>Thống kê chi tiết theo sự kiện</h2>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="">-- Chọn sự kiện --</option>
          {statistics.map((stat) => (
            <option key={stat.eventId} value={stat.eventId}>
              {stat.eventName} ({stat.eventDate})
            </option>
          ))}
        </select>

        {selectedEventId && (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ResponsiveContainer width={400} height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Đã đến", value: selectedEventData?.passCount || 0 },
                    { name: "Không đạt", value: selectedEventData?.failCount || 0 },
                    {
                      name: "Từ chối",
                      value: selectedEventData?.rejectCount || 0,
                    },
                    {
                      name: "Chưa checkin",
                      value: selectedEventData?.notCheckinCount || 0,
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  label
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#6366f1" />
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>

            <div
              style={{
                marginTop: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                width: "100%",
                maxWidth: "600px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  background: "#f0fdf4",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <strong style={{ color: "#10b981" }}>Đã đến:</strong>
                <br />
                {selectedEventData?.passCount || 0} người
              </div>
              <div
                style={{
                  background: "#fef2f2",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <strong style={{ color: "#ef4444" }}>Không đạt:</strong>
                <br />
                {selectedEventData?.failCount || 0} người
              </div>
              <div
                style={{
                  background: "#fff7ed",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <strong style={{ color: "#f59e0b" }}>Từ chối:</strong>
                <br />
                {selectedEventData?.rejectCount || 0} người
              </div>
              <div
                style={{
                  background: "#eef2ff",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <strong style={{ color: "#6366f1" }}>Chưa checkin:</strong>
                <br />
                {selectedEventData?.notCheckinCount || 0} người
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function isInTimeRangeUpTo(dateStr, type, dateRange) {
  if (!dateStr) return false;
  const [d, m, y] = dateStr.split("-").map(Number);
  const dataDate = new Date(y, m - 1, d);
  if (!dateRange.startDate && !dateRange.endDate) return true;

  const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
  const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(23, 59, 59, 999);
  dataDate.setHours(12);

  if (type === "day") {
    if (start && dataDate < start) return false;
    if (end && dataDate > end) return false;
    return true;
  }
  if (type === "month") {
    if (start) start.setDate(1);
    if (end) end.setDate(1);
    if (start && dataDate < start) return false;
    if (end && dataDate > end) return false;
    return true;
  }
  if (type === "year") {
    const startYear = start ? start.getFullYear() : null;
    const endYear = end ? end.getFullYear() : null;
    const dataYear = dataDate.getFullYear();
    if (startYear && dataYear < startYear) return false;
    if (endYear && dataYear > endYear) return false;
    return true;
  }
  return true;
}

function isInTimeRange(dateStr, type, dateRange) {
  // If no date range is set, include all records
  if (!dateRange.startDate && !dateRange.endDate) {
    return true;
  }

  if (!dateStr) {
    console.warn("Missing dateStr:", dateStr);
    return false; // Exclude records with missing dates when a range is set
  }

  let dataDate;
  // Handle different date formats
  if (dateStr.includes("-") && dateStr.split("-").length === 3) {
    // Assume format like "27-07-2025" or similar
    const [d, m, y] = dateStr.split("-").map(Number);
    dataDate = new Date(y, m - 1, d);
  } else {
    // Try parsing ISO or other formats
    dataDate = new Date(dateStr);
  }

  if (isNaN(dataDate.getTime())) {
    console.warn("Invalid date:", dateStr);
    return false; // Exclude invalid dates when a range is set
  }

  const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
  const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(23, 59, 59, 999);
  dataDate.setHours(12);

  if (type === "day") {
    if (start && dataDate < start) return false;
    if (end && dataDate > end) return false;
    return true;
  }
  if (type === "month") {
    if (start) start.setDate(1);
    if (end) end.setDate(1);
    if (start && dataDate < start) return false;
    if (end && dataDate > end) return false;
    return true;
  }
  if (type === "year") {
    const startYear = start ? start.getFullYear() : null;
    const endYear = end ? end.getFullYear() : null;
    const dataYear = dataDate.getFullYear();
    if (startYear && dataYear < startYear) return false;
    if (endYear && dataYear > endYear) return false;
    return true;
  }
  return true;
}