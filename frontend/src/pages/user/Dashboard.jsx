import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import heroMother from "../../assets/images/hero-mother.png";
import bg from "../../assets/images/bg.png";
import UserSidebar from "../../components/UserSidebar";
import {
  FaHeartbeat,
  FaFileMedical,
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
    risk: "Not assessed",
    score: 0,
    confidence: 0,
    symptoms: [],
    riskFactors: [],
  });

  const [water, setWater] = useState(0);
  const [medicines, setMedicines] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [reminderCount, setReminderCount] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [now, setNow] = useState(() => new Date());

  // Keeps the calendar label current across a day boundary without requiring
  // a reload or any user interaction.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const [healthScore, setHealthScore] = useState(0);
  const [chartHealthData, setChartHealthData] = useState([]);
  const [riskPieData, setRiskPieData] = useState([]);

  const loadDashboardData = () => {
    // Load user
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);

    // Load risk data (user-specific)
    const savedRisk = JSON.parse(
      localStorage.getItem(`riskData_${user?.email}`)
    ) || JSON.parse(localStorage.getItem("riskData")) || {
      risk: "Not assessed",
      score: 0,
      confidence: 0,
      symptoms: [],
      riskFactors: [],
    };
    setRiskData(savedRisk);

    // Load water intake
    setWater(Number(localStorage.getItem("waterIntake")) || 0);

    // Load medications
    setMedicines(JSON.parse(localStorage.getItem("medications")) || []);

    // Load heart rate
    const hr = JSON.parse(localStorage.getItem("heartRate")) || 78;
    setHeartRate(hr);

    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/api/appointments/patient", { headers: { Authorization: `Bearer ${token}` } })
        .then(response => response.ok ? response.json() : [])
        .then(data => setAppointments(data.map(app => ({ ...app, doctor: app.doctor_name, date: app.scheduled_for, time: new Date(app.scheduled_for).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}), type: app.appointment_type }))));
      fetch("http://127.0.0.1:8000/api/reminders", { headers: { Authorization: `Bearer ${token}` } })
        .then(response => response.ok ? response.json() : []).then(data => setReminderCount(data.filter(item => item.enabled).length));
      fetch("http://127.0.0.1:8000/api/users/me/overview", { headers: { Authorization: `Bearer ${token}` } })
        .then(response => response.ok ? response.json() : null)
        .then(data => {
          if (!data) return;
          const latest = data.latest;
          if (data.pregnancy_timing?.pregnancy_week) {
            localStorage.setItem("pregnancyWeek", String(data.pregnancy_timing.pregnancy_week));
            window.dispatchEvent(new Event("pregnancyTimingUpdated"));
          }
          if (latest) {
            const liveRisk = { risk: latest.risk_level, score: latest.risk_score, confidence: 0, symptoms: latest.symptoms || [], riskFactors: [], vitals: { heartRate: latest.heart_rate, bpSystolic: latest.bp_systolic, bpDiastolic: latest.bp_diastolic, sugar: latest.sugar, temperature: latest.temperature, week: latest.pregnancy_week } };
            setRiskData(liveRisk);
            setHeartRate(Number(latest.heart_rate) || 0);
            calculateHealthScore(liveRisk, water, medicines);
          }
          setChartHealthData((data.history || []).map((item, index) => ({ day: `Check ${index + 1}`, heart: Number(item.heart_rate) || 0 })));
          const counts = (data.history || []).reduce((result, item) => ({ ...result, [item.risk_level]: (result[item.risk_level] || 0) + 1 }), {});
          setRiskPieData(Object.entries(counts).map(([name, value]) => ({ name, value })));
          setReminderCount(data.active_reminders || 0);
          setMedicines(Array.from({ length: data.prescriptions?.total || 0 }, (_, index) => ({ id: index, taken: index < (data.prescriptions?.completed || 0) })));
        });
    }

    // Calculate health score
    calculateHealthScore(savedRisk, water, medicines);
  };

  const calculateHealthScore = (risk, water, meds) => {
    let score = 0;
    if (risk) {
      if (risk.risk === "High") {
        score = 100 - (risk.score || 0) * 0.7;
      } else if (risk.risk === "Moderate" || risk.risk === "Medium") {
        score = 100 - (risk.score || 0) * 0.4;
      } else if (risk.risk === "Low") {
        score = 100 - (risk.score || 0) * 0.2;
      }
    }
    if (water < 6) score -= 5;
    if (water > 8) score += 3;
    const takenMeds = meds?.filter(m => m.taken).length || 0;
    if (takenMeds > 0) score += 2;
    setHealthScore(Math.min(100, Math.max(0, Math.round(score))));
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case "High": return "text-red-500";
      case "Moderate": return "text-orange-500";
      case "Medium": return "text-orange-500";
      case "Low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const getRiskEmoji = (risk) => {
    switch (risk) {
      case "High": return "🔴";
      case "Moderate": return "🟠";
      case "Medium": return "🟠";
      case "Low": return "🟢";
      default: return "🟢";
    }
  };

  // Get upcoming appointment
  const getUpcomingAppointment = () => {
    const futureAppointments = appointments.filter(item => new Date(item.date) >= new Date() && !["cancelled", "rejected", "completed"].includes(item.status));
    if (futureAppointments.length === 0) return null;
    const sorted = [...futureAppointments].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    return sorted[0];
  };

  const upcomingApp = getUpcomingAppointment();

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex"
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
      <UserSidebar />
      <div className="hidden">
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
          <p className="text-sm text-gray-500">Maternal Health System</p>
        </Link>

        <div className="mt-8 space-y-2 flex-1 overflow-y-auto">
          <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard" active />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/reports" />
          <NavItem label="Prescriptions" icon={<FaFileMedical />} to="/prescriptions" />
          <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" />
          <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" />
          <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" />
          <NavItem label="Prediction" icon={<FaChartLine />} to="/prediction" />
          <NavItem label="Alerts" icon={<FaBell />} to="/alerts" />
          <NavItem label="Appointments" icon={<FaCalendarAlt />} to="/appointment" />
          <NavItem label="Reminders" icon={<FaBell />} to="/reminders" />
          <NavItem label="Feedback" icon={<FaLightbulb />} to="/share-feedback" />
          <NavItem label="Profile" icon={<FaUser />} to="/profile" />
          <NavItem label="Settings" icon={<FaShieldAlt />} to="/settings" />
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
      <div className="relative z-10 flex-1 px-4 py-4 sm:px-6 lg:ml-64 lg:px-8">
        
        {/* Top Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4">
          <div className="flex items-center gap-3">
            <Link to="/profile" aria-label="Open profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse">
              {currentUser?.name?.charAt(0).toUpperCase() || "U"}
            </Link>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Welcome back, {currentUser?.name?.split(" ")[0] || "User"}! 👋
              </h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Health Score:</span>
                <span className="font-bold text-pink-500">{healthScore}%</span>
                <span className="text-gray-300">|</span>
                <span className={`font-medium ${getRiskColor(riskData.risk)}`}>
                  {getRiskEmoji(riskData.risk)} {riskData.risk} Risk
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:shadow-md transition-all duration-300">
            <FaClock className="text-pink-400 text-sm" />
            <span className="text-xs text-gray-500">
              {now.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
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
                  ML Powered Maternal Care
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
                Monitor pregnancy health, track symptoms, view ML predictions,
                and manage appointments from a single dashboard.
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  to="/profile"
                  className="group/btn bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-pink-300/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  View Profile
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
                  <p className="text-xs text-gray-500">Model inputs</p>
                  <p className="text-sm font-bold text-sky-500">24 features</p>
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
                    ML Risk Assessment
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
                {riskData.riskFactors?.length > 0 && riskData.riskFactors.map((factor, index) => (
                  <span
                    key={`factor-${index}`}
                    className="bg-red-300/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm hover:scale-105 transition-all duration-300 cursor-default"
                  >
                    ⚠️ {factor}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Stat icon={<FaHeartbeat />} label="Heart Rate" value={`${heartRate} bpm`} color="pink" />
          <Stat icon={<FaTint />} label="Blood Pressure" value={riskData.vitals?.bpSystolic && riskData.vitals?.bpDiastolic ? `${riskData.vitals.bpSystolic}/${riskData.vitals.bpDiastolic}` : "Not recorded"} color="sky" />
          <Stat icon={<FaWeight />} label="Weight" value={riskData.vitals?.weight ? `${riskData.vitals.weight} kg` : "Not recorded"} color="pink" />
          <Stat icon={<FaBaby />} label="Baby Growth" value={riskData.risk === "High" ? "Monitoring" : "Normal"} color="sky" />
          <Stat icon={<FaTint />} label="Water Intake" value={`${water}/10`} color="sky" />
          <Stat icon={<FaPills />} label="Medicines" value={medicines.length} color="pink" />
          <Link to="/reminders" className="block"><Stat icon={<FaBell />} label="Active Reminders" value={reminderCount} color="sky" /></Link>
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
              <LineChart data={chartHealthData}>
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
                <Pie data={riskPieData} dataKey="value" outerRadius={80} label={({ name }) => name}>
                  {riskPieData.map((entry, index) => (
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
              <AlertItem icon="💧" text={`Water Reminder - ${water}/10 glasses`} time="Now" color="pink" />
              {riskData.risk === "High" && (
                <AlertItem icon="⚠️" text="High risk detected - Consult doctor" time="Urgent" color="red" />
              )}
              {(riskData.risk === "Moderate" || riskData.risk === "Medium") && (
                <AlertItem icon="📋" text="Moderate risk - Monitor symptoms" time="Today" color="orange" />
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-white/70">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-3">
              <FaCalendarAlt className="text-pink-500" />
              Upcoming Appointment
            </h3>
            {upcomingApp ? (
              <div className="bg-gradient-to-r from-pink-50 to-sky-50 p-4 rounded-2xl hover:scale-105 transition-all duration-300">
                <p className="font-semibold text-gray-800 text-lg">{upcomingApp.doctor}</p>
                <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${upcomingApp.status === "accepted" ? "bg-green-100 text-green-700" : upcomingApp.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>Appointment {upcomingApp.status}</span>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaClock className="text-pink-400" />
                    {upcomingApp.date}
                  </span>
                  <span className="text-pink-500 font-semibold bg-pink-100 px-3 py-1 rounded-full">
                    {upcomingApp.time}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">{upcomingApp.type}</p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-pink-50 to-sky-50 p-4 rounded-2xl text-center">
                <p className="text-gray-500">No upcoming appointments</p>
                <Link to="/appointment" className="text-sm text-pink-500 font-semibold hover:underline">
                  Book an appointment →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
        </div>
      </div>

      <style >{`
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

const AlertItem = ({ icon, text, time, color }) => {
  const colorMap = {
    pink: "bg-pink-50 border-pink-200 text-pink-600",
    sky: "bg-sky-50 border-sky-200 text-sky-600",
    red: "bg-red-50 border-red-200 text-red-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };
  
  const bgColor = colorMap[color] || colorMap.pink;
  
  return (
    <div className={`flex items-center gap-3 ${bgColor} backdrop-blur-sm p-3 rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border`}>
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium flex-1">{text}</span>
      <span className={`text-xs bg-white/50 px-2 py-1 rounded-full ${color === "red" ? "text-red-500" : color === "orange" ? "text-orange-500" : "text-gray-500"}`}>{time}</span>
    </div>
  );
};

export default Dashboard;
