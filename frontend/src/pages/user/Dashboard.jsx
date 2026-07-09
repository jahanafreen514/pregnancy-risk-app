import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import heroMother from "../../assets/images/hero-mother.png";
import bg from "../../assets/images/bg.png";
import {
  FaHeartbeat,
  FaTint,
  FaWeight,
  FaBaby,
  FaBell,
  FaUser,
  FaNotesMedical,
  FaLightbulb,
  FaChartLine,
  FaStethoscope,
  FaCalendarAlt,
  FaArrowRight,
  FaClock,
  FaPills,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* SAMPLE DATA */
const healthData = [
  { day: "Mon", heart: 72 },
  { day: "Tue", heart: 75 },
  { day: "Wed", heart: 78 },
  { day: "Thu", heart: 74 },
  { day: "Fri", heart: 80 },
  { day: "Sat", heart: 77 },
];

const pieData = [
  { name: "Stable", value: 70 },
  { name: "Risk", value: 20 },
  { name: "Alert", value: 10 },
];

const COLORS = ["#f472b6", "#7dd3fc", "#fbcfe8"];

const Dashboard = () => {
  const [riskData, setRiskData] = useState({
    risk: "Low",
    score: 15,
    confidence: 95,
    symptoms: [],
  });

  const [water, setWater] = useState(0);
  const [medicines, setMedicines] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadDashboardData = () => {
      const savedRisk = JSON.parse(localStorage.getItem("riskData"));
      if (savedRisk) setRiskData(savedRisk);
      setWater(Number(localStorage.getItem("waterIntake")) || 0);
      setMedicines(JSON.parse(localStorage.getItem("medications")) || []);
      
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user) setCurrentUser(user);
    };

    loadDashboardData();
    const interval = setInterval(loadDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative h-screen overflow-hidden bg-cover bg-center flex"
      style={{
        backgroundImage: `url(${bg})`,
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

      {/* SIDEBAR - FIXED */}
      <div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 p-5 flex-shrink-0 h-full flex flex-col">
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
          <p className="text-sm text-gray-500">Maternal Health System</p>
        </Link>

        <div className="mt-8 space-y-2 flex-1 overflow-y-auto">
          <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard" active />
          <NavItem label="Monitoring" icon={<FaStethoscope />} to="/monitor" />
          <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" />
          <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" />
          <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" />
          <NavItem label="Prediction" icon={<FaChartLine />} to="/prediction" />
          <NavItem label="Alerts" icon={<FaBell />} to="/alerts" />
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

      {/* MAIN CONTENT - SCROLLABLE */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-4 h-full overflow-y-auto">
        
        {/* Top Bar */}
        <div className="flex flex-wrap justify-end items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:shadow-md transition-all duration-300">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse">
              {currentUser?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
              {currentUser?.name?.split(" ")[0] || "User"}
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl overflow-hidden mb-6 hover:shadow-2xl transition-all duration-500 group border border-white/70 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-6 sm:p-8 lg:p-10 relative">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-sky-400/10 px-4 py-2 rounded-full border border-pink-200/30 animate-pulse">
                <FaRocket className="text-pink-500 text-sm" />
                <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text">
                  AI Powered Maternal Care
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mt-5 leading-tight">
                Your Pregnancy
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                  Health Companion
                </span>
              </h2>

              <p className="text-gray-600 mt-4 text-base lg:text-lg leading-relaxed">
                Monitor pregnancy health, track symptoms, view AI predictions,
                and manage appointments from a single dashboard.
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  to="/monitor"
                  className="group/btn bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-pink-300/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Start Monitoring
                  <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/prediction"
                  className="bg-sky-50/80 backdrop-blur-sm text-sky-600 px-6 py-3 rounded-xl font-semibold hover:bg-sky-100 hover:scale-105 transition-all duration-300 border border-sky-200"
                >
                  View Prediction
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-gradient-to-r from-pink-50 to-pink-100/50 backdrop-blur-sm rounded-xl p-3 text-center hover:scale-105 transition-all duration-300">
                  <p className="text-xs text-gray-500">Monitor</p>
                  <p className="text-sm font-bold text-pink-500">24/7</p>
                </div>
                <div className="bg-gradient-to-r from-sky-50 to-sky-100/50 backdrop-blur-sm rounded-xl p-3 text-center hover:scale-105 transition-all duration-300">
                  <p className="text-xs text-gray-500">AI Risk</p>
                  <p className="text-sm font-bold text-sky-500">98%</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 backdrop-blur-sm rounded-xl p-3 text-center hover:scale-105 transition-all duration-300">
                  <p className="text-xs text-gray-500">Support</p>
                  <p className="text-sm font-bold text-purple-500">24/7</p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center items-center p-6 lg:p-8">
              <div className="absolute w-[300px] h-[300px] bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute w-[200px] h-[200px] bg-sky-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
              
              <img
                src={heroMother}
                alt="Mother Healthcare"
                className="relative w-full max-w-sm lg:max-w-full object-contain transition-all duration-700 hover:scale-110 hover:rotate-3 drop-shadow-2xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  animation: isHovered ? 'float 3s ease-in-out infinite' : 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* AI Risk Card */}
        <div className="rounded-3xl p-6 mb-6 text-white transition-all duration-500 hover:scale-[1.02] shadow-xl relative overflow-hidden bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 w-full">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                  <FaShieldAlt className="text-3xl" />
                </div>
                <div>
                  <p className="text-sm opacity-90 flex items-center gap-1">
                    <span className="text-yellow-300">✨</span>
                    AI Risk Assessment
                  </p>
                  <h3 className="text-3xl font-bold flex items-center gap-2">
                    {riskData.risk}
                    <span className="text-sm font-normal opacity-80">
                      Risk Level
                    </span>
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-8 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                <div className="text-center">
                  <p className="text-sm opacity-80">Risk Score</p>
                  <p className="text-3xl font-bold">{riskData.score}%</p>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-sm opacity-80">Confidence</p>
                  <p className="text-3xl font-bold">{riskData.confidence}%</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ${
                    riskData.risk === "High"
                      ? "bg-red-600"
                      : riskData.risk === "Moderate"
                      ? "bg-yellow-300"
                      : "bg-white"
                  }`}
                  style={{ width: `${riskData.score}%` }}
                ></div>
              </div>
            </div>

            {riskData.symptoms.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {riskData.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm hover:scale-105 transition-all duration-300 cursor-default"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Stat icon={<FaHeartbeat />} label="Heart Rate" value="78 bpm" color="pink" />
          <Stat icon={<FaTint />} label="Blood Pressure" value="120/80" color="sky" />
          <Stat icon={<FaWeight />} label="Weight" value="68 kg" color="pink" />
          <Stat icon={<FaBaby />} label="Baby Growth" value="Normal" color="sky" />
          <Stat icon={<FaTint />} label="Water Intake" value={`${water}/10`} color="sky" />
          <Stat icon={<FaPills />} label="Medicines" value={medicines.length} color="pink" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-white/70">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <FaHeartbeat className="text-pink-500 animate-pulse" />
                Heart Rate Trend
              </h3>
              <span className="text-xs text-gray-400 bg-pink-50 px-3 py-1 rounded-full">Last 6 days</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthData}>
                <XAxis dataKey="day" stroke="#cbd5e1" fontSize={12} />
                <YAxis stroke="#cbd5e1" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="heart"
                  stroke="#f472b6"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#f472b6", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-white/70">
            <h3 className="font-bold text-gray-700 mb-4 text-center">Health Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={80} label={({ name }) => name}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Appointments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-2xl p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-white/70">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
              <FaBell className="text-pink-500 animate-pulse" />
              Today's Alerts
            </h3>
            <div className="space-y-3">
              <AlertItem icon="💧" text="Drink Water Reminder" time="Now" color="pink" />
              <AlertItem icon="💊" text="Take Prenatal Supplements" time="10:00 AM" color="sky" />
              <AlertItem icon="🧘" text="15 Min Yoga Session" time="4:00 PM" color="purple" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-white/70">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-3">
              <FaCalendarAlt className="text-pink-500" />
              Upcoming Appointment
            </h3>
            <div className="bg-gradient-to-r from-pink-50 to-sky-50 p-4 rounded-2xl hover:scale-105 transition-all duration-300">
              <p className="font-semibold text-gray-800 text-lg">Dr. Priya Sharma</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FaClock className="text-pink-400" />
                  June 25, 2026
                </span>
                <span className="text-pink-500 font-semibold bg-pink-100 px-3 py-1 rounded-full">
                  10:30 AM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

/* ========== COMPONENTS ========== */

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

const Stat = ({ icon, label, value, color }) => (
  <div className={`bg-white/80 backdrop-blur-2xl p-4 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/70 cursor-pointer group`}>
    <div className={`text-3xl text-${color}-500 mb-1 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <p className="text-xs text-gray-500 font-medium">{label}</p>
    <p className="text-lg font-bold text-gray-800 mt-0.5 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-sky-400 group-hover:bg-clip-text transition-all duration-300">
      {value}
    </p>
  </div>
);

const AlertItem = ({ icon, text, time, color }) => (
  <div className={`flex items-center gap-3 bg-${color}-50/80 backdrop-blur-sm p-3 rounded-xl hover:bg-${color}-100 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-${color}-100/50`}>
    <span className="text-2xl">{icon}</span>
    <span className="text-sm font-medium text-gray-700 flex-1">{text}</span>
    <span className={`text-xs text-${color}-500 bg-white/50 px-2 py-1 rounded-full`}>{time}</span>
  </div>
);

export default Dashboard;