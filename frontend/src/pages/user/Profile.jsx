import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaNotesMedical,
  FaLightbulb,
  FaPhone,
  FaEnvelope,
  FaBaby,
  FaHeartbeat,
  FaEdit,
  FaWeight,
  FaTint,
  FaUserCircle,
  FaBell,
  FaChartLine,
  FaStethoscope,
  FaClipboardList,
  FaCalendarAlt,
  FaSignOutAlt,
  FaShieldAlt,
  FaHospital,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [healthData, setHealthData] = useState({
    heartRate: "78 bpm",
    bloodPressure: "120/80",
    weight: "68 kg",
    babyGrowth: "Normal",
    healthScore: 92,
    week: "28 Weeks",
    bloodGroup: "O+",
    expectedDelivery: "12 Dec 2026",
  });

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Redirect to login if no user found
      navigate("/login");
    }

    // Load health data from localStorage if available
    const savedHealth = JSON.parse(localStorage.getItem("healthData"));
    if (savedHealth) {
      setHealthData(prev => ({ ...prev, ...savedHealth }));
    }

    // Load risk data
    const riskData = JSON.parse(localStorage.getItem("riskData"));
    if (riskData) {
      setHealthData(prev => ({
        ...prev,
        healthScore: 100 - (riskData.score || 0),
      }));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Get user's first name
  const getFirstName = () => {
    if (!user?.name) return "User";
    return user.name.split(" ")[0];
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center flex"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Floating Blobs - Same as Login/Register */}
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
                           <NavItem label="Alerts" icon={<FaBell />} to="/alerts" />
                           <NavItem label="Appointments" icon={<FaCalendarAlt />} to="/appointment" />
                           <NavItem label="Profile" icon={<FaUser />} to="/profile" active/>
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
        {/* Top Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaUserCircle className="text-pink-500" />
              My Profile
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your maternal healthcare information
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {getUserInitials()}
            </div>
            <span className="text-sm font-medium text-gray-700">{getFirstName()}</span>
          </div>
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 border border-white/70">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                className="w-36 h-36 rounded-full mx-auto bg-gradient-to-br from-pink-100 to-sky-100 flex items-center justify-center border-4 border-pink-200 shadow-lg"
              >
                <span className="text-6xl font-bold text-pink-500">
                  {getUserInitials()}
                </span>
              </motion.div>

              <h2 className="text-2xl font-bold text-center mt-5 text-gray-800">
                {user?.name || "User"}
              </h2>
              <p className="text-center text-gray-500">Expecting Mother</p>

              {/* Health Score */}
              <div className="mt-6 flex justify-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-pink-100 to-sky-100 flex items-center justify-center shadow-lg hover:scale-105 transition relative">
                  <div className="absolute inset-2 rounded-full bg-white/50 backdrop-blur-sm"></div>
                  <div className="text-center relative z-10">
                    <h3 className="text-4xl font-bold text-pink-500">
                      {healthData.healthScore}%
                    </h3>
                    <p className="text-sm text-gray-500">Health Score</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <Link
                  to="/profile/edit"
                  className="bg-gradient-to-r from-pink-500 to-sky-400 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  <FaEdit /> Edit Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="bg-sky-50 text-sky-600 py-3 rounded-xl text-center hover:bg-sky-100 hover:scale-105 transition-all duration-300 border border-sky-200"
                >
                  Back To Dashboard
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 border border-white/70">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/symptoms" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-all duration-300 text-gray-700 hover:text-pink-500">
                  <FaClipboardList className="text-pink-400" />
                  <span>Log Symptoms</span>
                </Link>
                <Link to="/prediction" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-all duration-300 text-gray-700 hover:text-pink-500">
                  <FaChartLine className="text-pink-400" />
                  <span>View Prediction</span>
                </Link>
                <Link to="/appointment" className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-all duration-300 text-gray-700 hover:text-pink-500">
                  <FaCalendarAlt className="text-pink-400" />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* RIGHT PANEL */}
          <div className="xl:col-span-2 space-y-6">
            {/* Health Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <StatCard icon={<FaHeartbeat />} value={healthData.heartRate} title="Heart Rate" color="pink" />
              <StatCard icon={<FaTint />} value={healthData.bloodPressure} title="Blood Pressure" color="sky" />
              <StatCard icon={<FaWeight />} value={healthData.weight} title="Weight" color="purple" />
              <StatCard icon={<FaBaby />} value={healthData.babyGrowth} title="Baby Growth" color="green" />
            </motion.div>

            {/* Personal Information */}
            <SectionCard title="Personal Information">
              <div className="grid md:grid-cols-2 gap-4">
                <InfoCard icon={<FaUser />} label="Full Name" value={user?.name || "Not set"} />
                <InfoCard icon={<FaEnvelope />} label="Email" value={user?.email || "Not set"} />
                <InfoCard icon={<FaPhone />} label="Phone" value={user?.phone || "Not set"} />
                <InfoCard icon={<FaBaby />} label="Expected Delivery" value={healthData.expectedDelivery} />
              </div>
            </SectionCard>

            {/* Pregnancy Details */}
            <SectionCard title="Pregnancy Details">
              <div className="grid md:grid-cols-3 gap-4">
                <DetailCard title="Current Week" value={healthData.week} />
                <DetailCard title="Weight" value={healthData.weight} />
                <DetailCard title="Blood Group" value={healthData.bloodGroup} />
              </div>
            </SectionCard>

            {/* Medical History */}
            <SectionCard title="Medical History">
              <div className="space-y-3">
                <HistoryCard icon={<FaShieldAlt />} text="Routine Prenatal Checkups Completed" />
                <HistoryCard icon={<FaHospital />} text="No Major Health Risks Detected" />
                <HistoryCard icon={<FaHeartbeat />} text="Regular Iron & Vitamin Supplements" />
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
          <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
        </div>
      </div>
    </div>
  );
};

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

const SectionCard = ({ title, children }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-lg p-6 border border-white/70 transition-all duration-300"
  >
    <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
      <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-sky-400 rounded-full"></span>
      {title}
    </h3>
    {children}
  </motion.div>
);

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.03 }}
    className={`bg-gradient-to-br from-${color}-50 to-${color}-100/50 rounded-2xl p-5 shadow-md border border-${color}-100/50`}
  >
    <div className={`text-3xl text-${color}-500`}>{icon}</div>
    <h3 className="mt-2 text-xl font-bold text-gray-800">{value}</h3>
    <p className="text-sm text-gray-500">{title}</p>
  </motion.div>
);

const InfoCard = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-gradient-to-br from-pink-50 to-sky-50 p-4 rounded-xl border border-pink-100/50"
  >
    <div className="text-pink-500 text-xl mb-2">{icon}</div>
    <p className="text-sm text-gray-500">{label}</p>
    <h4 className="font-semibold text-gray-800">{value}</h4>
  </motion.div>
);

const DetailCard = ({ title, value }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className="bg-gradient-to-br from-pink-50 to-sky-50 p-5 rounded-xl text-center shadow-sm border border-pink-100/50"
  >
    <p className="text-gray-500 text-sm">{title}</p>
    <h4 className="text-xl font-bold text-pink-500 mt-2">{value}</h4>
  </motion.div>
);

const HistoryCard = ({ icon, text }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className="flex items-center gap-3 bg-gradient-to-r from-pink-50 to-sky-50 p-4 rounded-xl shadow-sm border border-pink-100/50"
  >
    <span className="text-pink-500 text-xl">{icon}</span>
    <span className="text-gray-700">{text}</span>
  </motion.div>
);

export default Profile;