// DoctorNotifications.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaSearch,
  FaChartLine,
  FaUsers,
  FaCalendarCheck,
  FaFileMedical,
  FaPrescription,
  FaUserMd,
  FaCog,
  FaSignOutAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaClock,
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheck,
  FaTrash,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const DoctorNotifications = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("notifications");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "doctor") {
      navigate("/doctor-login");
      return;
    }
    setDoctor(currentUser);
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/notifications", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (!response.ok) throw new Error("Unable to load notifications");
      const notifs = (await response.json()).map(item => ({ ...item, type: item.category, read: item.is_read, createdAt: item.created_at }));
      setNotifications(notifs);
      setFilteredNotifications(notifs);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  // Filter notifications
  useEffect(() => {
    let filtered = [...notifications];
    
    if (filter === "unread") {
      filtered = filtered.filter(n => !n.read);
    } else if (filter === "read") {
      filtered = filtered.filter(n => n.read);
    }
    
    setFilteredNotifications(filtered);
  }, [filter, notifications]);

  // Listen for real-time updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "doctorNotifications" || e.key === "appointments" || e.key === "currentUser") {
        loadNotifications();
      }
    };

    const handleDataUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("dataUpdated", handleDataUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("dataUpdated", handleDataUpdate);
    };
  }, [doctor]);

  const markAsRead = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/notifications/${id}/read`, { method: "PATCH", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
  };

  const markAllAsRead = async () => {
    await Promise.all(notifications.filter(n => !n.read).map(n => fetch(`http://127.0.0.1:8000/api/notifications/${n.id}/read`, { method: "PATCH", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })));
    loadNotifications();
  };

  const deleteNotification = () => {
    // Notifications are an audit trail; marking as read is the safe dismissal action.
    loadNotifications();
  };

  const clearAll = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return <FaCalendarCheck className="text-blue-500" />;
      case "appointment_update":
        return <FaClock className="text-yellow-500" />;
      case "patient_update":
        return <FaUser className="text-green-500" />;
      case "reminder":
        return <FaBell className="text-purple-500" />;
      default:
        return <FaBell className="text-pink-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "appointment":
        return "bg-blue-50 border-blue-200";
      case "appointment_update":
        return "bg-yellow-50 border-yellow-200";
      case "patient_update":
        return "bg-green-50 border-green-200";
      case "reminder":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-pink-50 border-pink-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diff = Math.floor((now - date) / 1000 / 60);
      
      if (diff < 1) return "Just now";
      if (diff < 60) return `${diff}m ago`;
      if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
      if (diff < 10080) return `${Math.floor(diff / 1440)}d ago`;
      return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return dateString;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>

      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-pink-100/50 bg-white/80 backdrop-blur-2xl flex flex-col shadow-xl">
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
          <NavItem label="Notifications" icon={<FaBell />} to="/doctor-notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} badge={unreadCount} />
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
      <div className="relative z-10 ml-64 flex-1 px-4 sm:px-6 lg:px-8 py-4 h-full overflow-y-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaBell className="text-pink-500" />
              Notifications
            </h2>
            <p className="text-sm text-gray-500 mt-1">Stay updated with all your notifications</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-all">
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={clearAll} className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-all">
                Clear All
              </button>
            )}
            <button onClick={loadNotifications} className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaSpinner className={`${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <StatCard title="Total" value={notifications.length} icon={<FaBell />} color="pink" />
          <StatCard title="Unread" value={unreadCount} icon={<FaClock />} color="yellow" />
          <StatCard title="Read" value={notifications.filter(n => n.read).length} icon={<FaCheck />} color="green" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <div className="flex items-center px-3 text-sm text-gray-500">
            Showing {filteredNotifications.length} of {notifications.length}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FaBell className="text-4xl mx-auto mb-2 opacity-50" />
              <p className="font-medium">No notifications</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FaSearch className="text-4xl mx-auto mb-2 opacity-50" />
              <p className="font-medium">No notifications match your filter</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${getNotificationColor(notif.type)} ${!notif.read ? 'border-l-4 border-l-pink-500' : 'opacity-70'}`}
                >
                  <div className="text-2xl">{getNotificationIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{notif.title || "Notification"}</p>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        {notif.type === "call_request" && notif.metadata?.appointment_id && <Link to={`/call/${notif.metadata.appointment_id}`} className="mt-2 inline-block rounded-lg bg-gradient-to-r from-pink-500 to-sky-400 px-3 py-1.5 text-xs font-bold text-white">Open incoming call</Link>}
                        {notif.patientName && (
                          <p className="text-xs text-gray-400 mt-1">Patient: {notif.patientName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(notif.createdAt)}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-1"></div>
                  )}
                </div>
              ))}
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

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    pink: "bg-pink-100 text-pink-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-2">
        <div className={`${colorClasses[color]} p-2 rounded-full text-xs`}>
          {icon}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800">{value}</p>
          <p className="text-[10px] text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorNotifications;
