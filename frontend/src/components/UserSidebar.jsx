import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBell,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaFileMedical,
  FaHeartbeat,
  FaLightbulb,
  FaNotesMedical,
  FaUser,
  FaBaby,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

const links = [
  ["Dashboard", "/dashboard", FaHeartbeat],
  ["Reports", "/reports", FaFileMedical],
  ["Prescriptions", "/prescriptions", FaFileMedical],
  ["Pregnancy Toolkit", "/toolkit", FaBaby],
  ["Symptoms", "/symptoms", FaNotesMedical],
  ["Suggestions", "/suggestions", FaLightbulb],
  ["Prediction", "/prediction", FaChartLine],
  ["Alerts", "/alerts", FaBell],
  ["Appointments", "/appointment", FaCalendarAlt],
  ["Reminders", "/reminders", FaBell],
  ["Feedback", "/share-feedback", FaLightbulb],
  ["Profile", "/profile", FaUser],
  ["Settings", "/settings", FaCog],
];

export default function UserSidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    setCurrentUser(user);
  }, [pathname]);

  // Lock body scroll on small screens when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile & Tablet Top Bar (Visible only on < lg screens) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-pink-100/70 z-40 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 flex items-center justify-center transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            {open ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center text-white shadow-md">
              <FaHeartbeat className="text-base animate-pulse" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 bg-clip-text text-transparent">
              GlowCare
            </span>
          </Link>
        </div>

        <Link
          to="/profile"
          className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-md"
        >
          {currentUser?.name?.charAt(0).toUpperCase() || "U"}
        </Link>
      </header>

      {/* Backdrop for mobile drawer */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Navigation Drawer (Slide-out on mobile/tablet, fixed docked rail on desktop) */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 lg:w-64 flex-col border-r border-pink-100/70 bg-white/95 lg:bg-white/85 p-5 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100/50">
          <Link to="/dashboard" onClick={() => setOpen(false)} className="block">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center text-white shadow-md">
                <FaHeartbeat className="text-lg animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                  GlowCare
                </h1>
                <p className="text-[11px] text-gray-500 font-medium">Maternal Health System</p>
              </div>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="lg:hidden w-8 h-8 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="my-3 p-3 rounded-2xl bg-gradient-to-r from-pink-50/80 to-sky-50/80 border border-pink-100/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow">
            {currentUser?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">
              {currentUser?.name || "Patient"}
            </p>
            <p className="text-xs text-gray-500 truncate">{currentUser?.email || "User Portal"}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto py-2 pr-1">
          {links.map(([label, path, Icon]) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 text-white shadow-md shadow-pink-200"
                    : "text-gray-700 hover:bg-pink-50/80 hover:text-pink-600"
                }`}
              >
                <Icon className={`text-base ${isActive ? "text-white" : "text-pink-500"}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer with Logout */}
        <div className="pt-3 border-t border-pink-100/60 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-bold text-pink-600 hover:bg-pink-100 transition-colors shadow-sm"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
