// AdminDashboard.jsx - Complete with all pages
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  UserCog,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Bell,
  ArrowUp,
  ArrowDown,
  Eye,
  RefreshCw,
  Download,
  Home,
  Settings,
  LogOut,
  CalendarCheck,
  Server,
  AlertCircle,
  Shield,
  UserPlus,
  Calendar,
} from "lucide-react";
import bg from "../../assets/images/bg.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalReports: 0,
    totalFeedbacks: 0,
    highRiskCases: 0,
    moderateRiskCases: 0,
    lowRiskCases: 0,
    newUsersToday: 0,
    newReportsToday: 0,
    pendingAlerts: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState({ high: 0, moderate: 0, low: 0 });

  useEffect(() => {
    const path = location.pathname.split("/").pop() || "dashboard";
    setActiveTab(path);
  }, [location]);

  // Load all data from localStorage
  const loadData = () => {
    setLoading(true);

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const doctors = allUsers.filter(u => u.role === "doctor");

    let allAppointments = [];
    const possibleKeys = ['appointments', 'doctorAppointmentRequests', 'appointmentRequests'];
    for (const key of possibleKeys) {
      const data = JSON.parse(localStorage.getItem(key));
      if (data && Array.isArray(data) && data.length > 0) {
        allAppointments = data;
        break;
      }
    }

    const reportList = [];
    allUsers.forEach(user => {
      const riskData = JSON.parse(localStorage.getItem(`riskData_${user.email}`));
      if (riskData) {
        reportList.push({
          ...riskData,
          userName: user.name || "Unknown",
          userEmail: user.email,
          date: riskData.createdAt || new Date().toISOString(),
        });
      }
    });

    const feedbackList = JSON.parse(localStorage.getItem("feedbacks")) || [];

    const highRisk = reportList.filter(r => r.risk?.toLowerCase() === "high").length;
    const moderateRisk = reportList.filter(r => r.risk?.toLowerCase() === "moderate" || r.risk?.toLowerCase() === "medium").length;
    const lowRisk = reportList.filter(r => r.risk?.toLowerCase() === "low").length;
    const pendingAppointments = allAppointments.filter(a => a.status?.toLowerCase() === "pending").length;

    const today = new Date().toDateString();
    const todayUsers = allUsers.filter(u => {
      const userDate = new Date(u.createdAt || Date.now()).toDateString();
      return userDate === today;
    });

    const todayReports = reportList.filter(r => {
      const reportDate = new Date(r.date).toDateString();
      return reportDate === today;
    });

    const growthData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toDateString();
      const count = allUsers.filter(u => {
        const userDate = new Date(u.createdAt || Date.now()).toDateString();
        return userDate === dayStr;
      }).length;
      growthData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        users: count,
      });
    }
    setUserGrowth(growthData);

    setRiskDistribution({ high: highRisk, moderate: moderateRisk, low: lowRisk });

    const alertList = reportList
      .filter(r => r.risk?.toLowerCase() === "high" || r.risk?.toLowerCase() === "moderate")
      .slice(0, 5)
      .map(r => ({
        ...r,
        time: r.date,
        read: false,
      }));
    setAlerts(alertList);

    setStats({
      totalUsers: allUsers.length,
      totalDoctors: doctors.length,
      totalAppointments: allAppointments.length,
      totalReports: reportList.length,
      totalFeedbacks: feedbackList.length,
      highRiskCases: highRisk,
      moderateRiskCases: moderateRisk,
      lowRiskCases: lowRisk,
      pendingAppointments: pendingAppointments,
      newUsersToday: todayUsers.length,
      newReportsToday: todayReports.length,
      pendingAlerts: highRisk + moderateRisk,
    });

    setRecentUsers(allUsers.slice(0, 5));
    setRecentReports(reportList.slice(0, 5));
    setRecentFeedbacks(feedbackList.slice(0, 3));
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/admin-login");
      return;
    }
    setAdmin(currentUser);
    loadData();

    const handleStorageChange = () => loadData();
    const handleDataUpdate = () => loadData();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("dataUpdated", handleDataUpdate);
    window.addEventListener("appointmentUpdated", handleDataUpdate);

    const interval = setInterval(loadData, 15000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("dataUpdated", handleDataUpdate);
      window.removeEventListener("appointmentUpdated", handleDataUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/admin-login");
  };

  const getRiskBadge = (risk) => {
    const styles = {
      high: "bg-red-100 text-red-700 border-red-200",
      moderate: "bg-orange-100 text-orange-700 border-orange-200",
      medium: "bg-orange-100 text-orange-700 border-orange-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return styles[risk?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getGradient = (index) => {
    const gradients = [
      "from-pink-500 to-rose-400",
      "from-sky-500 to-blue-400",
      "from-purple-500 to-indigo-400",
      "from-green-500 to-emerald-400",
      "from-orange-500 to-amber-400",
    ];
    return gradients[index % gradients.length];
  };

  // Navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/admin-dashboard" },
    { id: "users", label: "Users", icon: <Users className="w-5 h-5" />, path: "/admin-users", badge: stats.newUsersToday },
    { id: "doctors", label: "Doctors", icon: <UserCog className="w-5 h-5" />, path: "/admin-doctors", badge: stats.totalDoctors },
    { id: "reports", label: "Reports", icon: <FileText className="w-5 h-5" />, path: "/admin-reports", badge: stats.highRiskCases },
    { id: "feedback", label: "Feedback", icon: <MessageSquare className="w-5 h-5" />, path: "/feedback", badge: stats.totalFeedbacks },
    { id: "system-status", label: "System Status", icon: <Server className="w-5 h-5" />, path: "/admin-systemstatus" },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/admin-settings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render different content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return <AdminUsersPage users={recentUsers} loadData={loadData} />;
      case "doctors":
        return <AdminDoctorsPage doctors={recentUsers.filter(u => u.role === "doctor")} loadData={loadData} />;
      case "reports":
        return <AdminReportsPage reports={recentReports} loadData={loadData} getRiskBadge={getRiskBadge} />;
      case "feedback":
        return <AdminFeedbackPage feedbacks={recentFeedbacks} loadData={loadData} />;
      case "system-status":
        return <AdminSystemStatusPage loadData={loadData} stats={stats} alerts={alerts} />;
      case "settings":
        return <AdminSettingsPage admin={admin} loadData={loadData} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <Activity className="text-pink-500" />
            Admin Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-pink-500">{admin?.name}</span> 👋
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={loadData}
            className="bg-gradient-to-r from-pink-500 to-sky-400 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-pink-100 text-gray-600 text-sm font-medium hover:bg-pink-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} subtitle={`${stats.newUsersToday} new today`} icon={<Users className="w-6 h-6" />} color="pink" />
        <StatCard title="Doctors" value={stats.totalDoctors} subtitle={`${stats.totalDoctors} active`} icon={<UserCog className="w-6 h-6" />} color="sky" />
        <StatCard title="Reports" value={stats.totalReports} subtitle={`${stats.newReportsToday} new today`} icon={<FileText className="w-6 h-6" />} color="purple" />
        <StatCard title="Feedbacks" value={stats.totalFeedbacks} subtitle={`${stats.totalFeedbacks} reviews`} icon={<MessageSquare className="w-6 h-6" />} color="green" />
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskCard title="High Risk Cases" value={stats.highRiskCases} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
        <RiskCard title="Moderate Risk" value={stats.moderateRiskCases} icon={<Clock className="w-5 h-5" />} color="orange" />
        <RiskCard title="Low Risk" value={stats.lowRiskCases} icon={<CheckCircle className="w-5 h-5" />} color="green" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-pink-100/50 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-500" />
            User Growth (Last 7 Days)
          </h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {userGrowth.map((item, index) => {
              const maxValue = Math.max(...userGrowth.map(d => d.users), 1);
              const height = (item.users / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full rounded-t-lg bg-gradient-to-t ${getGradient(index)} transition-all duration-500`} style={{ height: `${Math.max(height, 10)}%` }} />
                  <span className="text-[10px] text-gray-400">{item.day}</span>
                  <span className="text-[10px] font-semibold text-gray-600">{item.users}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-pink-100/50 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-pink-500" />
            Risk Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600 font-medium">High Risk</span>
                <span className="font-bold">{riskDistribution.high}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(riskDistribution.high / Math.max(stats.totalReports, 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-orange-600 font-medium">Moderate Risk</span>
                <span className="font-bold">{riskDistribution.moderate}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(riskDistribution.moderate / Math.max(stats.totalReports, 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600 font-medium">Low Risk</span>
                <span className="font-bold">{riskDistribution.low}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(riskDistribution.low / Math.max(stats.totalReports, 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-pink-100/50 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-500" />
              Recent Users
            </h3>
            <Link to="/admin-users" className="text-sm text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1">
              View All <Eye className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-pink-50/30 rounded-xl border border-pink-100/30 hover:bg-pink-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{user.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${user.role === "doctor" ? "bg-sky-100 text-sky-700" : user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-pink-100 text-pink-700"}`}>
                  {user.role || "User"}
                </span>
              </div>
            ))}
            {recentUsers.length === 0 && <p className="text-center text-gray-400 py-4">No users registered yet</p>}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-pink-100/50 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-500" />
              Recent Reports
            </h3>
            <Link to="/admin-reports" className="text-sm text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1">
              View All <Eye className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-pink-50/30 rounded-xl border border-pink-100/30 hover:bg-pink-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(report.userName)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{report.userName}</p>
                    <p className="text-xs text-gray-500">Score: {report.score || 0}%</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${getRiskBadge(report.risk)}`}>
                  {report.risk || "Unknown"} Risk
                </span>
              </div>
            ))}
            {recentReports.length === 0 && <p className="text-center text-gray-400 py-4">No reports available</p>}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-pink-100/50 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-pink-500" />
            Recent Alerts
            {stats.pendingAlerts > 0 && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                {stats.pendingAlerts} pending
              </span>
            )}
          </h3>
          <Link to="/admin-alerts" className="text-sm text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1">
            View All <Eye className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50/30 rounded-xl border border-red-100/30 hover:bg-red-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{alert.userName}</p>
                  <p className="text-xs text-gray-500">{alert.userEmail}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alert.symptoms?.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full border ${getRiskBadge(alert.risk)}`}>
                  {alert.risk} Risk
                </span>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(alert.time).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400">No alerts - All clear!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Feedbacks */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-pink-100/50 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pink-500" />
            Recent Feedbacks
          </h3>
          <Link to="/feedback" className="text-sm text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1">
            View All <Eye className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentFeedbacks.map((feedback, index) => (
            <div key={index} className="p-4 bg-pink-50/30 rounded-xl border border-pink-100/30 hover:bg-pink-50/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-xs">
                  {getInitials(feedback.userName)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{feedback.userName}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < (feedback.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{feedback.comment}</p>
              <p className="text-[10px] text-gray-400 mt-2">{feedback.date}</p>
            </div>
          ))}
          {recentFeedbacks.length === 0 && <p className="text-center text-gray-400 py-4 col-span-3">No feedbacks yet</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
        <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
      </div>
    </div>
  );

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

      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 h-screen w-72 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 flex flex-col z-50">
        <div className="p-5 border-b border-pink-100/50">
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

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setActiveTab(item.id)}
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

        <div className="p-3 border-t border-pink-100/50">
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
      <div className="flex-1 ml-72 relative z-10">
        <div className="p-6 min-h-screen overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// ===== STATCARD COMPONENT =====
const StatCard = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    pink: "from-pink-100 to-pink-200 text-pink-500",
    sky: "from-sky-100 to-sky-200 text-sky-500",
    purple: "from-purple-100 to-purple-200 text-purple-500",
    green: "from-green-100 to-green-200 text-green-500",
    red: "from-red-100 to-red-200 text-red-500",
    orange: "from-orange-100 to-orange-200 text-orange-500",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

// ===== RISKCARD COMPONENT =====
const RiskCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

// ===== ADMIN USERS PAGE =====
const AdminUsersPage = ({ users, loadData }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
        <Users className="text-pink-500" /> Users Management
      </h2>
      <button onClick={loadData} className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2">
        <RefreshCw className="w-4 h-4" /> Refresh
      </button>
    </div>
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pink-100">
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">User</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Email</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Role</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                <td className="py-3 px-3 font-medium text-gray-800">{user.name || "Unknown"}</td>
                <td className="py-3 px-3 text-gray-600">{user.email}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${user.role === "doctor" ? "bg-sky-100 text-sky-700" : user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-pink-100 text-pink-700"}`}>
                    {user.role || "User"}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="4" className="text-center py-8 text-gray-400">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ===== ADMIN DOCTORS PAGE =====
const AdminDoctorsPage = ({ doctors, loadData }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
        <UserCog className="text-pink-500" /> Doctors Management
      </h2>
      <button onClick={loadData} className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2">
        <RefreshCw className="w-4 h-4" /> Refresh
      </button>
    </div>
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pink-100">
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Doctor</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Email</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Specialization</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={index} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                <td className="py-3 px-3 font-medium text-gray-800">{doctor.name || "Unknown"}</td>
                <td className="py-3 px-3 text-gray-600">{doctor.email}</td>
                <td className="py-3 px-3 text-gray-600">{doctor.specialization || "General"}</td>
                <td className="py-3 px-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && <tr><td colSpan="4" className="text-center py-8 text-gray-400">No doctors found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ===== ADMIN REPORTS PAGE =====
const AdminReportsPage = ({ reports, loadData, getRiskBadge }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
        <FileText className="text-pink-500" /> Reports
      </h2>
      <button onClick={loadData} className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2">
        <RefreshCw className="w-4 h-4" /> Refresh
      </button>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      {reports.map((report, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-2xl rounded-2xl p-5 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-800">{report.userName}</h4>
              <p className="text-xs text-gray-500">{report.userEmail}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full border ${getRiskBadge(report.risk)}`}>
              {report.risk || "Low"} Risk
            </span>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Risk Score</span>
              <span className="font-semibold">{report.score || 0}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Symptoms</span>
              <span className="text-gray-600">{report.symptoms?.length || 0} reported</span>
            </div>
            {report.symptoms && report.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {report.symptoms.slice(0, 3).map((s, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full">{s}</span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-3 text-[10px] text-gray-400">Updated: {new Date(report.date).toLocaleDateString()}</div>
        </div>
      ))}
      {reports.length === 0 && <div className="col-span-2 text-center py-12 text-gray-400">No reports available</div>}
    </div>
  </div>
);

// ===== ADMIN FEEDBACK PAGE =====
const AdminFeedbackPage = ({ feedbacks, loadData }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
        <MessageSquare className="text-pink-500" /> Feedback
      </h2>
      <button onClick={loadData} className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2">
        <RefreshCw className="w-4 h-4" /> Refresh
      </button>
    </div>
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
      <div className="space-y-4">
        {feedbacks.map((feedback, index) => (
          <div key={index} className="p-4 bg-pink-50/30 rounded-xl border border-pink-100/30 hover:bg-pink-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                {feedback.userName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{feedback.userName || "Anonymous"}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < (feedback.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{feedback.comment}</p>
            <p className="mt-1 text-xs text-gray-400">{feedback.date}</p>
          </div>
        ))}
        {feedbacks.length === 0 && <p className="text-center text-gray-400 py-8">No feedbacks yet</p>}
      </div>
    </div>
  </div>
);

// ===== ADMIN SYSTEM STATUS PAGE =====
const AdminSystemStatusPage = ({ loadData, stats, alerts }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
        <Server className="text-pink-500" /> System Status
      </h2>
      <button onClick={loadData} className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2">
        <RefreshCw className="w-4 h-4" /> Refresh
      </button>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">System Status</p>
            <p className="text-lg font-bold text-green-600">Operational</p>
          </div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-lg font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Alerts</p>
            <p className="text-lg font-bold text-red-600">{alerts.length}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">System Health Metrics</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Response Time</p>
          <p className="text-xl font-bold text-green-600">120ms</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Uptime</p>
          <p className="text-xl font-bold text-green-600">99.9%</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Reports</p>
          <p className="text-xl font-bold text-purple-600">{stats.totalReports}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Active Users Today</p>
          <p className="text-xl font-bold text-blue-600">{stats.newUsersToday}</p>
        </div>
      </div>
    </div>
  </div>
);

// ===== ADMIN SETTINGS PAGE =====
const AdminSettingsPage = ({ admin, loadData }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
        <Settings className="text-pink-500" /> Settings
      </h2>
      <button className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 transition-all flex items-center gap-2">
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>

    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-full">
            <Shield className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="font-bold text-gray-800">Admin Profile</p>
            <p className="text-sm text-gray-500">{admin?.name} • {admin?.email}</p>
          </div>
        </div>
        <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">Edit Profile</button>
      </div>

      <div className="border-t border-pink-100/50 pt-4">
        <h3 className="font-bold text-gray-800 mb-3">Preferences</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Dark Mode</span>
            <input type="checkbox" className="w-5 h-5 accent-pink-500" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Email Notifications</span>
            <input type="checkbox" className="w-5 h-5 accent-pink-500" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Missing import
const Save = ({ className }) => <Settings className={className} />;

export default AdminDashboard;