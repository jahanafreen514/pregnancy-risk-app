import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaArrowLeft,
  FaChartLine,
  FaRobot,
  FaUserInjured,
  FaNotesMedical,
  FaCheckCircle,
  FaHospital,
  FaTint,
  FaBaby,
  FaStethoscope,
  FaShieldAlt,
  FaUserCircle,
  FaBell,
  FaCalendarAlt,
  FaClipboardList,
  FaSpinner,
  FaLightbulb,
  FaUser,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

function Prediction() {
  const [riskData, setRiskData] = useState({
    risk: "Low",
    score: 15,
    confidence: 95,
    symptoms: [],
    riskFactors: [],
    vitals: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRisk = () => {
      const currentUser =
  JSON.parse(localStorage.getItem("currentUser")) || {};

const saved =
  JSON.parse(
    localStorage.getItem(`riskData_${currentUser.email}`)
  ) || {
    risk: "Low",
    score: 15,
    confidence: 95,
    symptoms: [],
    riskFactors: [],
    vitals: {},
  };
    };

    loadRisk();

    window.addEventListener("storage", loadRisk);

    return () => window.removeEventListener("storage", loadRisk);
  }, []);

  const getTheme = () => {
    if (riskData.risk === "High") {
      return {
        bg: "from-red-500 to-pink-500",
        card: "bg-red-50 border-red-100",
        text: "text-red-500",
        badge: "bg-red-100 text-red-600",
        glow: "red-400",
        emoji: "🔴",
        status: "Critical",
      };
    }

    if (riskData.risk === "Moderate" || riskData.risk === "Medium") {
      return {
        bg: "from-orange-400 to-pink-400",
        card: "bg-orange-50 border-orange-100",
        text: "text-orange-500",
        badge: "bg-orange-100 text-orange-600",
        glow: "orange-400",
        emoji: "🟡",
        status: "Attention Needed",
      };
    }

    return {
      bg: "from-pink-500 to-sky-400",
      card: "bg-pink-50 border-pink-100",
      text: "text-pink-500",
      badge: "bg-pink-100 text-pink-600",
      glow: "pink-400",
      emoji: "🟢",
      status: "Good",
    };
  };

  const theme = getTheme();

  const suggestions = {
    Low: [
      "Continue prenatal supplements regularly",
      "Drink 8-10 glasses of water daily",
      "Attend scheduled checkups on time",
      "Walk daily for 20-30 minutes",
      "Maintain a balanced diet",
    ],
    Moderate: [
      "Monitor blood pressure regularly at home",
      "Consult your gynecologist within 24 hours",
      "Increase hydration and rest",
      "Take sufficient rest and avoid stress",
      "Track fetal movements closely",
    ],
    Medium: [
      "Monitor blood pressure regularly at home",
      "Consult your gynecologist within 24 hours",
      "Increase hydration and rest",
      "Take sufficient rest and avoid stress",
      "Track fetal movements closely",
    ],
    High: [
      "Visit the hospital immediately",
      "Monitor fetal movement every 2 hours",
      "Avoid physical strain completely",
      "Stay under medical observation",
      "Call your doctor if symptoms worsen",
    ],
  };

  const getRiskKey = () => {
    if (riskData.risk === "High") return "High";
    if (riskData.risk === "Moderate" || riskData.risk === "Medium") return "Moderate";
    return "Low";
  };

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

      {/* SIDEBAR - FIXED FULL HEIGHT */}
      <div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 p-5 flex-shrink-0 h-full flex flex-col">
              <Link to="/dashboard" className="block">
                <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
                <p className="text-sm text-gray-500">Maternal Health System</p>
              </Link>
      
              <div className="mt-8 space-y-2 flex-1 overflow-y-auto">
                <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard"  />
                <NavItem label="Monitoring" icon={<FaStethoscope />} to="/monitor" />
                <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" />
                <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" />
                <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" />
                <NavItem label="Prediction" icon={<FaChartLine />} to="/prediction" active/>
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
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaRobot className="text-pink-500" />
              AI Pregnancy Prediction
              <span className="text-sm font-normal text-gray-500 bg-pink-50 px-3 py-1 rounded-full">
                {theme.emoji} {theme.status}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hospital Decision Support Dashboard
            </p>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-sky-400 text-white px-6 py-2.5 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FaArrowLeft />
            Dashboard
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FaSpinner className="text-5xl text-pink-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading prediction data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* TOP GRID */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* AI SCORE */}
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border border-white/70">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${theme.bg} flex items-center justify-center text-white text-4xl shadow-lg animate-pulse`}
                  >
                    <FaRobot />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">AI Risk Analysis</h2>
                    <p className="text-gray-500">Machine Learning Based Assessment</p>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <div
                    className={`w-56 h-56 rounded-full bg-gradient-to-br ${theme.bg} flex justify-center items-center shadow-2xl animate-pulse relative`}
                  >
                    <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm"></div>
                    <div className="w-44 h-44 bg-white rounded-full flex flex-col justify-center items-center relative z-10">
                      <h2 className={`text-5xl font-bold ${theme.text}`}>
                        {riskData.score}%
                      </h2>
                      <p className="text-gray-500 text-sm">Risk Score</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <span
                    className={`${theme.badge} px-6 py-2.5 rounded-full font-semibold text-base inline-flex items-center gap-2`}
                  >
                    {theme.emoji} {riskData.risk.toUpperCase()} RISK
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">AI Confidence</span>
                    <span className="font-bold text-gray-800">{riskData.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${theme.bg} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${riskData.confidence}%` }}
                    />
                  </div>
                </div>

                {riskData.riskFactors && riskData.riskFactors.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-pink-100">
                    <h4 className="font-semibold text-gray-700 mb-3">⚠️ Risk Factors Identified</h4>
                    <div className="flex flex-wrap gap-2">
                      {riskData.riskFactors.map((factor, index) => (
                        <span key={index} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-sm border border-red-200">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PATIENT SUMMARY */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 border border-white/70">
                  <div className="flex items-center gap-3 mb-5">
                    <FaUserInjured className="text-pink-500 text-2xl" />
                    <h3 className="text-xl font-bold text-gray-800">Patient Summary</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-pink-50">
                      <span className="text-gray-500">Status</span>
                      <span className={`${theme.text} font-bold`}>{theme.emoji} {riskData.risk}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-pink-50">
                      <span className="text-gray-500">AI Score</span>
                      <span className="font-bold text-gray-800">{riskData.score}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-pink-50">
                      <span className="text-gray-500">Confidence</span>
                      <span className="font-bold text-gray-800">{riskData.confidence}%</span>
                    </div>
                    {riskData.vitals && (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-pink-50">
                          <span className="text-gray-500">Week</span>
                          <span className="font-bold text-gray-800">{riskData.vitals.week || "—"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-500">Symptoms</span>
                          <span className="font-bold text-gray-800">{riskData.symptoms?.length || 0}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className={`bg-gradient-to-r ${theme.bg} rounded-3xl p-6 text-white shadow-xl relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <FaHospital className="text-4xl mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold">Hospital Recommendation</h3>
                    <p className="mt-3 leading-7 text-white/90">
                      {riskData.risk === "High"
                        ? "🚨 Immediate hospital consultation recommended."
                        : riskData.risk === "Moderate" || riskData.risk === "Medium"
                        ? "📋 Consult your gynecologist within 24 hours."
                        : "✅ Continue regular prenatal care and healthy lifestyle."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ANALYTICS */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 border border-white/70 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <FaHeartbeat className="text-3xl text-pink-500" />
                </div>
                <h3 className="font-bold text-xl text-gray-800">Heart Rate</h3>
                <p className="text-4xl font-bold mt-2 text-pink-500">78 BPM</p>
                <p className="text-gray-500 mt-2 text-sm">Stable heartbeat detected.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 border border-white/70 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                  <FaTint className="text-3xl text-sky-500" />
                </div>
                <h3 className="font-bold text-xl text-gray-800">Blood Pressure</h3>
                <p className="text-4xl font-bold mt-2 text-sky-500">
                  {riskData.vitals?.bpSystolic || "120"}/{riskData.vitals?.bpDiastolic || "80"}
                </p>
                <p className="text-gray-500 mt-2 text-sm">Within normal range.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 border border-white/70 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <FaBaby className="text-3xl text-pink-500" />
                </div>
                <h3 className="font-bold text-xl text-gray-800">Baby Status</h3>
                <p className="text-4xl font-bold mt-2 text-pink-500">Healthy</p>
                <p className="text-gray-500 mt-2 text-sm">Growth progressing normally.</p>
              </div>
            </div>

            {/* SYMPTOMS */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 mb-6 border border-white/70">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <FaNotesMedical className="text-pink-500 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Selected Symptoms</h2>
                <span className="ml-auto text-sm text-gray-400 bg-pink-50 px-3 py-1 rounded-full">
                  {riskData.symptoms?.length || 0} symptoms
                </span>
              </div>

              {riskData.symptoms && riskData.symptoms.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {riskData.symptoms.map((symptom, index) => (
                    <div
                      key={index}
                      className="px-5 py-2.5 rounded-full bg-pink-100 text-pink-600 font-semibold hover:scale-105 transition-all duration-300 border border-pink-200"
                    >
                      {symptom}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No symptoms selected.</p>
              )}
            </div>

            {/* AI RECOMMENDATIONS */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 mb-6 border border-white/70">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center">
                  <FaRobot className="text-white text-2xl animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">AI Recommendations</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {suggestions[getRiskKey()]?.map((tip, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-r from-pink-50 to-sky-50 border border-pink-100 rounded-2xl p-4 flex items-start gap-4 hover:scale-[1.02] hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaCheckCircle className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Recommendation {index + 1}</h4>
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DOCTOR ADVICE */}
            <div className={`bg-gradient-to-r ${theme.bg} rounded-3xl shadow-xl p-8 mb-6 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FaStethoscope className="text-4xl animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Doctor's Advice</h2>
                    <p className="text-white/90 mt-1 text-sm">
                      AI predictions are for assistance only and should not replace professional medical advice.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5 hover:scale-105 transition-all duration-300">
                    <h3 className="font-bold text-lg mb-2">🩺 Consultation</h3>
                    <p className="text-sm leading-6 text-white/90">
                      Schedule regular prenatal checkups with your healthcare provider.
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5 hover:scale-105 transition-all duration-300">
                    <h3 className="font-bold text-lg mb-2">💧 Hydration</h3>
                    <p className="text-sm leading-6 text-white/90">
                      Drink 8–10 glasses of water daily and maintain a balanced diet.
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5 hover:scale-105 transition-all duration-300">
                    <h3 className="font-bold text-lg mb-2">👶 Baby Care</h3>
                    <p className="text-sm leading-6 text-white/90">
                      Monitor fetal movements and report any unusual symptoms immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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

export default Prediction;