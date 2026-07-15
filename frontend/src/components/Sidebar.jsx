import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  UserCog,
  Stethoscope,
  MessageSquare,
  ShieldCheck,
  Activity,
  Bell,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const menuItems = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/admin-dashboard",
  },
  {
    icon: <Users size={20} />,
    name: "Users",
    path: "/admin-users",
  },
  {
    icon: <UserCog size={20} />,
    name: "Doctors",
    path: "/admin-doctors",
  },
  {
    icon: <Stethoscope size={20} />,
    name: "Patient Reports",
    path: "/admin-reports",
  },
  {
    icon: <MessageSquare size={20} />,
    name: "Feedbacks",
    path: "/feedback",
  },
  {
    icon: <Bell size={20} />,
    name: "Alerts",
    path: "/admin-alerts",
  },
  {
    icon: <ShieldCheck size={20} />,
    name: "Admin Settings",
    path: "/admin-settings",
  },
  {
    icon: <Activity size={20} />,
    name: "System Logs",
    path: "/admin/logs",
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Administrator");
  const [adminEmail, setAdminEmail] = useState("admin@glowcare.com");
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalReports: 0,
  });

  useEffect(() => {
    // Load real data from localStorage
    const loadStats = () => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const doctors = users.filter(u => u.role === "doctor");
      const patients = users.filter(u => u.role === "user" || !u.role);
      
      // Count reports
      let reportCount = 0;
      users.forEach(user => {
        const riskData = JSON.parse(localStorage.getItem(`riskData_${user.email}`));
        if (riskData) reportCount++;
      });

      setStats({
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        totalReports: reportCount,
      });
    };

    // Load admin info
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setAdminName(currentUser.name || "Administrator");
      setAdminEmail(currentUser.email || "admin@glowcare.com");
    }

    loadStats();

    // Refresh stats every 10 seconds
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/admin-login");
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-white border-r shadow-lg overflow-y-auto z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-sky-400 p-5">
        <h1 className="text-2xl font-bold text-white">GlowCare</h1>
        <p className="text-pink-100 text-sm">Admin Panel</p>
      </div>

      {/* Admin Info */}
      <div className="px-4 py-3 border-b border-pink-100/50 bg-pink-50/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{adminName}</p>
            <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-3 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `
              flex items-center gap-3
              px-3 py-2.5
              rounded-xl
              mb-1
              transition-all
              duration-300
              text-sm
              ${
                isActive
                  ? "bg-gradient-to-r from-pink-50 to-sky-50 text-pink-600 font-semibold shadow-sm border border-pink-100/50"
                  : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
              }
              `
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="px-3 py-2 border-t border-pink-100/50 bg-pink-50/20">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-1.5 bg-white/60 rounded-lg">
            <p className="text-sm font-bold text-pink-500">{stats.totalDoctors}</p>
            <p className="text-[8px] text-gray-500">Doctors</p>
          </div>
          <div className="text-center p-1.5 bg-white/60 rounded-lg">
            <p className="text-sm font-bold text-sky-500">{stats.totalPatients}</p>
            <p className="text-[8px] text-gray-500">Patients</p>
          </div>
          <div className="text-center p-1.5 bg-white/60 rounded-lg">
            <p className="text-sm font-bold text-purple-500">{stats.totalReports}</p>
            <p className="text-[8px] text-gray-500">Reports</p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-pink-100/50">
        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            border
            border-pink-200
            rounded-xl
            py-2.5
            text-gray-700
            hover:bg-pink-50
            hover:border-pink-300
            transition-all
            duration-300
            text-sm
            font-medium
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;