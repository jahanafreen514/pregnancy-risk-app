import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaUser,
  FaHeartbeat,
  FaShieldAlt,
  FaArrowRight,
  FaUserCog,
  FaUserGraduate,
  FaStethoscope,
  FaBaby,
  FaChartLine,
  FaBell,
} from "react-icons/fa";
import { motion } from "framer-motion";
import bg from "../../assets/images/bg.png";

const Starting = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isHovering, setIsHovering] = useState(null);

  const selectRole = (role) => {
  setSelectedRole(role);
};

const continueToLogin = () => {
  if (!selectedRole) return;

  switch (selectedRole) {
    case "admin":
      navigate("/admin-login");
      break;

    case "doctor":
      navigate("/doctor-login");
      break;

    default:
      navigate("/login");
  }
};
  const goBack = () => {
    navigate("/home");
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center flex items-center justify-center p-4 sm:p-6 lg:p-8"
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

      <div className="w-full max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/70 shadow-2xl p-8 sm:p-10 lg:p-12"
        >
          {/* Back Button */}
          <button
            onClick={goBack}
            className="mb-6 flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-all duration-300 group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-medium">Back to Home</span>
          </button>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-pink-300 blur-2xl opacity-60 animate-pulse"></div>
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-2xl animate-float">
                  <FaHeartbeat className="text-white text-3xl animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
              Welcome to GlowCare
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-2">
              Choose your role to continue
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Admin Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onMouseEnter={() => setIsHovering("admin")}
              onMouseLeave={() => setIsHovering(null)}
              onClick={() => selectRole("admin")}
              className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-500 ${
                selectedRole === "admin"
                  ? "border-pink-500 bg-pink-50/80 shadow-xl scale-105"
                  : isHovering === "admin"
                  ? "border-pink-400 bg-white/90 shadow-xl scale-105"
                  : "border-pink-100/50 bg-white/60 hover:shadow-lg"
              }`}
            >
              <div className="absolute top-3 right-3">
                <div className={`w-3 h-3 rounded-full ${
                  selectedRole === "admin" ? "bg-pink-500 animate-pulse" : "bg-gray-300"
                }`}></div>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                  selectedRole === "admin" || isHovering === "admin"
                    ? "bg-gradient-to-br from-pink-500 to-sky-400 shadow-lg"
                    : "bg-pink-100"
                }`}>
                  <FaUserMd className={`text-3xl transition-all duration-500 ${
                    selectedRole === "admin" || isHovering === "admin"
                      ? "text-white"
                      : "text-pink-500"
                  }`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaUserCog className="text-pink-500 text-sm" />
                  Admin
                </h3>
                <p className="text-xs text-gray-500 mt-2 leading-5">
                  Manage the platform, monitor all patients, and access administrative controls.
                </p>
                
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="text-[10px] bg-pink-50 text-pink-600 px-3 py-1 rounded-full border border-pink-200">
                    <FaShieldAlt className="inline mr-1 text-xs" />
                    Full Access
                  </span>
                  <span className="text-[10px] bg-sky-50 text-sky-600 px-3 py-1 rounded-full border border-sky-200">
                    <FaChartLine className="inline mr-1 text-xs" />
                    Analytics
                  </span>
                  <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1 rounded-full border border-purple-200">
                    <FaBell className="inline mr-1 text-xs" />
                    Manage Alerts
                  </span>
                </div>
              </div>
            </motion.div>
            {/* Doctor Card */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.25 }}
  onMouseEnter={() => setIsHovering("doctor")}
  onMouseLeave={() => setIsHovering(null)}
  onClick={() => selectRole("doctor")}
  className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-500 ${
    selectedRole === "doctor"
      ? "border-green-500 bg-green-50 shadow-xl scale-105"
      : isHovering === "doctor"
      ? "border-green-400 bg-white/90 shadow-xl scale-105"
      : "border-pink-100/50 bg-white/60 hover:shadow-lg"
  }`}
>
  <div className="absolute top-3 right-3">
    <div
      className={`w-3 h-3 rounded-full ${
        selectedRole === "doctor"
          ? "bg-green-500 animate-pulse"
          : "bg-gray-300"
      }`}
    ></div>
  </div>

  <div className="flex flex-col items-center text-center">
    <div
      className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
        selectedRole === "doctor" || isHovering === "doctor"
          ? "bg-gradient-to-br from-green-500 to-emerald-400 shadow-lg"
          : "bg-green-100"
      }`}
    >
      <FaUserMd
        className={`text-4xl ${
          selectedRole === "doctor" || isHovering === "doctor"
            ? "text-white"
            : "text-green-600"
        }`}
      />
    </div>

    <h3 className="text-xl font-bold text-gray-800">
      Doctor
    </h3>

    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
      Review patient reports, monitor pregnancy progress, manage appointments,
      and provide medical recommendations.
    </p>

    <div className="mt-4 flex flex-wrap justify-center gap-2">
      <span className="text-[10px] bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200">
        Patients
      </span>

      <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-200">
        Reports
      </span>

      <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1 rounded-full border border-purple-200">
        Appointments
      </span>
    </div>
  </div>
