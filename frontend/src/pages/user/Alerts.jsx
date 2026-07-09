import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaStethoscope,
  FaBaby,
  FaNotesMedical,
  FaLightbulb,
  FaChartLine,
  FaCalendarAlt,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Activity,
  Heart,
  ArrowRight,
  SlidersHorizontal,
  Clock,
} from "lucide-react";
import bgImage from "../../assets/images/bg.png";

function Alerts() {
  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || {};

  const [filter, setFilter] = useState("all");

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    const riskData =
  JSON.parse(
    localStorage.getItem(`riskData_${currentUser.email}`)
  ) || {
    risk: "Low",
    score: 10,
    confidence: 95,
    symptoms: [],
  };

    let generatedAlerts = [];

    if (riskData.risk === "High") {
      generatedAlerts = [
        {
          id: 1,
          type: "Critical",
          riskLevel: "high",
          title: "High Pregnancy Risk Detected",
          message:
            "AI analysis indicates a high pregnancy risk. Please contact your gynecologist immediately.",
          icon: "critical",
          status: "Unread",
          time: "Just Now",
        },
        {
          id: 2,
          type: "Emergency",
          riskLevel: "high",
          title: "Monitor Baby Movement",
          message:
            "Your reported symptoms require continuous fetal movement monitoring.",
          icon: "critical",
          status: "Unread",
          time: "5 mins ago",
        },
      ];
    } else if (riskData.risk === "Medium" || riskData.risk === "Moderate") {
      generatedAlerts = [
        {
          id: 1,
          type: "Warning",
          riskLevel: "medium",
          title: "Monitor Blood Pressure",
          message:
            "Please check your blood pressure regularly and consult your doctor if it remains elevated.",
          icon: "warning",
          status: "Unread",
          time: "Today",
        },
        {
          id: 2,
          type: "Reminder",
          riskLevel: "medium",
          title: "Increase Water Intake",
          message:
            "Drink at least 8–10 glasses of water today to stay hydrated.",
          icon: "warning",
          status: "Unread",
          time: "Today",
        },
      ];
    } else {
      generatedAlerts = [
        {
          id: 1,
          type: "Healthy",
          riskLevel: "low",
          title: "Pregnancy Progress is Normal",
          message:
            "AI prediction shows a low-risk pregnancy. Continue maintaining a healthy lifestyle.",
          icon: "safe",
          status: "Reviewed",
          time: "Today",
        },
        {
          id: 2,
          type: "Reminder",
          riskLevel: "low",
          title: "Regular Check-up",
          message:
            "Continue attending your scheduled prenatal appointments.",
          icon: "safe",
          status: "Unread",
          time: "Tomorrow",
        },
      ];
    }

    setAlerts(generatedAlerts);
  };

  const handleMarkReviewed = (id) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "Reviewed" }
          : item
      )
    );
  };

  const filteredAlerts = alerts.filter((item) => {
    if (filter === "all") return true;
    return item.riskLevel === filter;
  });

  const critical =
    alerts.filter((a) => a.riskLevel === "high").length;

  const warning =
    alerts.filter((a) => a.riskLevel === "medium").length;

  const healthy =
    alerts.filter((a) => a.riskLevel === "low").length;

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center flex"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Floating Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* SIDEBAR */}
      <div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 p-5 flex-shrink-0 h-full flex flex-col">
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
          <p className="text-sm text-gray-500">Maternal Health System</p>
        </Link>

        <div className="mt-8 space-y-2 flex-1 overflow-y-auto">
          <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard" />
          <NavItem label="Monitoring" icon={<FaStethoscope />} to="/monitor" />
          <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" />
          <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" />
          <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" />
          <NavItem label="Prediction" icon={<FaChartLine />} to="/prediction" />
          <NavItem label="Alerts" icon={<Bell />} to="/alerts" active />
          <NavItem label="Appointments" icon={<FaCalendarAlt />} to="/appointment" />
          <NavItem label="Profile" icon={<FaUser />} to="/profile" />
        </div>

        <div className="pt-4 border-t border-pink-100/50">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/login";
            }}
            className="w-full bg-pink-100 text-pink-600 px-5 py-2 rounded-xl hover:bg-pink-200 transition-all duration-300 text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-4 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-pink-300 blur-xl opacity-60 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-pink-500 to-sky-400 p-4 rounded-full shadow-xl">
                <Bell className="text-white w-8 h-8 animate-bounce" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
                Pregnancy Alerts
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome,
                <span className="font-semibold text-pink-500 ml-2">
                  {currentUser.name}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SummaryCard
            title="Critical"
            value={critical}
            color="from-red-400 to-pink-500"
            icon={<ShieldAlert className="w-8 h-8 text-white" />}
          />
          <SummaryCard
            title="Warning"
            value={warning}
            color="from-pink-400 to-rose-400"
            icon={<AlertTriangle className="w-8 h-8 text-white" />}
          />
          <SummaryCard
            title="Healthy"
            value={healthy}
            color="from-sky-400 to-blue-400"
            icon={<Heart className="w-8 h-8 text-white" />}
          />
          <SummaryCard
            title="Reviewed"
            value={
              alerts.filter(
                (item) => item.status === "Reviewed"
              ).length
            }
            color="from-purple-400 to-pink-400"
            icon={<CheckCircle className="w-8 h-8 text-white" />}
          />
        </div>

        {/* Filter */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-6 border border-pink-100">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="text-sky-500" />
              <h2 className="font-bold text-xl">Filter Alerts</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {["all", "high", "medium", "low"].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`px-6 py-2 rounded-xl transition-all duration-300 font-semibold ${
                    filter === level
                      ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"
                      : "bg-pink-50 text-gray-700 hover:bg-pink-100"
                  }`}
                >
                  {level === "all"
                    ? "All Alerts"
                    : `${level.toUpperCase()} Risk`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Cards */}
        <div className="space-y-6 mt-8">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-pink-100 p-6 hover:-translate-y-2 hover:shadow-pink-200 transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex gap-5">
                  <div>
                    {alert.icon === "critical" && (
                      <ShieldAlert className="text-red-500 w-10 h-10 animate-pulse" />
                    )}
                    {alert.icon === "warning" && (
                      <AlertTriangle className="text-pink-500 w-10 h-10 animate-pulse" />
                    )}
                    {alert.icon === "safe" && (
                      <Activity className="text-sky-500 w-10 h-10" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {alert.title}
                    </h2>
                    <p className="text-gray-600 mt-3 leading-7">
                      {alert.message}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-5">
                      <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                        <FaUser className="w-4 h-4" />
                        {currentUser.name}
                      </span>
                      <span className="bg-sky-100 text-sky-600 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {alert.status === "Unread" ? (
                    <button
                      onClick={() => handleMarkReviewed(alert.id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-sky-400 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-pink-300 transition-all duration-300"
                    >
                      Review Alert
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-5 py-3 rounded-xl font-semibold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Reviewed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredAlerts.length === 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-pink-100">
              <CheckCircle className="mx-auto w-20 h-20 text-sky-500 mb-5" />
              <h2 className="text-3xl font-bold text-gray-700">
                Great News!
              </h2>
              <p className="text-gray-500 mt-4 text-lg">
                No pregnancy alerts found for the selected category.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

const NavItem = ({ label, icon, to, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"
        : "hover:bg-pink-100 text-gray-700 hover:translate-x-2"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const SummaryCard = ({ title, value, color, icon }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-pink-100 hover:-translate-y-2 hover:shadow-pink-200 transition-all duration-500">
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}
      >
        {icon}
      </div>
      <h3 className="mt-5 text-gray-600 font-medium">
        {title}
      </h3>
      <h1 className="text-4xl font-bold mt-2 text-gray-800">
        {value}
      </h1>
    </div>
  );
};

export default Alerts;