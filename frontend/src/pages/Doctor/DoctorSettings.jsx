// DoctorSettings.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCog,
  FaChartLine,
  FaUsers,
  FaCalendarCheck,
  FaFileMedical,
  FaPrescription,
  FaBell,
  FaUserMd,
  FaSignOutAlt,
  FaSpinner,
  FaSave,
  FaMoon,
  FaGlobe,
  FaLock,
  FaBell as FaBellIcon,
  FaEnvelope,
  FaShieldAlt,
  FaDatabase,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const DoctorSettings = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailNotifications: true,
    language: "English",
    timezone: "UTC",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "doctor") {
      navigate("/doctor-login");
      return;
    }
    setDoctor(currentUser);
    
    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem("doctorSettings"));
    if (savedSettings) {
      setSettings({...settings, ...savedSettings});
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const toggleSwitch = (name) => {
    setSettings({
      ...settings,
      [name]: !settings[name],
    });
  };

  const saveSettings = () => {
    // Validate password
    if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Save settings
    const settingsToSave = { ...settings };
    delete settingsToSave.currentPassword;
    delete settingsToSave.newPassword;
    delete settingsToSave.confirmPassword;
    
    localStorage.setItem("doctorSettings", JSON.stringify(settingsToSave));
    
    // Update password if provided
    if (settings.newPassword) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map(u =>
        u.id === doctor.id ? { ...u, password: settings.newPassword } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
    
    alert("Settings saved successfully!");
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
              <FaCog className="text-pink-500" />
              Settings
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage your preferences and settings</p>
          </div>
          <button onClick={saveSettings} className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2">
            <FaSave /> Save Settings
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6 space-y-8">
          {/* Dark Mode */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <FaMoon className="text-indigo-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Dark Mode</h3>
                <p className="text-gray-500 text-sm">Enable dark theme for better visibility</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => toggleSwitch("darkMode")}
              className="w-5 h-5 accent-pink-500"
            />
          </div>

          {/* Notifications */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-pink-100 p-2 rounded-full">
                <FaBellIcon className="text-pink-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Push Notifications</h3>
                <p className="text-gray-500 text-sm">Receive appointment alerts and updates</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => toggleSwitch("notifications")}
              className="w-5 h-5 accent-pink-500"
            />
          </div>

          {/* Email Notifications */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <FaEnvelope className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Email Notifications</h3>
                <p className="text-gray-500 text-sm">Receive email updates about appointments</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => toggleSwitch("emailNotifications")}
              className="w-5 h-5 accent-pink-500"
            />
          </div>

          {/* Language */}
          <div>
            <label className="font-bold flex items-center gap-2 mb-3 text-gray-800">
              <FaGlobe className="text-gray-500" /> Language
            </label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="border border-pink-100 rounded-xl p-3 w-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option>English</option>
              <option>Telugu</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="font-bold flex items-center gap-2 mb-3 text-gray-800">
              <FaDatabase className="text-gray-500" /> Timezone
            </label>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="border border-pink-100 rounded-xl p-3 w-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
              <option>IST</option>
              <option>GMT</option>
            </select>
          </div>

          {/* Change Password */}
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-800">
              <FaLock className="text-gray-500" /> Change Password
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                value={settings.currentPassword}
                onChange={handleChange}
                className="border border-pink-100 rounded-xl p-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                value={settings.newPassword}
                onChange={handleChange}
                className="border border-pink-100 rounded-xl p-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={settings.confirmPassword}
                onChange={handleChange}
                className="border border-pink-100 rounded-xl p-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            {settings.newPassword && settings.confirmPassword && settings.newPassword !== settings.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">Passwords do not match!</p>
            )}
          </div>

          {/* Security */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-green-500 text-xl" />
              <div>
                <p className="font-semibold text-green-700">Account Security</p>
                <p className="text-sm text-green-600">Your account is secure. Use a strong password to keep it safe.</p>
              </div>
            </div>
          </div>
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

export default DoctorSettings;