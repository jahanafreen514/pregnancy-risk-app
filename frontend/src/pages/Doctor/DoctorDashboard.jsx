import React, { useState, useEffect } from "react";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import {
  FaHeartbeat,
  FaStethoscope,
  FaMoon,
  FaGlobe,
  FaLock,
  FaSave,
  FaBaby,
  FaNotesMedical,
  FaLightbulb,
  FaChartLine,
  FaBell,
  FaCalendarAlt,
  FaUser,
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaFileMedical,
  FaAmbulance,
  FaHospitalAlt,
  FaPrescription,
  FaShieldAlt,
  FaVideo,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaArrowLeft,
  FaEdit,
  FaCog,
} from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [patientUpdates, setPatientUpdates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    highRiskPatients: 0,
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "doctor") {
      navigate("/doctor-login");
      return;
    }
    setDoctor(currentUser);
    loadLiveData();
  }, []);

  const loadLiveData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [appointmentsResponse, notificationsResponse, reportsResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/appointments/doctor", { headers }),
        fetch("http://127.0.0.1:8000/api/notifications", { headers }),
        fetch("http://127.0.0.1:8000/api/reports", { headers }),
      ]);
      const rawAppointments = appointmentsResponse.ok ? await appointmentsResponse.json() : [];
      const rawNotifications = notificationsResponse.ok ? await notificationsResponse.json() : [];
      const rawReports = reportsResponse.ok ? await reportsResponse.json() : [];
      const liveAppointments = rawAppointments.map(item => {
        const scheduled = new Date(item.scheduled_for);
        return { ...item, patientName: item.patient_name || "Patient", patientEmail: item.patient_email || "", date: scheduled.toLocaleDateString(), time: scheduled.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), type: item.appointment_type, notes: item.reason };
      });
      const liveNotifications = rawNotifications.map(item => ({ ...item, read: item.is_read, createdAt: new Date(item.created_at).toLocaleString() }));
      const liveReports = rawReports.map(item => ({ ...item, patient: item.patient_name || "Patient", risk: item.title?.match(/(High|Moderate|Low)/i)?.[0] || "Not assessed", score: item.risk_score || 0, symptoms: item.symptoms || [], updatedAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Today" }));
      setAppointments(liveAppointments);
      setNotifications(liveNotifications);
      setPatientUpdates(liveReports);
      setStats({
        totalPatients: new Set(liveAppointments.map(item => item.patient_id)).size,
        totalAppointments: liveAppointments.length,
        pendingAppointments: liveAppointments.filter(item => item.status === "pending").length,
        approvedAppointments: liveAppointments.filter(item => item.status === "accepted").length,
        completedAppointments: liveAppointments.filter(item => item.status === "completed").length,
        cancelledAppointments: liveAppointments.filter(item => ["cancelled", "rejected"].includes(item.status)).length,
        highRiskPatients: liveReports.filter(item => item.title?.includes("High")).length,
      });
    } catch (error) { console.error("Doctor dashboard API loading error", error); }
    finally { setLoading(false); }
  };

  const loadData = () => {
    // Try multiple possible keys for appointments
    let allAppointments = [];
    const possibleKeys = ['appointments', 'doctorAppointmentRequests', 'appointmentRequests'];
    
    for (const key of possibleKeys) {
      const data = JSON.parse(localStorage.getItem(key));
      if (data && Array.isArray(data) && data.length > 0) {
        allAppointments = data;
        console.log(`Found ${data.length} appointments in ${key}`);
        break;
      }
    }
    
    // If still no appointments, try to find them in users data
    if (allAppointments.length === 0) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const doctorUser = users.find(u => u.id === doctor?.id || u.email === doctor?.email);
      if (doctorUser && doctorUser.appointments) {
        allAppointments = doctorUser.appointments;
        console.log(`Found ${allAppointments.length} appointments in doctor user object`);
      }
    }
    
    console.log("All appointments:", allAppointments);
    console.log("Current doctor:", doctor);
    
    // Filter appointments for this specific doctor
    const doctorAppointments = allAppointments.filter(
      app => {
        // Check multiple possible fields for doctor identification
        const matchesDoctor = 
          app.doctorId === doctor?.id ||
          app.doctorId?.toString() === doctor?.id?.toString() ||
          app.doctorName === doctor?.name ||
          app.doctorName?.toLowerCase() === doctor?.name?.toLowerCase() ||
          app.doctorEmail === doctor?.email ||
          app.doctor === doctor?.name;
        
        return matchesDoctor;
      }
    );
    
    console.log("Filtered doctor appointments:", doctorAppointments);
    
    // Remove duplicates based on appointment ID
    const uniqueAppointments = [];
    const seenIds = new Set();
    
    for (const app of doctorAppointments) {
      if (app.id && !seenIds.has(app.id)) {
        seenIds.add(app.id);
        uniqueAppointments.push(app);
      }
    }
    
    setAppointments(uniqueAppointments);

    const updates = JSON.parse(localStorage.getItem("doctorPatientUpdates")) || [];
    setPatientUpdates(updates);

    const notifs = JSON.parse(localStorage.getItem("doctorNotifications")) || [];
    setNotifications(notifs);

    const total = uniqueAppointments.length;
    const pending = uniqueAppointments.filter(a => a.status?.toLowerCase() === "pending").length;
    const approved = uniqueAppointments.filter(a => a.status?.toLowerCase() === "approved").length;
    const completed = uniqueAppointments.filter(a => a.status?.toLowerCase() === "completed").length;
    const cancelled = uniqueAppointments.filter(a => a.status?.toLowerCase() === "cancelled" || a.status?.toLowerCase() === "rejected").length;
    const highRisk = updates.filter(p => p.risk?.toLowerCase() === "high").length;
    const uniquePatients = new Set(uniqueAppointments.map(a => a.patientEmail || a.patientId));
    
    setStats({
      totalPatients: uniquePatients.size,
      totalAppointments: total,
      pendingAppointments: pending,
      approvedAppointments: approved,
      completedAppointments: completed,
      cancelledAppointments: cancelled,
      highRiskPatients: highRisk,
    });

    setLoading(false);
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    const status = newStatus === "approved" ? "accepted" : newStatus;
    const response = await fetch(`http://127.0.0.1:8000/api/appointments/${appointmentId}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ status }) });
    if (response.ok) { await loadLiveData(); return; }
    // Try to find appointments in any of the possible keys
    let allAppointments = [];
    let storageKey = 'appointments';
    
    const possibleKeys = ['appointments', 'doctorAppointmentRequests', 'appointmentRequests'];
    
    for (const key of possibleKeys) {
      const data = JSON.parse(localStorage.getItem(key));
      if (data && Array.isArray(data)) {
        const hasAppointment = data.some(a => a.id === appointmentId);
        if (hasAppointment) {
          allAppointments = data;
          storageKey = key;
          break;
        }
      }
    }
    
    if (allAppointments.length === 0) {
      console.error("No appointments found in localStorage");
      return;
    }
    
    const updatedAppointments = allAppointments.map(app =>
      app.id === appointmentId ? { ...app, status: newStatus, updatedAt: new Date().toISOString() } : app
    );
    localStorage.setItem(storageKey, JSON.stringify(updatedAppointments));
    
    const appointment = allAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      const notifs = JSON.parse(localStorage.getItem("doctorNotifications")) || [];
      const statusMessages = {
        approved: "✅ Confirmed",
        rejected: "❌ Declined",
        completed: "📋 Completed",
        pending: "⏳ Pending",
        cancelled: "❌ Cancelled"
      };
      notifs.push({
        id: Date.now(),
        type: "appointment_update",
        patientName: appointment.patientName || appointment.patient,
        message: `Appointment with ${appointment.patientName || appointment.patient} ${statusMessages[newStatus] || "📋 Updated"}`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("doctorNotifications", JSON.stringify(notifs));
    }
    
    loadLiveData();
    window.dispatchEvent(new Event("appointmentUpdated"));
  };

  const markNotificationRead = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/notifications/${id}/read`, { method: "PATCH", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    const notifs = JSON.parse(localStorage.getItem("doctorNotifications")) || [];
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem("doctorNotifications", JSON.stringify(updated));
    loadLiveData();
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      accepted: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-gray-100 text-gray-700 border-gray-200",
      confirmed: "bg-green-100 text-green-700 border-green-200",
    };
    return statusMap[status?.toLowerCase()] || statusMap.pending;
  };

  const getRiskBadge = (risk) => {
    const riskMap = {
      high: "bg-red-100 text-red-700 border-red-200",
      moderate: "bg-orange-100 text-orange-700 border-orange-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return riskMap[risk?.toLowerCase()] || riskMap.low;
  };

  // Listen for real-time updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "appointments" || e.key === "doctorAppointmentRequests" || 
          e.key === "doctorNotifications" || e.key === "currentUser") {
        loadData();
      }
    };

    const handleAppointmentUpdate = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("appointmentUpdated", handleAppointmentUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("appointmentUpdated", handleAppointmentUpdate);
    };
  }, [doctor]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <FaSpinner className="text-4xl text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative h-screen overflow-hidden bg-cover bg-center flex"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Floating Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>

      {/* SIDEBAR */}
      <div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 flex-shrink-0 h-full flex flex-col">
        {/* Doctor Profile */}
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
              <p className="text-sm font-semibold text-gray-800 truncate">{doctor?.name}</p>
              <p className="text-xs text-gray-500 truncate">{doctor?.specialization || "Doctor"}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Online</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavItem 
            label="Dashboard" 
            icon={<FaChartLine />} 
            to="/doctor-dashboard" 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")}
          />
          <NavItem 
            label="Patients" 
            icon={<FaUsers />} 
            to="/doctor-patients" 
            active={activeTab === "patients"} 
            onClick={() => setActiveTab("patients")}
          />
          <NavItem 
            label="Appointments" 
            icon={<FaCalendarCheck />} 
            to="/doctor-appointments" 
            active={activeTab === "appointments"} 
            onClick={() => setActiveTab("appointments")}
          />
          <NavItem 
            label="Reports" 
            icon={<FaFileMedical />} 
            to="/doctor-reports" 
            active={activeTab === "reports"} 
            onClick={() => setActiveTab("reports")}
          />
          <NavItem 
            label="Prescriptions" 
            icon={<FaPrescription />} 
            to="/doctor-prescriptions" 
            active={activeTab === "prescriptions"} 
            onClick={() => setActiveTab("prescriptions")}
          />
          <NavItem 
            label="Notifications" 
            icon={<FaBell />} 
            to="/doctor-notifications" 
            active={activeTab === "notifications"} 
            onClick={() => setActiveTab("notifications")}
            badge={notifications.filter(n => !n.read).length}
          />
          <NavItem 
            label="Profile" 
            icon={<FaUserMd />} 
            to="/doctor-profile" 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")}
          />
          <NavItem 
            label="Settings" 
            icon={<FaCog />} 
            to="/doctor-settings" 
            active={activeTab === "settings"} 
            onClick={() => setActiveTab("settings")}
          />
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-pink-100/50">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/doctor-login";
            }}
            className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 px-4 py-2.5 rounded-xl hover:bg-pink-100 transition-all duration-300 text-sm font-semibold"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT - Routes */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-4 h-full overflow-y-auto">
        <Routes>
          <Route path="/" element={
            <DashboardOverview 
              doctor={doctor} 
              stats={stats} 
              appointments={appointments}
              patientUpdates={patientUpdates}
              notifications={notifications}
              updateAppointmentStatus={updateAppointmentStatus}
              markNotificationRead={markNotificationRead}
              getStatusBadge={getStatusBadge}
              getRiskBadge={getRiskBadge}
            />
          } />
          <Route path="/doctor-dashboard" element={
            <DashboardOverview 
              doctor={doctor} 
              stats={stats} 
              appointments={appointments}
              patientUpdates={patientUpdates}
              notifications={notifications}
              updateAppointmentStatus={updateAppointmentStatus}
              markNotificationRead={markNotificationRead}
              getStatusBadge={getStatusBadge}
              getRiskBadge={getRiskBadge}
            />
          } />
          <Route path="/doctor-patients" element={
            <DoctorPatients 
              doctor={doctor} 
              patientUpdates={patientUpdates} 
              getRiskBadge={getRiskBadge} 
            />
          } />
          <Route path="/doctor-appointments" element={
            <DoctorAppointments 
              doctor={doctor} 
              appointments={appointments} 
              updateAppointmentStatus={updateAppointmentStatus} 
              getStatusBadge={getStatusBadge} 
            />
          } />
          <Route path="/doctor-reports" element={
            <DoctorReports 
              doctor={doctor} 
              patientUpdates={patientUpdates} 
              getRiskBadge={getRiskBadge} 
            />
          } />
          <Route path="/doctor-prescriptions" element={
            <DoctorPrescriptions doctor={doctor} />
          } />
          <Route path="/doctor-notifications" element={
            <DoctorNotifications 
              doctor={doctor} 
              notifications={notifications} 
              markNotificationRead={markNotificationRead} 
            />
          } />
          <Route path="/doctor-profile" element={
            <DoctorProfile doctor={doctor} />
          } />
          <Route path="/doctor-settings" element={<DoctorSettings />} />
        </Routes>
      </div>
    </div>
  );
};

