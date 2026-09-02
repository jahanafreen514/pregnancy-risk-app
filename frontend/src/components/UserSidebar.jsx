import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBell, FaCalendarAlt, FaChartLine, FaCog, FaFileMedical, FaHeartbeat, FaLightbulb, FaNotesMedical, FaUser, FaBaby, FaBars, FaTimes } from "react-icons/fa";

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
  return <>
    <button onClick={() => setOpen(!open)} aria-label="Toggle navigation" className="fixed left-4 top-4 z-50 rounded-xl bg-white p-3 text-pink-600 shadow-lg lg:hidden">{open ? <FaTimes /> : <FaBars />}</button>
    {open && <button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" />}
    <aside className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-pink-100/50 bg-white/95 p-5 shadow-xl backdrop-blur-2xl transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
    <Link to="/dashboard"><h1 className="text-2xl font-bold text-pink-500">GlowCare</h1><p className="text-sm text-gray-500">Maternal Health System</p></Link>
    <nav className="mt-8 flex-1 space-y-2 overflow-y-auto">{links.map(([label, path, Icon]) => <Link onClick={() => setOpen(false)} key={path} to={path} className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-all ${pathname === path ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg" : "text-gray-700 hover:bg-pink-100"}`}><Icon />{label}</Link>)}</nav>
    <button onClick={() => { localStorage.removeItem("currentUser"); localStorage.removeItem("token"); window.location.href = "/login"; }} className="rounded-xl bg-pink-100 px-5 py-2 font-semibold text-pink-600 hover:bg-pink-200">Logout</button>
  </aside></>;
}
