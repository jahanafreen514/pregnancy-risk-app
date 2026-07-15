// AdminSettings.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  Settings,
  Save,
  Moon,
  Bell,
  Globe,
  Lock,
  Shield,
  Key,
  Mail,
} from "lucide-react";

const AdminSettings = () => {
  const [admin, setAdmin] = useState(null);
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

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setAdmin(currentUser);
    const saved = JSON.parse(localStorage.getItem("adminSettings"));
    if (saved) {
      setSettings(prev => ({ ...prev, ...saved }));
    }
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const toggleSwitch = (name) => {
    setSettings({ ...settings, [name]: !settings[name] });
  };

  const saveSettings = () => {
    if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const settingsToSave = { ...settings };
    delete settingsToSave.currentPassword;
    delete settingsToSave.newPassword;
    delete settingsToSave.confirmPassword;
    
    localStorage.setItem("adminSettings", JSON.stringify(settingsToSave));

    if (settings.newPassword) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map(u =>
        u.id === admin?.id ? { ...u, password: settings.newPassword } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }

    alert("Settings saved successfully!");
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <Settings className="text-pink-500" />
              Settings
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage your preferences and settings</p>
          </div>
          <button
            onClick={saveSettings}
            className="bg-gradient-to-r from-pink-500 to-sky-400 text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6 space-y-8">
          {/* Dark Mode */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Moon className="text-indigo-500" />
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
                <Bell className="text-pink-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Push Notifications</h3>
                <p className="text-gray-500 text-sm">Receive system notifications</p>
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
                <Mail className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Email Notifications</h3>
                <p className="text-gray-500 text-sm">Receive email updates</p>
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
              <Globe className="text-gray-500" /> Language
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
            </select>
          </div>

          {/* Change Password */}
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-800">
              <Key className="text-gray-500" /> Change Password
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
              <Shield className="text-green-500" />
              <div>
                <p className="font-semibold text-green-700">Account Security</p>
                <p className="text-sm text-green-600">Your account is secure. Use a strong password to keep it safe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;