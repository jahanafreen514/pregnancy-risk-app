import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaBell, FaCalendarCheck, FaChartLine, FaCog, FaFileMedical, FaSignOutAlt, FaTimes, FaUserMd, FaUsers } from "react-icons/fa";

const links = [
  ["Dashboard", "/doctor-dashboard", FaChartLine],
  ["Patients", "/doctor-patients", FaUsers],
  ["Appointments", "/doctor-appointments", FaCalendarCheck],
  ["Reports", "/doctor-reports", FaFileMedical],
  ["Prescriptions", "/doctor-prescriptions", FaFileMedical],
  ["Notifications", "/doctor-notifications", FaBell],
  ["Profile", "/doctor-profile", FaUserMd],
  ["Settings", "/doctor-settings", FaCog],
];

// One shared navigation rail for every doctor route and screen size.
export default function DoctorSidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [doctor, setDoctor] = useState(() => JSON.parse(localStorage.getItem("currentUser") || "null"));
  React.useEffect(() => {
    const refresh = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("http://127.0.0.1:8000/api/doctors/me/profile", { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) return;
        const saved = await response.json();
        setDoctor(saved);
        localStorage.setItem("currentUser", JSON.stringify(saved));
      } catch { /* retain last known profile offline */ }
    };
    refresh();
    window.addEventListener("doctorProfileUpdated", refresh);
    return () => window.removeEventListener("doctorProfileUpdated", refresh);
  }, []);
  const logout = () => { localStorage.removeItem("currentUser"); localStorage.removeItem("token"); window.location.href = "/doctor-login"; };
  return <>
    <button onClick={() => setOpen(!open)} aria-label="Toggle doctor navigation" className="fixed left-4 top-4 z-[70] rounded-xl bg-white p-3 text-pink-600 shadow-lg lg:hidden">{open ? <FaTimes /> : <FaBars />}</button>
    {open && <button onClick={() => setOpen(false)} aria-label="Close doctor navigation" className="fixed inset-0 z-[55] bg-slate-900/30 lg:hidden" />}
    <aside className={`fixed left-0 top-0 z-[60] flex h-screen w-64 flex-col border-r border-pink-100 bg-white/95 p-5 shadow-2xl backdrop-blur-xl transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <Link onClick={() => setOpen(false)} to="/doctor-dashboard"><h1 className="text-2xl font-bold text-pink-500">GlowCare</h1><p className="text-sm text-gray-500">Doctor Portal</p></Link>
      <div className="mt-5 rounded-2xl bg-gradient-to-r from-pink-50 to-sky-50 p-3"><p className="truncate font-bold text-slate-800">Dr. {doctor?.name || "Doctor"}</p><p className="truncate text-xs text-slate-500">{doctor?.specialization || "Maternal health"}</p></div>
      <nav className="mt-8 flex-1 space-y-2 overflow-y-auto">{links.map(([label, path, Icon]) => <Link key={path} onClick={() => setOpen(false)} to={path} className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium ${pathname === path ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg" : "text-gray-700 hover:bg-pink-50"}`}><Icon />{label}</Link>)}</nav>
      <button onClick={logout} className="flex items-center justify-center gap-2 rounded-xl bg-pink-100 p-3 font-semibold text-pink-600"><FaSignOutAlt />Logout</button>
    </aside>
  </>;
}