</motion.div>

            {/* User Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onMouseEnter={() => setIsHovering("user")}
              onMouseLeave={() => setIsHovering(null)}
              onClick={() => selectRole("user")}
              className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-500 ${
                selectedRole === "user"
                  ? "border-sky-500 bg-sky-50/80 shadow-xl scale-105"
                  : isHovering === "user"
                  ? "border-sky-400 bg-white/90 shadow-xl scale-105"
                  : "border-pink-100/50 bg-white/60 hover:shadow-lg"
              }`}
            >
              <div className="absolute top-3 right-3">
                <div className={`w-3 h-3 rounded-full ${
                  selectedRole === "user" ? "bg-sky-500 animate-pulse" : "bg-gray-300"
                }`}></div>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                  selectedRole === "user" || isHovering === "user"
                    ? "bg-gradient-to-br from-sky-500 to-pink-400 shadow-lg"
                    : "bg-sky-100"
                }`}>
                  <FaUser className={`text-4xl transition-all duration-500 ${
                    selectedRole === "user" || isHovering === "user"
                      ? "text-white"
                      : "text-sky-500"
                  }`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaUserGraduate className="text-sky-500 text-sm" />
                  User
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Track your pregnancy, monitor health, and get personalized insights for a safe journey.
                </p>
                
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="text-[10px] bg-pink-50 text-pink-600 px-3 py-1 rounded-full border border-pink-200">
                    <FaBaby className="inline mr-1 text-xs" />
                    Pregnancy Tracking
                  </span>
                  <span className="text-[10px] bg-sky-50 text-sky-600 px-3 py-1 rounded-full border border-sky-200">
                    <FaStethoscope className="inline mr-1 text-xs" />
                    Health Monitor
                  </span>
                  <span className="text-[10px] bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200">
                    <FaChartLine className="inline mr-1 text-xs" />
                    ML Insights
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Continue Button */}
<div className="mt-12 flex justify-center">
  <button
  onClick={continueToLogin}
              disabled={!selectedRole}
              className={`px-8 py-3 rounded-2xl font-bold text-white transition-all duration-300 flex items-center gap-3 mx-auto ${
                selectedRole
                  ? "bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 hover:shadow-pink-300/50 hover:scale-105"
                  : "bg-gray-300 cursor-not-allowed opacity-50"
              }`}
            >
              Continue as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : "..."}
              <FaArrowRight className="text-sm" />
             </button>
</div>
            
            <p className="text-xs text-gray-400 mt-3">
              {selectedRole ? `Selected: ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` : "Please select a role to continue"}
            </p>
          

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-pink-100/50 text-center text-[10px] text-gray-400">
            <p>Secure • Encrypted • HIPAA Compliant</p>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Starting;