// DoctorProfile.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaChartLine,
  FaUsers,
  FaCalendarCheck,
  FaFileMedical,
  FaPrescription,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaSpinner,
  FaEdit,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHospital,
  FaGraduationCap,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "doctor") {
      navigate("/doctor-login");
      return;
    }
    setDoctor(currentUser);
    setFormData(currentUser);
    setLoading(false);
  }, []);

  const handleSave = () => {
    // Update in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(u =>
      u.id === doctor.id ? { ...u, ...formData } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Update current user
    const updatedDoctor = { ...doctor, ...formData };
    localStorage.setItem("currentUser", JSON.stringify(updatedDoctor));
    setDoctor(updatedDoctor);
    setIsEditing(false);
    
    alert("Profile updated successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <FaSpinner className="text-4xl text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-cover bg-center flex" style={{ backgroundImage: `url(${bg})` }}>
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>

      {/* SIDEBAR */}
      <div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 flex-shrink-0 h-full flex flex-col">
        <div className="p-5 border-b border-pink-100/50">
          <Link to="/doctor-dashboard" className="block">
            <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
            <p className="text-xs text-gray-500">Doctor Portal</p>
          </Link>
          <div className="mt-4 flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-sky-50 rounded-2xl border border-pink-100/30">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {doctor?.name?.charAt(0).toUpperCase() || "D"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{doctor?.name || "Doctor"}</p>
              <p className="text-xs text-gray-500 truncate">{doctor?.specialization || "Gynecologist"}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Online</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavItem label="Dashboard" icon={<FaChartLine />} to="/doctor-dashboard" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <NavItem label="Patients" icon={<FaUsers />} to="/doctor-patients" active={activeTab === "patients"} onClick={() => setActiveTab("patients")} />
          <NavItem label="Appointments" icon={<FaCalendarCheck />} to="/doctor-appointments" active={activeTab === "appointments"} onClick={() => setActiveTab("appointments")} />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/doctor-reports" active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
          <NavItem label="Prescriptions" icon={<FaPrescription />} to="/doctor-prescriptions" active={activeTab === "prescriptions"} onClick={() => setActiveTab("prescriptions")} />
          <NavItem label="Notifications" icon={<FaBell />} to="/doctor-notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          <NavItem label="Profile" icon={<FaUserMd />} to="/doctor-profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <NavItem label="Settings" icon={<FaCog />} to="/doctor-settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        </div>

        <div className="p-3 border-t border-pink-100/50">
          <button onClick={() => { localStorage.removeItem("currentUser"); window.location.href = "/doctor-login"; }} className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 px-4 py-2.5 rounded-xl hover:bg-pink-100 transition-all duration-300 text-sm font-semibold">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-4 h-full overflow-y-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaUserMd className="text-pink-500" />
              My Profile
            </h2>
            <p className="text-sm text-gray-500 mt-1">View and manage your profile information</p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2">
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-all flex items-center gap-2">
                  <FaSave /> Save
                </button>
                <button onClick={() => { setIsEditing(false); setFormData(doctor); }} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-400 transition-all flex items-center gap-2">
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {doctor?.name?.charAt(0).toUpperCase() || "D"}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{doctor?.name}</h3>
              <p className="text-gray-500">{doctor?.specialization || "Gynecologist"}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">● Online</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Verified</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Full Name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.name}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.email}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Specialization</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.specialization || ""}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.specialization || "Not specified"}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Phone</p>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.phone || "Not provided"}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Hospital</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.hospital || ""}
                  onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.hospital || "Not specified"}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Experience</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.experience || ""}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="e.g., 5 years"
                  className="w-full mt-1 px-3 py-1 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="font-semibold text-gray-800">{doctor?.experience || "Not specified"}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-700">⚠️ Editing your profile will update your information across all pages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ label, icon, to, active, onClick, badge }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm ${
      active ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg" : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium flex-1">{label}</span>
    {badge > 0 && (
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-white/30 text-white" : "bg-red-500 text-white"}`}>
        {badge}
      </span>
    )}
  </Link>
);

export default DoctorProfile;