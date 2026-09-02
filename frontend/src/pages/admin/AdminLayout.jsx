// src/pages/admin/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserCog,
  FileText,
  MessageSquare,
  Server,
  Settings,
  LogOut,
  RefreshCw,
  Activity,
  Bell,
  AlertTriangle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import bg from "../../assets/images/bg.png";
import api from "../../services/api";

const AdminLayout = ({ children, activeTab: propActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState(propActiveTab || "dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalReports: 0,
    totalFeedbacks: 0,
  });
  const [statsState, setStatsState] = useState("loading");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/admin-login");
      return;
    }
    setAdmin(currentUser);

    // Update active tab from URL
    const path = location.pathname.split("/").pop() || "dashboard";
    setActiveTab(path);
    
    loadStats();
  }, [location]);

  useEffect(() => {
    const refreshId = window.setInterval(loadStats, 30_000);
    return () => window.clearInterval(refreshId);
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get("/admin/system-status");
      setStats(response.data);
      setStatsState("ready");
    } catch (error) {
      console.error("Admin stats unavailable", error);
      setStatsState("unavailable");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/admin-login");
  };

  // Navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/admin-dashboard" },
    { id: "users", label: "Users", icon: <Users className="w-5 h-5" />, path: "/admin-users", badge: stats.totalUsers },
    { id: "doctors", label: "Doctors", icon: <UserCog className="w-5 h-5" />, path: "/admin-doctors", badge: stats.totalDoctors },
    { id: "reports", label: "Reports", icon: <FileText className="w-5 h-5" />, path: "/admin-reports", badge: stats.totalReports },
    { id: "feedback", label: "Feedback", icon: <MessageSquare className="w-5 h-5" />, path: "/feedback", badge: stats.totalFeedbacks },
    { id: "systemstatus", label: "System Status", icon: <Server className="w-5 h-5" />, path: "/admin-systemstatus" },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/admin-settings" },
  ];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Glass Overlay */}
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-0"></div>

      {/* Floating Blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse z-0"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse z-0" style={{ animationDelay: "2s" }}></div>
      <div className="fixed top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse z-0" style={{ animationDelay: "1s" }}></div>

      <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle admin navigation" className="fixed left-4 top-4 z-[70] rounded-xl bg-white p-3 text-pink-600 shadow-lg lg:hidden">{sidebarOpen ? <X /> : <Menu />}</button>
      {sidebarOpen && <button onClick={() => setSidebarOpen(false)} aria-label="Close admin navigation" className="fixed inset-0 z-[45] bg-slate-900/30 lg:hidden" />}
      {/* SIDEBAR */}
      <div id="admin-shared-sidebar" className={`fixed left-0 top-0 h-screen w-72 bg-white/95 backdrop-blur-2xl border-r border-pink-100/50 flex flex-col z-50 overflow-y-auto transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-pink-100/50 flex-shrink-0">
          <Link to="/admin-dashboard" className="block">
            <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </Link>
          <div className="mt-4 flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-sky-50 rounded-2xl border border-pink-100/30">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{admin?.name || "Admin"}</p>
              <p className="text-xs text-gray-500 truncate">{admin?.email || "admin@glowcare.com"}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Online</span>
          </div>
        </div>

        {/* Live database totals */}
        <div className="px-4 py-2 border-b border-pink-100/50 bg-pink-50/30 flex-shrink-0">
          <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-gray-600">Live records</span>
            </span>
            <span className="text-gray-500">
              👤 {stats.totalUsers} users | 👨‍⚕️ {stats.totalDoctors} doctors
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"
                  : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === item.id ? "bg-white/30 text-white" : "bg-red-500 text-white"}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-pink-100/50 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 px-4 py-2.5 rounded-xl hover:bg-pink-100 transition-all duration-300 text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 relative z-10 lg:ml-72">
        <div className="min-h-screen p-4 pt-20 sm:p-6 lg:pt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