/* ===== NAVITEM COMPONENT ===== */
const NavItem = ({ label, icon, to, active, onClick, badge }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm ${
      active
        ? "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"
        : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
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

/* ===== STATCARD COMPONENT ===== */
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

/* ===== DASHBOARD OVERVIEW ===== */
const DashboardOverview = ({ doctor, stats, appointments, patientUpdates, notifications, updateAppointmentStatus, markNotificationRead, getStatusBadge, getRiskBadge }) => {
  return (
    <>
      {/* Top Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaUserMd className="text-pink-500" />
            Doctor Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-pink-500">Dr. {doctor?.name}</span> 👋
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-pink-500 transition-colors" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {doctor?.name?.charAt(0).toUpperCase() || "D"}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
              Dr. {doctor?.name?.split(" ")[0] || "Doctor"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        <StatCard title="Patients" value={stats.totalPatients} icon={<FaUsers />} color="pink" />
        <StatCard title="Total" value={stats.totalAppointments} icon={<FaCalendarCheck />} color="purple" />
        <StatCard title="Pending" value={stats.pendingAppointments} icon={<FaClock />} color="yellow" />
        <StatCard title="Approved" value={stats.approvedAppointments} icon={<FaCheckCircle />} color="green" />
        <StatCard title="Completed" value={stats.completedAppointments} icon={<FaCheckCircle />} color="blue" />
        <StatCard title="Cancelled" value={stats.cancelledAppointments} icon={<FaTimesCircle />} color="red" />
        <StatCard title="High Risk" value={stats.highRiskPatients} icon={<FaAmbulance />} color="orange" />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointments */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaCalendarCheck className="text-pink-500" />
              Appointment Requests
            </h3>
            <span className="text-xs text-gray-400">{appointments.length} total</span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {appointments.filter(a => a.status?.toLowerCase() === "pending").length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FaCalendarCheck className="text-4xl mx-auto mb-2 opacity-50" />
                <p>No pending appointments</p>
              </div>
            ) : (
              appointments.filter(a => a.status?.toLowerCase() === "pending").map((app) => (
                <div key={app.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-pink-100/50 hover:shadow-md transition-all">
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-gray-800">{app.patientName || app.patient}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                          {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FaCalendarAlt className="text-pink-400" /> {app.date}</span>
                        <span className="flex items-center gap-1"><FaClock className="text-pink-400" /> {app.time}</span>
                        <span className="flex items-center gap-1">
                          {app.type?.toLowerCase() === "online" ? <FaVideo className="text-sky-400" /> : <FaHospitalAlt className="text-purple-400" />}
                          {app.type?.toLowerCase() === "online" ? "Online" : "In-Person"}
                        </span>
                      </div>
                      {app.notes && <p className="text-xs text-gray-400 mt-1">📝 {app.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateAppointmentStatus(app.id, "approved")} className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 transition-all">
                        Approve
                      </button>
                      <button onClick={() => updateAppointmentStatus(app.id, "rejected")} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-all">
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Patient Updates */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FaClipboardList className="text-pink-500" />
              Patient Updates
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {patientUpdates.slice(0, 4).map((update, index) => (
                <div key={index} className="bg-pink-50/50 rounded-xl p-3 border border-pink-100/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{update.patient}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskBadge(update.risk)}`}>
                          {update.risk} Risk
                        </span>
                        <span className="text-xs text-gray-400">Score: {update.score}%</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">{update.updatedAt || "Today"}</span>
                  </div>
                </div>
              ))}
              {patientUpdates.length === 0 && (
                <p className="text-center text-gray-400 py-4 text-sm">No patient updates</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FaBell className="text-pink-500" />
              Recent Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {notifications.filter(n => !n.read).length} new
                </span>
              )}
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {notifications.slice(0, 4).map((notif) => (
                <div key={notif.id} className={`flex items-start gap-2 p-2 rounded-lg transition-all ${!notif.read ? 'bg-pink-50/50' : ''}`} onClick={() => markNotificationRead(notif.id)}>
                  <div className="w-2 h-2 rounded-full bg-pink-400 mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700">{notif.message}</p>
                    <p className="text-[10px] text-gray-400">{notif.createdAt || "Just now"}</p>
                  </div>
                  {!notif.read && <span className="text-[10px] text-pink-500">● New</span>}
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-center text-gray-400 py-4 text-sm">No notifications</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100/50 pt-6">
        <p>© 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰</p>
      </div>
    </>
  );
};

/* ===== 1. DOCTOR PATIENTS ===== */
const DoctorPatients = ({ doctor, patientUpdates, getRiskBadge }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-pink-500" />
            My Patients
          </h2>
          <p className="text-sm text-gray-500 mt-1">View and manage your patients</p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
          <span className="text-sm font-medium text-gray-700">{patientUpdates.length} patients</span>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pink-100">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Patient</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Risk Level</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Score</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Symptoms</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {patientUpdates.map((update, index) => (
                <tr key={index} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-3 font-medium text-gray-800">{update.patient}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskBadge(update.risk)}`}>
                      {update.risk || "Low"}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold">{update.score || 0}%</td>
                  <td className="py-3 px-3 text-gray-600">
                    {update.symptoms?.slice(0, 2).join(", ")}
                    {update.symptoms?.length > 2 && ` +${update.symptoms.length - 2} more`}
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{update.updatedAt || "Today"}</td>
                </tr>
              ))}
              {patientUpdates.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">No patients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ===== 2. DOCTOR APPOINTMENTS ===== */
const DoctorAppointments = ({ doctor, appointments, updateAppointmentStatus, getStatusBadge }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredAppointments = appointments.filter(app => {
    const matchSearch = app.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       app.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || app.status?.toLowerCase() === statusFilter;
    const matchType = typeFilter === "all" || app.type?.toLowerCase() === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaCalendarCheck className="text-pink-500" />
            Appointments
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage all patient appointments</p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
          <span className="text-sm font-medium text-gray-700">{appointments.length} total</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-pink-100 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        >
          <option value="all">All Types</option>
          <option value="online">Online</option>
          <option value="in-person">In-Person</option>
        </select>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pink-100">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Patient</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Date</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Time</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Type</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Status</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((app) => (
                <tr key={app.id} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-3 font-medium text-gray-800">{app.patientName || app.patient}</td>
                  <td className="py-3 px-3 text-gray-600">{app.date}</td>
                  <td className="py-3 px-3 text-gray-600">{app.time}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${app.type?.toLowerCase() === "online" ? "bg-sky-100 text-sky-700" : "bg-purple-100 text-purple-700"}`}>
                      {app.type?.toLowerCase() === "online" ? "Online" : "In-Person"}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                      {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {app.status?.toLowerCase() === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => updateAppointmentStatus(app.id, "approved")} className="text-green-600 hover:text-green-800 text-xs font-medium">✅ Approve</button>
                        <button onClick={() => updateAppointmentStatus(app.id, "rejected")} className="text-red-600 hover:text-red-800 text-xs font-medium">❌ Decline</button>
                      </div>
                    )}
                    {["approved", "accepted"].includes(app.status?.toLowerCase()) && (
                      <button onClick={() => updateAppointmentStatus(app.id, "completed")} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Mark Complete</button>
                    )}
                    {app.status?.toLowerCase() === "completed" && <span className="text-green-600 text-xs">✅ Done</span>}
                    {app.status?.toLowerCase() === "rejected" && <span className="text-red-600 text-xs">❌ Declined</span>}
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">No appointments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ===== 3. DOCTOR REPORTS ===== */
const DoctorReports = ({ doctor, patientUpdates, getRiskBadge }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaFileMedical className="text-pink-500" />
            Patient Reports
          </h2>
          <p className="text-sm text-gray-500 mt-1">View all patient health reports</p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
          <span className="text-sm font-medium text-gray-700">{patientUpdates.length} reports</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {patientUpdates.map((update, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-2xl rounded-2xl p-5 border border-pink-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-800">{update.patient}</h4>
                <p className="text-xs text-gray-500">{update.email}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskBadge(update.risk)}`}>
                {update.risk || "Low"} Risk
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Risk Score</span>
                <span className="font-semibold">{update.score || 0}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Confidence</span>
                <span className="font-semibold">{update.confidence || 0}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Symptoms</span>
                <span className="text-gray-600">{update.symptoms?.length || 0} reported</span>
              </div>
              {update.vitals && (
                <div className="mt-2 p-2 bg-pink-50 rounded-lg text-xs text-gray-600">
                  <span>Vitals: BP {update.vitals.bpSystolic}/{update.vitals.bpDiastolic} | HR {update.vitals.heartRate} bpm</span>
                </div>
              )}
            </div>
            <div className="mt-3 text-[10px] text-gray-400">Updated: {update.updatedAt || "Today"}</div>
          </div>
        ))}
        {patientUpdates.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            <FaFileMedical className="text-4xl mx-auto mb-2 opacity-50" />
            <p>No reports available</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===== 4. DOCTOR PRESCRIPTIONS ===== */
const DoctorPrescriptions = ({ doctor }) => {
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, patient: "Sarah Johnson", medication: "Prenatal Vitamins", dosage: "1 tablet daily", date: "2026-07-10", status: "active" },
    { id: 2, patient: "Priya Sharma", medication: "Iron Supplement", dosage: "2 tablets daily", date: "2026-07-08", status: "active" },
    { id: 3, patient: "Ananya Patel", medication: "Calcium + Vitamin D", dosage: "1 tablet daily", date: "2026-07-05", status: "completed" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaPrescription className="text-pink-500" />
            Prescriptions
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage patient prescriptions</p>
        </div>
        <button className="bg-gradient-to-r from-pink-500 to-sky-400 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-all">
          + New Prescription
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pink-100">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Patient</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Medication</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Dosage</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Date</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((pres) => (
                <tr key={pres.id} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-3 px-3 font-medium text-gray-800">{pres.patient}</td>
                  <td className="py-3 px-3 text-gray-600">{pres.medication}</td>
                  <td className="py-3 px-3 text-gray-600">{pres.dosage}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{pres.date}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${pres.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {pres.status.charAt(0).toUpperCase() + pres.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ===== 5. DOCTOR NOTIFICATIONS ===== */
const DoctorNotifications = ({ doctor, notifications, markNotificationRead }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaBell className="text-pink-500" />
            Notifications
          </h2>
          <p className="text-sm text-gray-500 mt-1">All your notifications</p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100">
          <span className="text-sm font-medium text-gray-700">{notifications.filter(n => !n.read).length} unread</span>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FaBell className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className={`flex items-start gap-3 p-4 rounded-xl border ${!notif.read ? 'bg-pink-50/50 border-pink-200' : 'bg-white/50 border-gray-100'} hover:shadow-md transition-all`} onClick={() => markNotificationRead(notif.id)}>
                <div className={`w-3 h-3 rounded-full mt-1 ${!notif.read ? 'bg-pink-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.createdAt || "Just now"}</p>
                </div>
                {!notif.read && <span className="text-xs text-pink-500 font-semibold">New</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== 6. DOCTOR PROFILE ===== */
const DoctorProfile = ({ doctor }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaUserMd className="text-pink-500" />
            My Profile
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage your doctor profile</p>
        </div>
        <button className="bg-gradient-to-r from-pink-500 to-sky-400 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-all">
          <FaEdit className="inline mr-2" /> Edit Profile
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
            {doctor?.name?.charAt(0).toUpperCase() || "D"}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{doctor?.name}</h3>
            <p className="text-gray-500">{doctor?.specialization || "Doctor"}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">● Online</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Verified</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-pink-50/50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="font-semibold text-gray-800">{doctor?.name}</p>
          </div>
          <div className="bg-pink-50/50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">{doctor?.email}</p>
          </div>
          <div className="bg-pink-50/50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Specialization</p>
            <p className="font-semibold text-gray-800">{doctor?.specialization || "General Practitioner"}</p>
          </div>
          <div className="bg-pink-50/50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Hospital</p>
            <p className="font-semibold text-gray-800">{doctor?.hospital || "Not specified"}</p>
          </div>
          <div className="bg-pink-50/50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-semibold text-gray-800">{doctor?.phone || "Not provided"}</p>
          </div>
          <div className="bg-pink-50/50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Experience</p>
            <p className="font-semibold text-gray-800">{doctor?.experience || "Not specified"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== 7. DOCTOR SETTINGS ===== */
const DoctorSettings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    language: "English",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("doctorSettings"));
    if (saved) {
      setSettings(saved);
    }
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
    if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    localStorage.setItem("doctorSettings", JSON.stringify(settings));
    alert("Settings Saved Successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaCog className="text-pink-500" />
            Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage your preferences</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/70 p-6 space-y-8">
        {/* Dark Mode */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-2 rounded-full">
              <FaMoon className="text-indigo-500" />
            </div>
            <div>
              <h2 className="font-bold">Dark Mode</h2>
              <p className="text-gray-500 text-sm">Enable dark theme</p>
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
              <FaBell className="text-pink-500" />
            </div>
            <div>
              <h2 className="font-bold">Notifications</h2>
              <p className="text-gray-500 text-sm">Appointment Alerts</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={() => toggleSwitch("notifications")}
            className="w-5 h-5 accent-pink-500"
          />
        </div>

        {/* Language */}
        <div>
          <label className="font-bold flex items-center gap-2 mb-3">
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
          </select>
        </div>

        {/* Password */}
        <div>
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <FaLock className="text-gray-500" /> Change Password
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
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
        </div>

        {/* Buttons */}
        <div className="flex gap-5 pt-5">
          <button
            onClick={saveSettings}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-sky-400 text-white px-8 py-3 rounded-xl hover:scale-105 transition-all"
          >
            <FaSave /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
