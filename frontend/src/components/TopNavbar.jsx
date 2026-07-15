import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, Settings, LogOut, Menu } from "lucide-react";

function TopNavbar() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const [adminAvatar, setAdminAvatar] = useState("A");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setAdminName(currentUser.name || "Admin");
      setAdminAvatar(currentUser.name?.charAt(0).toUpperCase() || "A");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-pink-100/50 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-xl hover:bg-pink-50 transition-colors">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 rounded-xl border border-pink-100 bg-white/90 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-pink-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-xl hover:bg-pink-50 transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-pink-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {adminAvatar}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{adminName}</span>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-pink-100/50 py-2 z-50">
              <div className="px-4 py-3 border-b border-pink-100/50">
                <p className="text-sm font-semibold text-gray-800">{adminName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-pink-50 transition-colors flex items-center gap-3">
                <User className="w-4 h-4" />
                Profile
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-pink-50 transition-colors flex items-center gap-3">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="border-t border-pink-100/50 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNavbar;